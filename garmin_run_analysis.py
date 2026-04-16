#!/usr/bin/env python3
"""
Garmin Connect – Today's Run Analysis
======================================
Fetches the most recent running activity from Garmin Connect (expects it to be
from today, 16 April 2026) and produces:

  1. Pace vs Time chart        → pace_vs_time.png
  2. Heart Rate vs Time chart  → hr_vs_time.png
  3. Km-by-km summary table    → printed to stdout + saved as km_table.txt

Usage
-----
Set environment variables before running:
    export GARMIN_EMAIL="your@email.com"
    export GARMIN_PASSWORD="yourpassword"
    python3 garmin_run_analysis.py

Or the script will prompt you securely if the env vars are not set.
"""

import os
import sys
import getpass
import json
from datetime import date, datetime, timedelta

import garminconnect
import pandas as pd
import matplotlib
matplotlib.use("Agg")          # headless – no display required
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from tabulate import tabulate

# ──────────────────────────────────────────────────────────────
# 1.  Credentials
# ──────────────────────────────────────────────────────────────
email    = os.environ.get("GARMIN_EMAIL")    or input("Garmin email: ")
password = os.environ.get("GARMIN_PASSWORD") or getpass.getpass("Garmin password: ")

print("\n[1/5] Authenticating with Garmin Connect …")
client = garminconnect.Garmin(email, password)
client.login()
print("      ✓ Logged in")

# ──────────────────────────────────────────────────────────────
# 2.  Find today's run
# ──────────────────────────────────────────────────────────────
TODAY = date(2026, 4, 16)
print(f"\n[2/5] Fetching activities for {TODAY} …")

activities = client.get_activities_by_date(
    TODAY.strftime("%Y-%m-%d"),
    TODAY.strftime("%Y-%m-%d"),
    "running",
)

if not activities:
    sys.exit("No running activity found for today (16 Apr 2026). "
             "Make sure the activity has been synced to Garmin Connect.")

# pick the longest run if there are multiple
activity = max(activities, key=lambda a: a.get("duration", 0))
activity_id = activity["activityId"]
print(f"      ✓ Found activity id={activity_id}  "
      f"name='{activity.get('activityName', 'Run')}'  "
      f"distance={activity.get('distance', 0)/1000:.2f} km")

# ──────────────────────────────────────────────────────────────
# 3.  Download split / track data
# ──────────────────────────────────────────────────────────────
print("\n[3/5] Downloading detailed track data …")
details   = client.get_activity_details(activity_id)
splits    = client.get_activity_splits(activity_id)
hr_data   = client.get_heart_rates(TODAY.strftime("%Y-%m-%d"))   # daily summary

# ── 3a. Build a second-by-second DataFrame from the track metrics
metrics = details.get("geoPolylineDTO", {})
samples = details.get("activityDetailMetrics", [])   # list of metric dicts per sample

# Each sample has a structure like:
#   {"metrics": [val, val, …], "metricsCount": N}
# The metric types are listed in details["metricDescriptors"]
descriptors = {m["metricsIndex"]: m["key"] for m in details.get("metricDescriptors", [])}

rows = []
for sample in samples:
    row = {}
    for idx, val in enumerate(sample.get("metrics", [])):
        key = descriptors.get(idx, f"metric_{idx}")
        row[key] = val
    rows.append(row)

df = pd.DataFrame(rows)

# Normalise common column name variants
rename_map = {}
for col in df.columns:
    cl = col.lower()
    if "directtimestamp" in cl or cl == "directtimestamp":
        rename_map[col] = "timestamp_ms"
    elif "directheartrate" in cl or cl == "directheartrate":
        rename_map[col] = "heart_rate"
    elif "directspeed" in cl or cl == "directspeed":
        rename_map[col] = "speed_ms"         # m/s
    elif "directdoublecadence" in cl:
        rename_map[col] = "cadence"          # steps/min (double cadence = full cadence)
    elif "directrunningcadence" in cl or "cadence" in cl:
        rename_map[col] = "cadence"
    elif "sumdistance" in cl or "distance" in cl:
        rename_map[col] = "distance_m"

df.rename(columns=rename_map, inplace=True)

# Convert timestamp (epoch ms) → datetime
if "timestamp_ms" in df.columns:
    df["timestamp_ms"] = pd.to_numeric(df["timestamp_ms"], errors="coerce")
    df["time"] = pd.to_datetime(df["timestamp_ms"], unit="ms", utc=True).dt.tz_convert(None)
else:
    # fall back: build a synthetic timestamp from elapsed seconds
    df["time"] = pd.to_datetime(TODAY) + pd.to_timedelta(df.index, unit="s")

df.dropna(subset=["time"], inplace=True)
df.sort_values("time", inplace=True)
df.reset_index(drop=True, inplace=True)

# Ensure numeric types
for col in ["heart_rate", "speed_ms", "cadence", "distance_m"]:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce")

# Derive pace (min/km) from speed (m/s)
if "speed_ms" in df.columns:
    df["pace_min_km"] = (1000 / 60) / df["speed_ms"].replace(0, float("nan"))
    # cap at 20 min/km to remove stopped periods
    df.loc[df["pace_min_km"] > 20, "pace_min_km"] = float("nan")

# Elapsed time in minutes (for x-axis)
df["elapsed_min"] = (df["time"] - df["time"].iloc[0]).dt.total_seconds() / 60

print(f"      ✓ {len(df)} data-points loaded")

# ──────────────────────────────────────────────────────────────
# 4.  Charts
# ──────────────────────────────────────────────────────────────
print("\n[4/5] Generating charts …")

STYLE = {
    "figure.facecolor": "#0f0f0f",
    "axes.facecolor":   "#1a1a1a",
    "axes.edgecolor":   "#444",
    "axes.labelcolor":  "#ddd",
    "xtick.color":      "#aaa",
    "ytick.color":      "#aaa",
    "grid.color":       "#333",
    "text.color":       "#eee",
    "font.family":      "monospace",
}

# ── 4a. Pace vs Time ─────────────────────────────────────────
if "pace_min_km" in df.columns:
    with plt.style.context(STYLE):
        fig, ax = plt.subplots(figsize=(12, 5))
        ax.plot(
            df["elapsed_min"],
            df["pace_min_km"],
            color="#00d4ff",
            linewidth=1.0,
            alpha=0.85,
            label="Pace",
        )
        # Rolling 30-sample smoothed line
        smooth = df["pace_min_km"].rolling(30, center=True, min_periods=1).mean()
        ax.plot(df["elapsed_min"], smooth, color="#ff6b35",
                linewidth=2.0, label="30-pt avg")

        # Y axis: format as MM:SS
        def pace_fmt(y, _):
            if y <= 0 or y != y:
                return ""
            m = int(y)
            s = int((y - m) * 60)
            return f"{m}:{s:02d}"

        ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(pace_fmt))
        ax.invert_yaxis()   # faster pace at top
        ax.set_xlabel("Elapsed time (min)")
        ax.set_ylabel("Pace (min/km)")
        ax.set_title("Pace vs Time – 16 April 2026", fontsize=13, pad=12)
        ax.grid(True, linestyle="--", alpha=0.4)
        ax.legend(framealpha=0.3)
        fig.tight_layout()
        fig.savefig("pace_vs_time.png", dpi=150)
        plt.close(fig)
    print("      ✓ pace_vs_time.png")
else:
    print("      ⚠ speed data not available – skipping pace chart")

# ── 4b. Heart Rate vs Time ───────────────────────────────────
if "heart_rate" in df.columns:
    with plt.style.context(STYLE):
        fig, ax = plt.subplots(figsize=(12, 5))

        # Colour-coded zones (rough generic zones)
        zones = [
            (0,   115, "#4ecdc4", "Z1 Easy"),
            (115, 135, "#ffe66d", "Z2 Aerobic"),
            (135, 155, "#f7b731", "Z3 Tempo"),
            (155, 170, "#fc5c65", "Z4 Threshold"),
            (170, 220, "#a55eea", "Z5 Max"),
        ]
        for lo, hi, colour, label in zones:
            ax.axhspan(lo, hi, alpha=0.12, color=colour, label=label)

        ax.plot(df["elapsed_min"], df["heart_rate"],
                color="#ff4d6d", linewidth=1.2, alpha=0.9, label="HR")
        smooth_hr = df["heart_rate"].rolling(15, center=True, min_periods=1).mean()
        ax.plot(df["elapsed_min"], smooth_hr,
                color="#ffffff", linewidth=1.8, alpha=0.7, label="15-pt avg")

        ax.set_xlabel("Elapsed time (min)")
        ax.set_ylabel("Heart Rate (bpm)")
        ax.set_title("Heart Rate vs Time – 16 April 2026", fontsize=13, pad=12)
        ax.grid(True, linestyle="--", alpha=0.3)
        # Compact legend
        handles, labels = ax.get_legend_handles_labels()
        ax.legend(handles, labels, fontsize=7, ncol=3,
                  framealpha=0.3, loc="lower right")
        fig.tight_layout()
        fig.savefig("hr_vs_time.png", dpi=150)
        plt.close(fig)
    print("      ✓ hr_vs_time.png")
else:
    print("      ⚠ heart rate data not available – skipping HR chart")

# ──────────────────────────────────────────────────────────────
# 5.  Km-by-km table
# ──────────────────────────────────────────────────────────────
print("\n[5/5] Building km-by-km table …")

table_rows = []

# Prefer official lap splits from the API
lap_list = (splits or {}).get("lapDTOs", [])

if lap_list:
    for i, lap in enumerate(lap_list, start=1):
        dist_km     = lap.get("distance", 0) / 1000
        if dist_km < 0.05:
            continue   # skip tiny partial laps
        avg_hr      = lap.get("averageHR")   or lap.get("averageHeartRate")
        max_hr      = lap.get("maxHR")       or lap.get("maxHeartRate")
        avg_speed   = lap.get("averageSpeed")  # m/s
        avg_cadence = lap.get("averageRunCadence") or lap.get("averageCadence")

        pace_str = "–"
        if avg_speed and avg_speed > 0:
            pace_sec = 1000 / avg_speed        # seconds per km
            m, s     = divmod(int(pace_sec), 60)
            pace_str = f"{m}:{s:02d} /km"

        cadence_str = f"{int(avg_cadence * 2)}" if avg_cadence else "–"  # double cadence → full

        table_rows.append({
            "KM":            f"{i}",
            "Dist (km)":     f"{dist_km:.2f}",
            "Avg Pace":      pace_str,
            "Avg HR (bpm)":  f"{int(avg_hr)}"  if avg_hr  else "–",
            "Max HR (bpm)":  f"{int(max_hr)}"  if max_hr  else "–",
            "Avg Cadence":   cadence_str,
        })

else:
    # Fall back: slice track data into 1 km buckets via distance column
    if "distance_m" in df.columns:
        df_valid = df.dropna(subset=["distance_m"])
        total_dist = df_valid["distance_m"].max()
        km_mark = 1000
        km_num  = 1
        while km_mark <= total_dist + 500:
            seg = df_valid[
                (df_valid["distance_m"] >= km_mark - 1000) &
                (df_valid["distance_m"] <  km_mark)
            ]
            if seg.empty:
                km_mark += 1000
                continue

            avg_hr  = seg["heart_rate"].mean()  if "heart_rate"  in seg else None
            max_hr  = seg["heart_rate"].max()   if "heart_rate"  in seg else None
            avg_cad = seg["cadence"].mean()     if "cadence"     in seg else None
            avg_spd = seg["speed_ms"].mean()    if "speed_ms"    in seg else None

            pace_str = "–"
            if avg_spd and avg_spd > 0:
                pace_sec = 1000 / avg_spd
                m, s     = divmod(int(pace_sec), 60)
                pace_str = f"{m}:{s:02d} /km"

            table_rows.append({
                "KM":            f"{km_num}",
                "Dist (km)":     f"{min(km_mark, total_dist)/1000:.2f}",
                "Avg Pace":      pace_str,
                "Avg HR (bpm)":  f"{avg_hr:.0f}" if avg_hr  else "–",
                "Max HR (bpm)":  f"{max_hr:.0f}" if max_hr  else "–",
                "Avg Cadence":   f"{avg_cad*2:.0f}" if avg_cad else "–",
            })
            km_mark += 1000
            km_num  += 1
    else:
        print("      ⚠ distance data not available – cannot build km table")

if table_rows:
    table_df  = pd.DataFrame(table_rows)
    table_str = tabulate(table_df, headers="keys", tablefmt="rounded_outline",
                         showindex=False)
    print("\n" + table_str)
    with open("km_table.txt", "w") as f:
        f.write(f"Km-by-km Summary – Run on 16 April 2026\n")
        f.write("=" * 60 + "\n\n")
        f.write(table_str + "\n")
    print("\n      ✓ km_table.txt")

print("\n✓ Done!  Output files:")
print("    pace_vs_time.png")
print("    hr_vs_time.png")
print("    km_table.txt")

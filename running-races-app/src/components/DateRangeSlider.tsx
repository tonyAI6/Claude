import { useId } from 'react';

export const SLIDER_MONTHS = 18;

function addMonths(base: Date, months: number): Date {
  const d = new Date(base);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatLabel(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
}

const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

// Tick positions at 0, 3, 6, 9, 12, 15, 18 months
const TICKS = [0, 3, 6, 9, 12, 15, 18];

interface Props {
  value: [number, number]; // [startMonth, endMonth] offsets from today, 0–18
  onChange: (range: [number, number]) => void;
}

export default function DateRangeSlider({ value, onChange }: Props) {
  const id = useId();
  const [start, end] = value;

  const leftPct = (start / SLIDER_MONTHS) * 100;
  const rightPct = (end / SLIDER_MONTHS) * 100;

  // When start is at the rightmost possible position, put it on top so
  // the user can drag it back left without the end thumb blocking it.
  const startZ = start >= SLIDER_MONTHS - 1 ? 5 : 3;
  const endZ = start >= SLIDER_MONTHS - 1 ? 3 : 5;

  function handleStart(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Math.min(Number(e.target.value), end - 1);
    onChange([v, end]);
  }

  function handleEnd(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Math.max(Number(e.target.value), start + 1);
    onChange([start, v]);
  }

  const startDate = addMonths(TODAY, start);
  const endDate = addMonths(TODAY, end);

  return (
    <div className="w-full select-none">
      {/* Selected range label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">
          {formatLabel(startDate)}
        </span>
        <span className="text-xs text-gray-500 px-2">→</span>
        <span className="text-sm font-semibold text-white">
          {formatLabel(endDate)}
        </span>
      </div>

      {/* Slider track area */}
      <div className="relative" style={{ height: '20px' }}>
        {/* Background track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-gray-700" />

        {/* Active fill between handles */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-orange-500"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />

        {/* Start range input — pointer-events: none on element, all on thumb via CSS */}
        <input
          id={`${id}-start`}
          type="range"
          min={0}
          max={SLIDER_MONTHS}
          step={1}
          value={start}
          onChange={handleStart}
          aria-label="Start date"
          className="dual-range-input"
          style={{ zIndex: startZ }}
        />

        {/* End range input */}
        <input
          id={`${id}-end`}
          type="range"
          min={0}
          max={SLIDER_MONTHS}
          step={1}
          value={end}
          onChange={handleEnd}
          aria-label="End date"
          className="dual-range-input"
          style={{ zIndex: endZ }}
        />
      </div>

      {/* Tick marks */}
      <div className="relative mt-3" style={{ height: '20px' }}>
        {TICKS.map((month) => {
          const pct = (month / SLIDER_MONTHS) * 100;
          const label = month === 0 ? 'Today' : formatLabel(addMonths(TODAY, month));
          return (
            <div
              key={month}
              className="absolute flex flex-col items-center"
              style={{
                left: `${pct}%`,
                transform: month === 0
                  ? 'translateX(0)'
                  : month === SLIDER_MONTHS
                  ? 'translateX(-100%)'
                  : 'translateX(-50%)',
              }}
            >
              <div className="w-px h-1.5 bg-gray-600" />
              <span className="text-gray-500 mt-0.5" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

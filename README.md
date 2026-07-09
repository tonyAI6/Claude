# Mira — an IVF Companion app 🌱

An iOS + Android app where someone going through IVF can ask anything about their
treatment — their medications, their protocol, their worries — and a warm avatar
named **Mira** answers in plain language, grounded in trusted sources.

This project is being built step by step with Claude. You don't need programming
knowledge; each part has a plain-English guide.

---

## What's here

| Folder | What it is |
| --- | --- |
| **`prototype/`** | A working demo you can open in any browser or phone. The fastest way to *feel* the app. |
| **`app/`** | The real iOS + Android app (Expo / React Native). See `app/README.md` for the beginner's guide. |
| **`knowledge-base/`** | Mira's trusted sources — the documents and curated answers she draws from. This is where you add research. |

---

## The prototype

Open `prototype/demo.html` in a browser, or use the published link Claude shared
in chat. Tap a starter question (including the real "Gonal-F 150 IU" examples) or
type your own. Try typing an urgent symptom like *"severe bloating and trouble
breathing"* to see the safety banner appear.

---

## The knowledge base

Everything Mira knows lives in `knowledge-base/`:

- **`kb.json`** — the curated, patient-friendly answers (the source of truth).
- Uploaded source documents (e.g. the ESHRE 2025 Ovarian Stimulation Guideline).
- **`links.txt`** — research links you've collected.

To grow what Mira knows, add trustworthy documents here and tell Claude to fold
them into `kb.json`. Prefer official/clinical sources (ESHRE, ASRM, HFEA, your
clinic's own handbooks, medication leaflets).

---

## The plan, in order

1. ✅ **Prototype** — see and feel the app. *(done)*
2. ✅ **Knowledge base** — real, curated content from your sources. *(started)*
3. ✅ **Real app scaffold** — runs on your phone via Expo Go. *(done)*
4. ⬜ **Live AI brain** — Claude answers conversationally via a tiny backend.
5. ⬜ **Polish** — richer avatar, more content, your branding.
6. ⬜ **Publish** — App Store + Play Store.

---

## Safety, up front

Mira gives **general education, not medical advice.** She always defers dosing
decisions and urgent symptoms to the user's own clinic, and shows a "contact your
clinic" banner for red-flag symptoms. This is not a certified medical device. If
this becomes a commercial product, get advice on medical-information regulations
in your target countries.

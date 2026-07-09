// Mira's "brain": how a question becomes an answer.
//
// Two modes:
//   1. Offline retrieval (default, no setup): matches the question against the
//      knowledge base by keyword. Works with zero configuration and no cost —
//      great for demos and for testing on your own phone.
//   2. Live AI (optional): sends the question plus the most relevant knowledge
//      to the Claude API for a natural, conversational answer. This costs a
//      small amount per message and needs a backend (see the note below).
//
// SECURITY NOTE: never put your Anthropic API key directly in the app. Anyone
// can extract it from a published app. The live-AI path below is written to
// call YOUR OWN small backend server, which holds the key secretly and forwards
// requests to Claude. The app README explains this.

import { entries, escalation } from './knowledgeBase';

export function checkRedFlags(text) {
  const s = text.toLowerCase();
  return escalation.redFlags.some((flag) => s.includes(flag));
}

export function retrieve(text) {
  const s = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const e of entries) {
    let score = 0;
    for (const kw of e.k) {
      if (s.includes(kw)) {
        score += kw.includes(' ') ? 3 : kw.length <= 3 ? 1 : 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = e;
    }
  }
  return bestScore >= 2 ? best : null;
}

const FALLBACK = {
  t: 'No confident match',
  src: 'About Mira',
  a:
    "That's a great question, and I'd rather not guess about something that " +
    "matters. The best person to ask is your fertility clinic's nurse line — " +
    "they know your specific protocol. Try one of the topics below, or " +
    "rephrase your question.",
  f: ['What is Gonal-F for?', 'Stages of an IVF cycle', 'How do I inject?', 'What is OHSS?']
};

// The offline answer used by default.
export function answerOffline(text) {
  const urgent = checkRedFlags(text);
  const entry = retrieve(text) || FALLBACK;
  return { urgent, urgentMessage: urgent ? escalation.message : null, entry };
}

// ---------------------------------------------------------------------------
// OPTIONAL live-AI path. Set BACKEND_URL to your deployed server to enable it.
// Leave it null to stay fully offline. The server is a few lines of code that
// calls the Claude API with your secret key; see app/README.md.
// ---------------------------------------------------------------------------
export const BACKEND_URL = null; // e.g. 'https://your-mira-backend.example.com/ask'

export async function answerWithAI(text) {
  if (!BACKEND_URL) return answerOffline(text);

  const urgent = checkRedFlags(text);
  // Send the top knowledge entry as grounding so the AI answers from your
  // trusted sources rather than improvising.
  const grounding = retrieve(text);
  const res = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: text, grounding })
  });
  if (!res.ok) return answerOffline(text); // graceful fallback
  const data = await res.json();
  return {
    urgent,
    urgentMessage: urgent ? escalation.message : null,
    entry: { a: data.answer, src: grounding ? grounding.src : 'AI + your sources', f: grounding ? grounding.f : [] }
  };
}

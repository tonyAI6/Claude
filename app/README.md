# Mira — the IVF Companion app

This folder is the **real iOS + Android app**, written with Expo (React Native).
One codebase runs on both iPhone and Android phones. It uses the same warm
design and the same knowledge base as the prototype you already saw.

You do **not** need to understand the code. This guide is written for someone
with no programming background. When you're ready, Claude can run every step
for you — you mostly just watch.

---

## What each file is (in plain English)

- **`App.js`** — the screen you see: the chat, the avatar, the message bubbles.
- **`src/knowledgeBase.js`** — everything Mira knows. This is the important one:
  as you gather more trusted sources, this is what grows.
- **`src/mira.js`** — the "brain" that turns a question into an answer, and the
  safety check that spots urgent symptoms.
- **`package.json` / `app.json`** — settings that tell the phone how to run the
  app (its name, icon, etc.). You rarely touch these.

---

## How to see it on YOUR phone (the easy way)

You don't need a Mac or the app stores to try it. This uses **Expo Go**, a free
app that runs your app instantly.

1. On your phone, install **Expo Go** from the App Store (iPhone) or Play Store
   (Android).
2. On a computer, from inside this `app` folder, run these two commands
   (Claude can do this for you):
   ```
   npm install
   npx expo start
   ```
3. A square barcode (QR code) appears. Open your phone's camera (iPhone) or the
   Expo Go app (Android) and point it at the code.
4. The app opens on your phone. Every time the code changes, it updates live.

That's the whole loop: change something → see it on your phone in seconds.

---

## Two "brains" — offline vs. live AI

Right now the app answers **offline**: it matches your question to the closest
entry in the knowledge base. No internet, no cost, no setup. Perfect for trying
the app and showing people.

Later, you can switch on the **live AI** brain, where Claude writes natural,
conversational answers grounded in your sources. That step needs one extra piece:

### Why you need a tiny backend (and must never put the key in the app)

To use Claude's AI, the app needs an Anthropic **API key** (a secret password
that bills your account). If you put that key inside the phone app, anyone could
extract it and run up your bill. The safe, standard pattern is:

```
  Phone app  ──►  your tiny backend server  ──►  Claude API
                  (holds the secret key)
```

The backend is a small program (a few dozen lines) that keeps the key secret and
forwards questions to Claude. When you're ready, ask Claude:
*"Build the Mira backend and walk me through deploying it."* It'll create the
server and give you click-by-click hosting instructions. Then you set
`BACKEND_URL` in `src/mira.js` and the live AI turns on.

---

## Publishing to the App Store / Play Store (when you're ready)

This is the last step, not the next one. In short you'll need:

- An **Apple Developer account** ($99/year) for the App Store, and a
  **Google Play Developer account** ($25 once) for Android.
- Expo's **EAS Build** service, which can build the iPhone app in the cloud so
  you don't even need a Mac.
- App icon, screenshots, a privacy policy, and a description — Claude can help
  produce all of these.

Don't worry about any of this yet. The order is: **try it on your phone → refine
the knowledge base and feel → add the live AI → then publish.**

---

## Important: this is not a medical device (yet)

Mira gives general education and always defers dosing and urgent questions to the
user's clinic. If you take this commercial, get advice on medical-information
regulations in your target countries (EU/US/Brazil all have rules here). Claude
flagged this early and it still stands.

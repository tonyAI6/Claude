// The app's trusted knowledge base.
//
// This is the single source of truth for what Mira knows. It mirrors
// knowledge-base/kb.json in the repo root. When you (or Claude) add or edit
// sources, update both, or wire the app to load kb.json directly.
//
// Each entry: t = topic, k = keywords used for retrieval, src = source label
// shown to the user, a = the answer, f = suggested follow-up questions,
// urgent = true if the topic itself warrants a gentle "call your clinic" nudge.

export const escalation = {
  redFlags: [
    "severe abdominal pain", "severe bloating", "rapid weight gain",
    "shortness of breath", "can't breathe", "cant breathe", "trouble breathing",
    "peeing very little", "not urinating", "dark urine", "severe vomiting",
    "can't keep fluids", "cant keep fluids", "calf pain", "leg swelling",
    "chest pain", "fainting", "heavy bleeding", "high fever", "severe headache",
    "vision changes", "allergic reaction", "swelling of face", "swelling of throat"
  ],
  message:
    "Some of what you described can be a sign of a problem that needs prompt " +
    "attention — for example ovarian hyperstimulation syndrome (OHSS), an " +
    "infection, a blood clot, or an allergic reaction. Please contact your " +
    "fertility clinic now. If you feel very unwell or have trouble breathing, " +
    "seek emergency care."
};

export const entries = [
  {
    t: "Gonal-F (follitropin alfa)",
    k: ["gonal", "gonal-f", "gonal f", "global f", "follitropin", "fsh", "150", "iu", "ui", "what is this for", "stimulation drug", "prescribed"],
    src: "Standard of care + ESHRE 2025",
    a: "Gonal-F is a brand of follitropin alfa — a man-made form of follicle-stimulating hormone (FSH). In IVF it's one of the main “stimulation” medicines: FSH tells your ovaries to grow several follicles (the little fluid sacs that each hold an egg) at once, instead of the single egg a natural cycle makes.\n\nThe dose is in IU (international units) — sometimes written “UI.” So “Gonal-F 150 IU” means 150 units a day, usually an evening injection under the skin, for about 8–12 days. Your clinic sets exactly how many days from your scans.",
    f: ["How do I know I'm injecting the right dose?", "What are the side effects?", "What is the trigger shot?"]
  },
  {
    t: "Verifying your dose",
    k: ["right dose", "correct dose", "how do i know", "injecting the right", "am i injecting", "dial", "pen", "verify", "double check", "how much"],
    src: "Standard of care",
    a: "Your dose is whatever your doctor prescribed — I can't set or change it. But I can help you confirm the pen is delivering that number. For a Gonal-F pre-filled pen:\n\n1. Wash hands; check the pen isn't expired and the liquid is clear.\n2. Attach a fresh needle.\n3. Turn the dose dial until the window reads your exact dose — for 150 IU it should show 150.\n4. If the pen runs out before the full number, your clinic will have told you how to finish from a second pen — if they didn't, call before injecting.\n\nIf the number won't dial, or anything looks off, stop and phone your clinic's nurse line.",
    f: ["Where do I inject?", "What if I injected the wrong amount?", "What time should I inject?"]
  },
  {
    t: "Where & how to inject",
    k: ["where inject", "injection site", "how to inject", "belly", "stomach", "thigh", "subcutaneous", "needle", "afraid of needles", "technique"],
    src: "Standard of care",
    a: "Most IVF stimulation injections go subcutaneously — into the fatty layer just under the skin, not muscle. The usual spot is the lower tummy, about two finger-widths to either side of the belly button (avoid the button itself). The upper outer thigh works too.\n\nGeneral steps (follow your clinic's own demo): clean with an alcohol wipe and let it dry, gently pinch a fold of skin, insert at the angle they showed you, press the plunger steadily, wait a few seconds, then withdraw. Rotate sites daily to reduce bruising. A little bruising or stinging is normal.",
    f: ["It bruised and is sore — normal?", "Can my partner inject it?", "What time of day?"]
  },
  {
    t: "The trigger shot",
    k: ["trigger", "ovidrel", "hcg", "pregnyl", "lupron trigger", "final maturation", "36 hours", "timing", "trigger time"],
    src: "ESHRE 2025 + standard of care",
    a: "The “trigger” is the injection that tells your eggs to finish maturing so they can be collected. It's given at a very precise time — egg retrieval is booked for about 34–36 hours later — so the exact clock time your clinic gives you really matters. Set an alarm.\n\nCommon triggers are hCG-based (like Ovidrel or Pregnyl), or a GnRH-agonist trigger (like a Lupron trigger), sometimes used to lower OHSS risk. If you miss or are late with the trigger, phone your clinic immediately.",
    f: ["What is OHSS?", "What happens on egg-collection day?", "What if I took it late?"]
  },
  {
    t: "OHSS",
    k: ["ohss", "hyperstimulation", "swollen ovaries", "overstimulated", "too many follicles", "bloating"],
    src: "ESHRE 2025 + standard of care",
    urgent: true,
    a: "OHSS (ovarian hyperstimulation syndrome) is when the ovaries over-respond to stimulation, swell, and can leak fluid into the tummy. Mild bloating after stimulation is common and usually settles. But OHSS is a spectrum, and the more serious form needs medical care.\n\nContact your clinic promptly if you have rapidly worsening bloating or pain, fast weight gain (e.g. more than ~1 kg a day), much less urination, vomiting that stops you keeping fluids down, or breathlessness.",
    f: ["What warning signs should I watch for?", "Can it be prevented?", "Why freeze all my embryos?"]
  },
  {
    t: "Stages of an IVF cycle",
    k: ["stages", "steps", "how does ivf work", "timeline", "process", "what happens", "overview", "phases"],
    src: "ESHRE 2025 + standard of care",
    a: "A typical IVF/ICSI cycle:\n1. Pre-treatment & baseline scan.\n2. Ovarian stimulation — daily injections (~8–12 days).\n3. Monitoring — scans/bloods every few days to adjust the dose.\n4. Antagonist injection to prevent early ovulation.\n5. Trigger shot — precisely timed.\n6. Egg collection — short procedure under sedation.\n7. Fertilisation in the lab.\n8. Embryos grown a few days.\n9. Embryo transfer — usually one; extras may be frozen.\n10. Progesterone support, then the two-week wait and a pregnancy test.",
    f: ["How long does it all take?", "What is ICSI?", "What happens on collection day?"]
  },
  {
    t: "The emotional side",
    k: ["stress", "anxious", "anxiety", "emotional", "scared", "overwhelmed", "sad", "depressed", "cope", "support", "mental health", "mood"],
    src: "Standard of care",
    a: "It's completely normal to feel a lot during IVF — hope, anxiety, irritability, sadness, and the mood effects of the hormones. The two-week wait is famously hard. None of this means you're not coping.\n\nWhat helps many people: telling a couple of trusted people, connecting with fertility support groups or counsellors, keeping some normal routine, and being gentle with yourself. If you feel persistently hopeless or have thoughts of harming yourself, please reach out to your clinic or a mental-health professional promptly.",
    f: ["Any tips for the two-week wait?", "Are mood swings from the meds?", "Does my clinic offer counselling?"]
  },
  {
    t: "What Mira can and can't do",
    k: ["what can you do", "are you a doctor", "medical advice", "reliable", "safe", "trust", "disclaimer"],
    src: "About Mira",
    a: "I'm an educational companion for people going through IVF. I can explain what your medicines are for, walk through the stages of a cycle, describe common side effects, and help you prepare questions for your clinic.\n\nWhat I can't do: I'm not a doctor. I can't diagnose you, prescribe or change a dose, or assess an urgent symptom. For anything specific to your body, and anything urgent, your clinic is always the right place.",
    f: ["What symptoms mean I should call?", "Where does your info come from?", "Can you tell me my personal dose?"]
  }
];

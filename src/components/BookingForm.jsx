import React, { useState } from "react";

const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

export default function BookingForm() {
  const [form, setForm] = useState({ org: "", event: "", date: "", audience: "", note: "", submitted: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ ...form, submitted: true });
  };

  if (form.submitted) {
    return (
      <div style={{ maxWidth: 640 }}>
        <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.2, color: "var(--accent)", marginBottom: 16 }}>Received.</div>
        <p style={{ ...fontDisplay, fontSize: 18, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.72)" }}>Casey will review and get back to you within a week with availability and next steps. If the timing and topic align, you'll hear directly.</p>
      </div>
    );
  }

  const fields = [
    { k: "org", label: "Your organization", placeholder: "Network, association, or agency name" },
    { k: "event", label: "Event name & location", placeholder: "Name, city, and venue if you have it" },
    { k: "date", label: "Date or timeframe", placeholder: "When you need Casey, or window of time" },
    { k: "audience", label: "Audience size & profile", placeholder: "How many people, and who they are" },
  ];

  return (
    <form onSubmit={handleSubmit} className="grid gap-8" style={{ maxWidth: 640 }}>
      {fields.map((f) => (
        <div key={f.k}>
          <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>{f.label}</label>
          <input type="text" required value={form[f.k]} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} placeholder={f.placeholder}
            style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
        </div>
      ))}
      <div>
        <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Anything else we should know</label>
        <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Format, topic angle, logistics, budget…"
          style={{ background: "transparent", border: "1px solid rgba(var(--ink-rgb), 0.12)", ...fontDisplay, fontSize: 16, color: "var(--ink)", padding: 16, outline: "none", width: "100%", minHeight: 100, resize: "vertical", lineHeight: 1.5 }} />
      </div>
      <button type="submit" className="self-start cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
        Request a booking →
      </button>
    </form>
  );
}
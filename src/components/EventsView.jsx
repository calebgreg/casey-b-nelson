import React, { useState } from "react";

export default function EventsView({ onBack }) {
  const [form, setForm] = useState({ org: "", event: "", date: "", audience: "", note: "", submitted: false });

  const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
  const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ ...form, submitted: true });
  };

  return (
    <section style={{ padding: "clamp(40px, 8vw, 120px) 0" }}>
      <button type="button" onClick={onBack} className="cursor-pointer" style={{ background: "transparent", border: "none", ...fontDisplay, fontSize: 13, color: "var(--muted)", marginBottom: 60, padding: 0, letterSpacing: "0.04em" }}>← back</button>

      <div style={{ marginBottom: "clamp(48px, 6vw, 72px)" }}>
        <h2 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(56px, 11vw, 140px)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: 0, color: "var(--ink)", marginBottom: 32 }}>
          Request Casey to speak.
        </h2>
        <p style={{ ...fontDisplay, fontSize: "clamp(17px, 1.3vw, 19px)", lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)", maxWidth: 600 }}>
          Networks, associations, masterminds, agencies, and conferences. If you're gathering people in the insurance channel, Casey speaks on vendor selection, market dynamics, and building real networks.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(32px, 4vw, 60px)", marginBottom: "clamp(60px, 8vw, 100px)" }}>
        {[
          { label: "Format", items: ["Keynote (30–45 min)", "Breakout session (60 min)", "Mastermind fireside chat", "Panel discussion"] },
          { label: "Audience", items: ["Agency principals", "Vendor founders", "Industry analysts", "Mixed room"] },
          { label: "Topics", items: ["Who's actually worth meeting", "Building real networks", "Vendor selection rigor", "Channel dynamics 2026"] },
        ].map((group) => (
          <div key={group.label}>
            <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(16px, 1.4vw, 19px)", color: "var(--ink)", marginBottom: 14, letterSpacing: "-0.01em" }}>{group.label}</div>
            <ul style={{ ...fontDisplay, fontSize: 15, lineHeight: 1.7, color: "rgba(var(--ink-rgb), 0.7)", margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {group.items.map((item) => (
                <li key={item} style={{ marginBottom: 8 }}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {!form.submitted ? (
        <form onSubmit={handleSubmit} className="grid gap-8" style={{ maxWidth: 640 }}>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Your organization</label>
            <input type="text" required value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="Network, association, or agency name"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Event name & location</label>
            <input type="text" required value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} placeholder="Name, city, and venue if you have it"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Date or timeframe</label>
            <input type="text" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="When you need Casey, or window of time"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Audience size & profile</label>
            <input type="text" required value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} placeholder="How many people, and who they are"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Anything else we should know</label>
            <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Format, topic angle, logistics, budget…"
              style={{ background: "transparent", border: "1px solid rgba(var(--ink-rgb), 0.12)", ...fontDisplay, fontSize: 16, color: "var(--ink)", padding: 16, outline: "none", width: "100%", minHeight: 100, resize: "vertical", lineHeight: 1.5 }} />
          </div>
          <button type="submit" className="self-start cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
            Submit request →
          </button>
        </form>
      ) : (
        <div style={{ maxWidth: 640 }}>
          <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.2, color: "var(--accent)", marginBottom: 16 }}>Received.</div>
          <p style={{ ...fontDisplay, fontSize: 18, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.72)" }}>Casey will review and get back to you within a week with availability and next steps. If the timing and topic align, you'll hear directly.</p>
        </div>
      )}
    </section>
  );
}
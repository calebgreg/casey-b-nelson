import React, { useState } from "react";

const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

export default function CommunityView({ onBack }) {
  const [form, setForm] = useState({ name: "", agency: "", email: "", submitted: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ ...form, submitted: true });
  };

  return (
    <section style={{ padding: "clamp(40px, 8vw, 120px) 0" }}>
      <button type="button" onClick={onBack} className="cursor-pointer" style={{ background: "transparent", border: "none", ...fontDisplay, fontSize: 13, color: "var(--muted)", marginBottom: 60, padding: 0, letterSpacing: "0.04em" }}>← back</button>

      <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>Property 03 · The room</div>
      <h2 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(56px, 11vw, 140px)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: "0 0 32px 0", color: "var(--ink)" }}>
        The Community.
      </h2>
      <p style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(22px, 2.2vw, 32px)", lineHeight: 1.3, letterSpacing: "-0.02em", color: "var(--ink)", maxWidth: 880, marginTop: 0, marginBottom: "clamp(48px, 6vw, 72px)" }}>
        The room where agency operators compare notes. What's working, what's broken, and what they'd never buy again — <span style={{ ...fontSerif, fontStyle: "italic", color: "var(--accent)", fontWeight: 400 }}>said out loud, off the record</span>.
      </p>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "clamp(24px, 3vw, 40px)", marginBottom: "clamp(60px, 8vw, 100px)" }}>
        {[
          { t: "Operator threads", d: "Real conversations between principals running real books. No vendors lurking, no pitch decks." },
          { t: "Live sessions", d: "Monthly calls with Casey and guests from the shows — the conversation that keeps going after the mics cut." },
          { t: "The archive", d: "Every playbook, template, and teardown from Agency X, searchable and yours to steal." },
          { t: "First access", d: "Episodes early, events first, and the vendor list briefing before anyone else sees it." },
        ].map((item) => (
          <div key={item.t}>
            <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(17px, 1.4vw, 20px)", letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: 10 }}>{item.t}</div>
            <div style={{ ...fontDisplay, fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)" }}>{item.d}</div>
          </div>
        ))}
      </div>

      <div style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1.35, letterSpacing: "-0.015em", color: "var(--ink)", maxWidth: 720, marginBottom: 36, paddingTop: "clamp(24px, 3vw, 40px)", borderTop: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
        Request an invite.
      </div>
      {!form.submitted ? (
        <form onSubmit={handleSubmit} className="grid gap-8" style={{ maxWidth: 640 }}>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Your name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="First and last"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Agency</label>
            <input type="text" required value={form.agency} onChange={(e) => setForm({ ...form, agency: e.target.value })} placeholder="Agency name and city"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@youragency.com"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <button type="submit" className="self-start cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
            Request an invite →
          </button>
        </form>
      ) : (
        <div style={{ maxWidth: 640 }}>
          <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.2, color: "var(--accent)", marginBottom: 16 }}>Request received.</div>
          <p style={{ ...fontDisplay, fontSize: 18, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.72)" }}>The room stays small on purpose. If it's a fit, you'll get an invite directly from Casey.</p>
        </div>
      )}
    </section>
  );
}
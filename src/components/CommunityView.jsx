import React, { useState } from "react";
import { MessageSquare, Lock } from "lucide-react";

const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

const threads = [
  { title: "Who's actually renewed their AMS contract this year and why?", replies: 47, tag: "Tech stack", last: "12 min ago", hot: true },
  { title: "Producer comp plans — post yours, roast mine", replies: 89, tag: "People", last: "38 min ago", hot: true },
  { title: "Carrier just pulled out of our biggest class. War room thread.", replies: 63, tag: "Markets", last: "1 hr ago", hot: true },
  { title: "The Renewal Rebuild framework — 60 days in, my numbers", replies: 31, tag: "Agency X", last: "3 hrs ago", hot: false },
  { title: "Anyone else's E&O quote double? Comparing notes.", replies: 54, tag: "Operations", last: "5 hrs ago", hot: false },
  { title: "Hiring my first ops manager — job description teardown", replies: 22, tag: "People", last: "yesterday", hot: false },
];

const programming = [
  { day: "First Tuesday", name: "The Operators Call", desc: "Monthly live session with Casey. One agency problem, worked in public, members in the room." },
  { day: "Third Thursday", name: "Guest AMA", desc: "The people from Agency X episodes and Miced Up stages, taking member questions off the record." },
  { day: "Always on", name: "The threads", desc: "Vendor comparisons, comp plans, carrier intel — the conversations that can't happen on LinkedIn." },
  { day: "Quarterly", name: "The list briefing", desc: "The vendor list, annotated. Who's earning their spot, who's slipping, before anyone outside sees it." },
];

const stats = [
  { num: "400+", label: "Operators", sub: "Principals and ops leads, all verified" },
  { num: "1,200+", label: "Threads", sub: "Searchable, honest, vendor-free" },
  { num: "24", label: "Live calls a year", sub: "Recorded and archived for members" },
];

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

      {/* STATS */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: "rgba(var(--ink-rgb), 0.12)", border: "1px solid rgba(var(--ink-rgb), 0.12)", marginBottom: "clamp(80px, 10vw, 140px)" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "var(--site-bg)", padding: "clamp(28px, 3.5vw, 44px) clamp(20px, 3vw, 36px)" }}>
            <div style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(48px, 6vw, 80px)", lineHeight: 0.95, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: 14 }}>{s.num}</div>
            <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(15px, 1.2vw, 17px)", color: "var(--ink)", marginBottom: 6, letterSpacing: "-0.01em" }}>{s.label}</div>
            <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(13px, 1vw, 15px)", lineHeight: 1.4, color: "rgba(var(--ink-rgb), 0.5)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* LIVE THREADS */}
      <div style={{ marginBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h3 style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0, color: "var(--ink)" }}>Inside, right now.</h3>
          <span className="inline-flex items-center gap-1.5" style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(14px, 1.2vw, 17px)", color: "var(--accent)" }}><Lock size={13} /> members only</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
          {threads.map((t) => (
            <div key={t.title} className="grid items-center" style={{ gridTemplateColumns: "1fr auto", gap: "clamp(10px, 3vw, 40px)", padding: "clamp(18px, 2.2vw, 26px) 0", borderBottom: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
              <div>
                <div className="flex items-center flex-wrap" style={{ gap: 10, marginBottom: 6 }}>
                  <span style={{ ...fontDisplay, fontWeight: 500, fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)" }}>{t.tag}</span>
                  {t.hot && <span style={{ ...fontSerif, fontStyle: "italic", fontSize: 12, color: "rgba(var(--ink-rgb), 0.45)" }}>active now</span>}
                </div>
                <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(16px, 1.7vw, 23px)", letterSpacing: "-0.015em", color: "var(--ink)", lineHeight: 1.25, filter: "blur(0px)" }}>{t.title}</div>
              </div>
              <div className="text-right" style={{ ...fontDisplay, fontSize: 12, color: "var(--muted)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                <div className="inline-flex items-center gap-1.5" style={{ color: "rgba(var(--ink-rgb), 0.6)" }}><MessageSquare size={12} /> {t.replies}</div>
                <div style={{ marginTop: 4 }}>{t.last}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROGRAMMING */}
      <div style={{ marginBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h3 style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0, color: "var(--ink)" }}>The programming.</h3>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: "rgba(var(--ink-rgb), 0.12)", border: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
          {programming.map((p) => (
            <div key={p.name} style={{ background: "var(--site-bg)", padding: "clamp(28px, 3.5vw, 44px)" }}>
              <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 16 }}>{p.day}</div>
              <div style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(19px, 1.8vw, 26px)", letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 12 }}>{p.name}</div>
              <div style={{ ...fontDisplay, fontSize: 15, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)" }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* INVITE */}
      <div style={{ paddingTop: "clamp(24px, 3vw, 40px)", borderTop: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
        <div style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1.35, letterSpacing: "-0.015em", color: "var(--ink)", maxWidth: 720, marginBottom: 16 }}>
          Request an invite.
        </div>
        <p style={{ ...fontDisplay, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.6)", maxWidth: 640, marginTop: 0, marginBottom: 36 }}>
          Operators only — principals and the people running the desk. No vendors, no recruiters, no lurkers. Every member is verified.
        </p>
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
      </div>
    </section>
  );
}
import React from "react";
import { Mic, Play, ArrowDownToLine } from "lucide-react";

const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

const clips = [
  { title: "\"Your AMS isn't the problem. Your intake is.\"", ep: "Ep 04", dur: "0:58", views: "41K" },
  { title: "The 15-minute renewal huddle that saved a book", ep: "Ep 03", dur: "1:24", views: "28K" },
  { title: "Why producers ignore your new tool (and always will)", ep: "Ep 03", dur: "0:47", views: "63K" },
  { title: "Firing a carrier, live, on speakerphone", ep: "Ep 02", dur: "2:11", views: "112K" },
  { title: "The org chart every 10-person agency gets wrong", ep: "Ep 02", dur: "1:03", views: "35K" },
  { title: "\"Stop hiring CSRs to do data entry\"", ep: "Ep 01", dur: "0:52", views: "89K" },
];

const frameworks = [
  { name: "The Renewal Rebuild", desc: "The 90-day process for taking a neglected renewal book from sticky notes to a system. Used on camera in Ep 04.", type: "Playbook · 14 pages" },
  { name: "Producer Adoption Scorecard", desc: "How to tell in 30 days whether a new tool will survive contact with your producers.", type: "Scorecard · 2 pages" },
  { name: "The Intake Audit", desc: "Trace one submission through your agency and find where the hours leak. Timed worksheet included.", type: "Worksheet · 6 pages" },
  { name: "Carrier Scorecard", desc: "The quarterly review that tells you which carrier relationships to feed and which to fire.", type: "Template · 4 pages" },
];

const learnings = [
  { n: "01", t: "The bottleneck is never where the owner thinks it is.", d: "Four agencies in, the owner's diagnosis has been wrong every time. Walk the floor before you buy anything." },
  { n: "02", t: "Nobody owns rollout, so rollout dies.", d: "Every failed tool we've found was bought with enthusiasm and implemented by no one. Assign an owner or don't sign." },
  { n: "03", t: "Service teams protect broken processes.", d: "Not out of laziness, but out of fear. The workaround is the only thing that's never failed them. Fix the fear first." },
  { n: "04", t: "The renewal book is the agency.", d: "New business gets the meetings, renewals pay the payroll. Every rescue starts in the same place." },
];

export default function AgencyXView({ onBack }) {
  return (
    <section style={{ padding: "clamp(40px, 8vw, 120px) 0" }}>
      <button type="button" onClick={onBack} className="cursor-pointer" style={{ background: "transparent", border: "none", ...fontDisplay, fontSize: 13, color: "var(--muted)", marginBottom: 60, padding: 0, letterSpacing: "0.04em" }}>← back</button>

      <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>Property 01 · The show</div>
      <h2 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(56px, 11vw, 168px)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: "0 0 clamp(28px, 5vw, 56px) 0", color: "var(--ink)" }}>
        Agency X.
      </h2>

      {/* SHOW + LATEST EPISODE */}
      <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px, 4vw, 60px)", marginBottom: "clamp(80px, 10vw, 140px)" }}>
        <div>
          <div style={{ ...fontSerif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(30px, 3.5vw, 48px)", lineHeight: 1.1, color: "var(--accent)", marginBottom: 24, maxWidth: 540 }}>
            A real agency, rebuilt in the open <Mic size={28} style={{ display: "inline", verticalAlign: "middle", marginLeft: "0.2em" }} />
          </div>
          <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(18px, 1.4vw, 22px)", lineHeight: 1.5, color: "rgba(var(--ink-rgb), 0.78)", maxWidth: 460, marginBottom: 32 }}>
            The show, the clips, the frameworks, and the field notes. We walk the floor of a real agency, find what's broken, fix it on camera, and publish everything we learn.
          </div>
          <div className="flex gap-3.5 flex-wrap">
            {["Apple Podcasts", "Spotify", "YouTube", "RSS"].map((p) => (
              <a key={p} href="#"
                style={{ ...fontDisplay, fontWeight: 500, fontSize: 13, letterSpacing: "0.02em", color: "rgba(var(--ink-rgb), 0.6)", textDecoration: "none", paddingBottom: 4, borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", transition: "color 0.2s, border-color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderBottomColor = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(var(--ink-rgb), 0.6)"; e.currentTarget.style.borderBottomColor = "rgba(var(--ink-rgb), 0.2)"; }}>
                {p} ↗
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2.5" style={{ ...fontDisplay, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
            Latest · Ep 04
          </div>
          <h3 style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(26px, 2.4vw, 38px)", lineHeight: 1.15, letterSpacing: "-0.025em", color: "var(--ink)", marginTop: 0, marginBottom: 14 }}>
            The renewal book nobody had touched in three years.
          </h3>
          <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 17, color: "rgba(var(--ink-rgb), 0.6)", marginBottom: 20 }}>on the ground at [agency name]</div>
          <p style={{ ...fontDisplay, fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: "rgba(var(--ink-rgb), 0.62)", margin: "0 0 24px 0" }}>
            A renewal process running on sticky notes, and what it looks like rebuilt. The framework we used is below, free.
          </p>
          <button type="button" className="inline-flex items-center gap-2.5 cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "13px 22px", letterSpacing: "0.02em" }}>
            ▸ Play episode · 47:23
          </button>
        </div>
      </div>

      {/* CLIPS */}
      <div style={{ marginBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h3 style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0, color: "var(--ink)" }}>The clips.</h3>
          <span style={{ ...fontDisplay, fontWeight: 500, fontSize: 14, color: "var(--muted)" }}>({clips.length})</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: "rgba(var(--ink-rgb), 0.12)", border: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
          {clips.map((c) => (
            <div key={c.title} className="cursor-pointer flex flex-col" style={{ background: "var(--site-bg)", padding: "clamp(24px, 2.5vw, 36px)", transition: "background 0.3s", minHeight: 200 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--panel)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--site-bg)")}>
              <div className="flex items-center justify-between" style={{ marginBottom: "auto" }}>
                <span className="inline-flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(var(--accent-rgb), 0.4)", color: "var(--accent)" }}><Play size={13} /></span>
                <span style={{ ...fontDisplay, fontSize: 12, color: "var(--muted)", letterSpacing: "0.04em" }}>{c.dur}</span>
              </div>
              <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(16px, 1.4vw, 19px)", lineHeight: 1.3, letterSpacing: "-0.015em", color: "var(--ink)", margin: "28px 0 12px 0" }}>{c.title}</div>
              <div className="flex justify-between" style={{ ...fontDisplay, fontSize: 12, color: "var(--muted)", letterSpacing: "0.04em" }}>
                <span>{c.ep}</span>
                <span>{c.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FRAMEWORKS */}
      <div style={{ marginBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h3 style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0, color: "var(--ink)" }}>The frameworks.</h3>
          <span style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(14px, 1.2vw, 17px)", color: "var(--accent)" }}>free to steal</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
          {frameworks.map((f, i) => (
            <div key={f.name} className="grid cursor-pointer items-center" style={{ gridTemplateColumns: "40px 1fr auto", gap: "clamp(10px, 3vw, 40px)", padding: "clamp(20px, 2.5vw, 28px) 0", borderBottom: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
              <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 13, color: "var(--muted)", letterSpacing: "0.04em" }}>{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(18px, 1.8vw, 26px)", letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 6 }}>{f.name}</div>
                <div style={{ ...fontDisplay, fontSize: 15, lineHeight: 1.5, color: "rgba(var(--ink-rgb), 0.6)", maxWidth: 640 }}>{f.desc}</div>
              </div>
              <div className="flex items-center gap-2.5" style={{ ...fontDisplay, fontSize: 13, color: "var(--accent)", whiteSpace: "nowrap" }}>
                <span className="hidden sm:inline" style={{ color: "var(--muted)" }}>{f.type}</span>
                <ArrowDownToLine size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEARNINGS */}
      <div>
        <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h3 style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0, color: "var(--ink)" }}>The learnings.</h3>
          <span style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(14px, 1.2vw, 17px)", color: "var(--accent)" }}>field notes from the rebuild</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(28px, 4vw, 56px)" }}>
          {learnings.map((l) => (
            <div key={l.n}>
              <div style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 3vw, 44px)", color: "rgba(var(--accent-rgb), 0.5)", letterSpacing: "-0.03em", marginBottom: 12 }}>{l.n}</div>
              <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(17px, 1.5vw, 21px)", lineHeight: 1.3, letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: 10 }}>{l.t}</div>
              <div style={{ ...fontDisplay, fontSize: 15, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)" }}>{l.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
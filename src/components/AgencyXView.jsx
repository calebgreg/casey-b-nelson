import React from "react";
import { Mic } from "lucide-react";

const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

export default function AgencyXView({ onBack }) {
  return (
    <section style={{ padding: "clamp(40px, 8vw, 120px) 0" }}>
      <button type="button" onClick={onBack} className="cursor-pointer" style={{ background: "transparent", border: "none", ...fontDisplay, fontSize: 13, color: "var(--muted)", marginBottom: 60, padding: 0, letterSpacing: "0.04em" }}>← back</button>

      <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>Property 01 · The show</div>
      <h2 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(56px, 11vw, 168px)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: "0 0 clamp(28px, 5vw, 56px) 0", color: "var(--ink)" }}>
        Agency X.
      </h2>

      <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px, 4vw, 60px)" }}>
        <div>
          <div style={{ ...fontSerif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(30px, 3.5vw, 48px)", lineHeight: 1.1, color: "var(--accent)", marginBottom: 24, maxWidth: 540 }}>
            A real agency, rebuilt in the open <Mic size={28} style={{ display: "inline", verticalAlign: "middle", marginLeft: "0.2em" }} />
          </div>
          <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(18px, 1.4vw, 22px)", lineHeight: 1.5, color: "rgba(var(--ink-rgb), 0.78)", maxWidth: 460, marginBottom: 32 }}>
            Behind the scenes of a real agency. Walking the floor, finding what's broken, and installing best practices one episode at a time. No theory, no vendor pitch — just the work.
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
            We open the books at a real agency, find where the hours are leaking, and fix it on camera. This episode: a renewal process running on sticky notes, and what it looks like rebuilt.
          </p>
          <button type="button" className="inline-flex items-center gap-2.5 cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "13px 22px", letterSpacing: "0.02em" }}>
            ▸ Play episode · 47:23
          </button>
        </div>
      </div>
    </section>
  );
}
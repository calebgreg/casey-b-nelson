import React from "react";

const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

const properties = [
  { id: "agencyx", num: "01", tag: "The show", name: "Agency X", body: "A real agency, rebuilt in the open. Walking the floor, finding what's broken, and fixing it on camera, one episode at a time.", cta: "Watch & listen →" },
  { id: "micedup", num: "02", tag: "The stage", name: "Miced Up", body: "Casey, live. Keynotes, panels, and fireside chats for networks, associations, and conferences across the insurance channel.", cta: "Book Casey →" },
  { id: "community", num: "03", tag: "The room", name: "The Community", body: "Where agency operators compare notes: what's working, what's broken, and what they'd never buy again. Off the record.", cta: "Request an invite →" },
];

export default function PropertiesSection({ onNav }) {
  return (
    <section style={{ padding: "clamp(100px, 14vw, 200px) 0 clamp(80px, 10vw, 140px) 0" }}>
      <div className="flex items-baseline gap-4 md:gap-5" style={{ marginBottom: "clamp(28px, 5vw, 56px)" }}>
        <h2 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(56px, 11vw, 168px)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: 0, color: "var(--ink)" }}>
          The properties.
        </h2>
        <span style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(14px, 1.4vw, 18px)", color: "var(--muted)", letterSpacing: "0.02em" }}>(3)</span>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "rgba(var(--ink-rgb), 0.12)", border: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
        {properties.map((p) => (
          <div key={p.id} onClick={() => onNav(p.id)} className="cursor-pointer flex flex-col" style={{ background: "var(--site-bg)", padding: "clamp(32px, 4vw, 56px)", transition: "background 0.3s", minHeight: "clamp(280px, 30vw, 420px)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--panel)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--site-bg)")}>
            <div className="flex items-baseline justify-between" style={{ marginBottom: "auto" }}>
              <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 13, color: "var(--muted)", letterSpacing: "0.04em" }}>{p.num}</div>
              <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 14, color: "var(--accent)" }}>{p.tag}</div>
            </div>
            <div style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(34px, 3.6vw, 52px)", lineHeight: 1, letterSpacing: "-0.035em", color: "var(--ink)", margin: "clamp(32px, 5vw, 64px) 0 18px 0" }}>{p.name}</div>
            <div style={{ ...fontDisplay, fontSize: 15, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)", marginBottom: 24 }}>{p.body}</div>
            <div style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent)", letterSpacing: "0.02em" }}>{p.cta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
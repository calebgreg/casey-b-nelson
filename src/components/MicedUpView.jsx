import React, { useState } from "react";
import BookingForm from "@/components/BookingForm";

const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

const road = [
  { date: "Aug 14, 2026", event: "IIABA Young Agents Summit", where: "Nashville, TN", role: "Keynote", status: "Confirmed" },
  { date: "Sep 09, 2026", event: "Applied Net", where: "Las Vegas, NV", role: "Breakout session", status: "Confirmed" },
  { date: "Oct 02, 2026", event: "Mastermind: The Rooftop Group", where: "Austin, TX", role: "Fireside chat", status: "Confirmed" },
  { date: "Nov 12, 2026", event: "Insurtech Hartford", where: "Hartford, CT", role: "Main stage", status: "Confirmed" },
];

const roadNotes = [
  { t: "The rooms are smarter than the content.", d: "Most conference programming underestimates the operators in the seats. The Q&A is always better than the keynote before it. Nashville proved it again.", where: "from Nashville" },
  { t: "Nobody wants another vendor panel.", d: "The sessions that fill up are operators talking about what broke. The ones that empty out are sponsored. Every organizer knows it; few act on it.", where: "from Vegas" },
  { t: "Small rooms move markets.", d: "The 20-person mastermind produced more real decisions than the 600-person main stage. If you're gathering people, gather fewer of them for longer.", where: "from Austin" },
];

const shoutouts = [
  { who: "The Rooftop Group", what: "Ran the tightest mastermind agenda I've seen this year. Ninety minutes, zero filler, everyone left with homework." },
  { who: "Sarah at [agency], Ohio", what: "Stood up in the Q&A and corrected my renewal math in front of 400 people. She was right. That's the channel at its best." },
  { who: "Applied Net volunteers", what: "The unpaid people who make the biggest event in the channel actually run. Nobody thanks them from stage. Consider it done." },
];

export default function MicedUpView({ onBack }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section style={{ padding: "clamp(40px, 8vw, 120px) 0" }}>
      <button type="button" onClick={onBack} className="cursor-pointer" style={{ background: "transparent", border: "none", ...fontDisplay, fontSize: 13, color: "var(--muted)", marginBottom: 60, padding: 0, letterSpacing: "0.04em" }}>← back</button>

      <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 20 }}>Property 02 · The stage</div>
      <div className="flex flex-wrap items-end justify-between" style={{ gap: 24, marginBottom: "clamp(48px, 6vw, 72px)" }}>
        <div>
          <h2 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(56px, 11vw, 140px)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: "0 0 32px 0", color: "var(--ink)" }}>
            Miced Up.
          </h2>
          <p style={{ ...fontDisplay, fontSize: "clamp(17px, 1.3vw, 19px)", lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)", maxWidth: 600, margin: 0 }}>
            Casey on the road. The stages, the learnings, and the people worth calling out. Keynotes, panels, and fireside chats across the insurance channel.
          </p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
          Book Casey →
        </button>
      </div>

      {/* ON THE ROAD */}
      <div style={{ marginBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h3 style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0, color: "var(--ink)" }}>On the road.</h3>
          <span style={{ ...fontDisplay, fontWeight: 500, fontSize: 14, color: "var(--muted)" }}>2026</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
          {road.map((g) => (
            <div key={g.event} className="grid items-center" style={{ gridTemplateColumns: "minmax(90px, 130px) 1fr auto", gap: "clamp(10px, 3vw, 40px)", padding: "clamp(20px, 2.5vw, 28px) 0", borderBottom: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
              <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 13, color: "var(--muted)", letterSpacing: "0.04em" }}>{g.date}</div>
              <div>
                <div style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(18px, 2vw, 28px)", letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 4 }}>{g.event}</div>
                <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 14, color: "rgba(var(--ink-rgb), 0.55)" }}>{g.where} · {g.role}</div>
              </div>
              <div className="hidden sm:inline-flex items-center gap-2" style={{ ...fontDisplay, fontSize: 12, color: "var(--accent)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
                {g.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LEARNINGS FROM THE ROAD */}
      <div style={{ marginBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h3 style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0, color: "var(--ink)" }}>From the road.</h3>
          <span style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(14px, 1.2vw, 17px)", color: "var(--accent)" }}>what the rooms taught me</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, background: "rgba(var(--ink-rgb), 0.12)", border: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
          {roadNotes.map((n) => (
            <div key={n.t} style={{ background: "var(--site-bg)", padding: "clamp(28px, 3.5vw, 44px)" }}>
              <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 13, color: "var(--accent)", marginBottom: 16 }}>{n.where}</div>
              <div style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(19px, 1.8vw, 26px)", lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 14 }}>{n.t}</div>
              <div style={{ ...fontDisplay, fontSize: 15, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)" }}>{n.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SHOUTOUTS */}
      <div style={{ marginBottom: "clamp(80px, 10vw, 140px)" }}>
        <div className="flex items-baseline gap-4" style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <h3 style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(32px, 4.5vw, 64px)", lineHeight: 1, letterSpacing: "-0.035em", margin: 0, color: "var(--ink)" }}>The shoutouts.</h3>
          <span style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(14px, 1.2vw, 17px)", color: "var(--accent)" }}>credit where it's due</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(28px, 4vw, 56px)" }}>
          {shoutouts.map((s) => (
            <div key={s.who} style={{ paddingLeft: 18, borderLeft: "2px solid var(--accent)" }}>
              <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(17px, 1.5vw, 21px)", letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: 10 }}>{s.who}</div>
              <div style={{ ...fontDisplay, fontSize: 15, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)" }}>{s.what}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING */}
      <div id="booking" style={{ paddingTop: "clamp(24px, 3vw, 40px)", borderTop: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
        <div style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1.35, letterSpacing: "-0.015em", color: "var(--ink)", maxWidth: 720, marginBottom: 16 }}>
          Gathering people in the channel?
        </div>
        <p style={{ ...fontDisplay, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.6)", maxWidth: 640, marginTop: 0, marginBottom: 32 }}>
          Networks, associations, masterminds, agencies, and conferences: put Casey on your stage.
        </p>
        {!showForm ? (
          <button type="button" onClick={() => setShowForm(true)} className="cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
            Request a booking →
          </button>
        ) : (
          <BookingForm />
        )}
      </div>
    </section>
  );
}
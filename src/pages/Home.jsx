import React, { useState, useEffect, useRef } from "react";
import VendorIntroDrawer from "@/components/VendorIntroDrawer";
import SiteHeader from "@/components/SiteHeader";
import PropertiesSection from "@/components/PropertiesSection";
import AgencyXView from "@/components/AgencyXView";
import MicedUpView from "@/components/MicedUpView";
import CommunityView from "@/components/CommunityView";

export default function Home({ initialView = "home" }) {
  const [activeView, setActiveView] = useState(initialView);
  const [agencyForm, setAgencyForm] = useState({ agency: "", problem: "", submitted: false });
  const [briefSignup, setBriefSignup] = useState({ email: "", submitted: false });
  const [hoveredVendor, setHoveredVendor] = useState(null);
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 });
  const [selectedVendor, setSelectedVendor] = useState(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });

  // Load fonts
  useEffect(() => {
    const id = "cbn-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Instrument+Serif:ital@0;1&family=Ms+Madi&display=swap";
    document.head.appendChild(link);
  }, []);

  const activeViewRef = useRef(activeView);
  useEffect(() => { activeViewRef.current = activeView; }, [activeView]);

  // Hero network animation — runs once, persists across view changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let nodes = [];
    let connections = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const rect = canvas.getBoundingClientRect();
    const NODE_COUNT = 56;
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1 + Math.random() * 1.4,
      });
    }

    const spawnConnection = () => {
      if (activeViewRef.current !== "home") return;
      const a = Math.floor(Math.random() * nodes.length);
      let b = Math.floor(Math.random() * nodes.length);
      while (b === a) b = Math.floor(Math.random() * nodes.length);
      connections.push({ a, b, life: 0, max: 180 + Math.random() * 120 });
    };
    const spawnInterval = setInterval(spawnConnection, 900);

    const cursor = cursorRef.current;
    const draw = () => {
      // Still tick nodes so positions stay alive; skip drawing if not on home
      if (activeViewRef.current !== "home") {
        nodes.forEach((n) => {
          n.x += n.vx;
          n.y += n.vy;
          const r = canvas.getBoundingClientRect();
          if (n.x < 0 || n.x > r.width) n.vx *= -1;
          if (n.y < 0 || n.y > r.height) n.vy *= -1;
        });
        raf = requestAnimationFrame(draw);
        return;
      }
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      const isLight = document.documentElement.dataset.theme === "light";
      const inkRGB = isLight ? "23, 20, 15" : "240, 235, 224";
      const accRGB = isLight ? "29, 158, 140" : "61, 202, 184";
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > r.width) n.vx *= -1;
        if (n.y < 0 || n.y > r.height) n.vy *= -1;
        const dx = n.x - cursor.x;
        const dy = n.y - cursor.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 180);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + proximity * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${inkRGB}, ${0.18 + proximity * 0.65})`;
        ctx.fill();
      });
      connections = connections.filter((c) => c.life < c.max);
      connections.forEach((c) => {
        c.life++;
        const t = c.life / c.max;
        let alpha = 0;
        if (t < 0.2) alpha = t / 0.2;
        else if (t > 0.7) alpha = 1 - (t - 0.7) / 0.3;
        else alpha = 1;
        const a = nodes[c.a];
        const b = nodes[c.b];
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${accRGB}, ${alpha * 0.55})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accRGB}, ${alpha * 0.9})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const handleMove = (e) => {
      const r = canvas.getBoundingClientRect();
      cursor.x = e.clientX - r.left;
      cursor.y = e.clientY - r.top;
    };
    const handleLeave = () => { cursor.x = -9999; cursor.y = -9999; };
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(spawnInterval);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const goTo = (v) => { setActiveView(v); window.scrollTo({ top: 0 }); };

  const vendors = [
    { name: "1Fort", category: "Commercial Lines", since: "07·26", thumb: "https://base44.app/api/apps/6a037576ebf42363ca2506d2/files/mp/public/6a037576ebf42363ca2506d2/52ef299e0_1fort-transparent-v2.png", thumbFit: "contain" },
    { name: "Submissions Co.", category: "Submissions", since: "03·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/1a13e9ac9_generated_image.png" },
    { name: "AgencyBeam", category: "AMS", since: "01·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/8800b4fd6_generated_image.png" },
    { name: "Hearth Compare", category: "Personal Lines", since: "03·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/de2946259_generated_image.png" },
    { name: "BenefitsBeam", category: "Benefits", since: "02·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/ea9e8aa0c_generated_image.png" },
    { name: "ClaimsFlow", category: "Claims", since: "03·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/22b20e4f6_generated_image.png" },
    { name: "Verdant Loss", category: "Loss Control", since: "04·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/71ec5eec7_generated_image.png" },
    { name: "Certify Layer", category: "Certificates", since: "12·25", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/0724032f9_generated_image.png" },
    { name: "Threadwork", category: "Marketing", since: "04·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/896f542e5_generated_image.png" },
    { name: "Ledger CRM", category: "CRM", since: "01·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/771d9fa83_generated_image.png" },
    { name: "QuoteForge", category: "Raters", since: "02·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/0cd2fe5aa_generated_image.png" },
    { name: "Marketwise", category: "Data", since: "02·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/cbdd4bebe_generated_image.png" },
    { name: "Northsight", category: "Data", since: "04·26", thumb: "https://media.base44.com/images/public/6a037576ebf42363ca2506d2/0092fe2ab_generated_image.png" },
  ];

  const submitAgencyForm = (e) => { e.preventDefault(); setAgencyForm({ ...agencyForm, submitted: true }); };
  const submitBriefSignup = (e) => { e.preventDefault(); setBriefSignup({ ...briefSignup, submitted: true }); };

  const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
  const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };
  const fontScript = { fontFamily: '"Ms Madi", "Brush Script MT", cursive' };

  const Bracket = ({ children, onClick }) => (
    <span onClick={onClick} className={onClick ? "cursor-pointer" : ""} style={{ ...fontSerif, fontStyle: "italic", color: "var(--accent)", fontWeight: 400, position: "relative" }}>
      <span style={{ color: "rgba(var(--accent-rgb), 0.4)", fontWeight: 300, fontStyle: "normal", marginRight: "0.06em" }}>[</span>
      {children}
      <span style={{ color: "rgba(var(--accent-rgb), 0.4)", fontWeight: 300, fontStyle: "normal", marginLeft: "0.06em" }}>]</span>
    </span>
  );

  const SectionLabel = ({ children, count }) => (
    <div className="flex items-baseline gap-4 md:gap-5" style={{ marginBottom: "clamp(28px, 5vw, 56px)" }}>
      <h2 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(56px, 11vw, 168px)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: 0, color: "var(--ink)" }}>
        {children}
      </h2>
      {count !== undefined && (
        <span style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(14px, 1.4vw, 18px)", color: "var(--muted)", letterSpacing: "0.02em" }}>({count})</span>
      )}
    </div>
  );


  // ---------------- VIEWS ----------------

  const HomeView = () => (
    <>
      {/* HERO */}
      <section className="relative flex flex-col justify-between" style={{ minHeight: "calc(100vh - 80px)", paddingTop: "clamp(60px, 12vh, 140px)", paddingBottom: "clamp(60px, 8vh, 100px)" }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "auto" }} />

        <div className="relative z-10 pointer-events-none">

          <h1 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(34px, 8.8vw, 210px)", lineHeight: 0.88, letterSpacing: "-0.045em", margin: 0, color: "var(--ink)", maxWidth: 1480 }}>
            <span style={{ whiteSpace: "nowrap" }}>Content for the people</span> <Bracket>rebuilding insurance</Bracket>.
          </h1>
        </div>

        <div className="relative z-10 pointer-events-none" style={{ maxWidth: 620, ...fontDisplay, fontWeight: 400, fontSize: "clamp(16px, 1.4vw, 21px)", lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.78)" }}>
          Three properties, one obsession: how independent agencies actually get built.{" "}
          <span style={{ color: "var(--ink)" }}>Agency X. Miced Up. The Community.</span>
        </div>
      </section>

      {/* THE PROPERTIES */}
      <PropertiesSection onNav={goTo} />

      {/* ON THE LIST */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel count={vendors.length}>On the list.</SectionLabel>

        <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(17px, 1.3vw, 19px)", lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)", maxWidth: 600, marginBottom: "clamp(40px, 5vw, 64px)" }}>
          A working directory of vendors I'm actively introducing.{" "}
          <span onClick={() => goTo("agencies")} className="cursor-pointer underline" style={{ color: "var(--accent)", textDecorationThickness: 1, textUnderlineOffset: 4 }}>
            Agencies, request the full briefing.
          </span>
        </div>

        <div style={{ borderTop: "1px solid rgba(var(--ink-rgb), 0.12)", position: "relative" }}>
          {vendors.map((v, i) => (
            <div key={v.name}
              onMouseEnter={() => setHoveredVendor(i)}
              onMouseLeave={() => setHoveredVendor(null)}
              onClick={() => setSelectedVendor(v)}
              className="grid cursor-pointer"
              style={{ gridTemplateColumns: "40px 1fr auto", gap: "clamp(10px, 3vw, 60px)", padding: "clamp(22px, 2.5vw, 32px) 0", borderBottom: "1px solid rgba(var(--ink-rgb), 0.12)", alignItems: "center", transition: "opacity 0.3s", opacity: hoveredVendor !== null && hoveredVendor !== i ? 0.35 : 1 }}>
              <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 13, color: "var(--muted)", letterSpacing: "0.04em" }}>{String(i + 1).padStart(2, "0")}</div>
              <div className="flex items-center" style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(22px, 3.6vw, 52px)", lineHeight: 1, letterSpacing: "-0.025em", color: "var(--ink)", gap: "clamp(12px, 2vw, 24px)" }}>
                <span style={{ whiteSpace: "nowrap" }}>{v.name}</span>
                {hoveredVendor === i && (v.thumb || v.thumbCss) && (
                  <div style={{ width: 120, height: 74, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(var(--ink-rgb),0.1)", boxShadow: "0 12px 32px rgba(0,0,0,0.7)", flexShrink: 0, background: v.thumbBg || "transparent" }}>
                    {v.thumbCss ? (
                      <div style={{ width: "100%", height: "100%", ...v.thumbCss }} />
                    ) : (
                      <img src={v.thumb} alt={v.name} style={{ width: "100%", height: "100%", objectFit: v.thumbFit || "cover", display: "block", padding: v.thumbFit === "contain" ? 12 : 0, boxSizing: "border-box" }} />
                    )}
                  </div>
                )}
                {hoveredVendor === i && (
                  <span style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(14px, 1.2vw, 18px)", fontWeight: 400, color: "var(--accent)", letterSpacing: "normal", whiteSpace: "nowrap" }}>request an intro.</span>
                )}
              </div>
              <div className="hidden sm:block" style={{ ...fontDisplay, fontWeight: 400, fontSize: 14, color: "rgba(var(--ink-rgb), 0.7)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{v.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BRIEF */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel>Brief.</SectionLabel>
        <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px, 4vw, 80px)" }}>
          <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1.4, color: "rgba(var(--ink-rgb), 0.82)", letterSpacing: "-0.01em", maxWidth: 540 }}>
            One email per month. New names on the list, what I'm watching in the channel, and one thing I'd push back on.
          </div>
          <div>
            {!briefSignup.submitted ? (
              <form onSubmit={submitBriefSignup} className="flex flex-col gap-4">
                <input type="email" required value={briefSignup.email} onChange={(e) => setBriefSignup({ ...briefSignup, email: e.target.value })} placeholder="your email"
                  style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.3)", ...fontDisplay, fontWeight: 400, fontSize: "clamp(22px, 2vw, 30px)", color: "var(--ink)", padding: "14px 0", outline: "none", width: "100%" }} />
                <button type="submit" className="self-start cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
                  Subscribe →
                </button>
              </form>
            ) : (
              <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(24px, 2.4vw, 36px)", lineHeight: 1.2, color: "var(--accent)" }}>
                You're on the list. First brief lands the first Tuesday of next month.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const AgenciesView = () => (
    <section style={{ padding: "clamp(40px, 8vw, 120px) 0" }}>
      <button type="button" onClick={() => goTo("home")} className="cursor-pointer" style={{ background: "transparent", border: "none", ...fontDisplay, fontSize: 13, color: "var(--muted)", marginBottom: 60, padding: 0, letterSpacing: "0.04em" }}>← back</button>
      <SectionLabel>For agencies.</SectionLabel>
      <p style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(22px, 2.2vw, 32px)", lineHeight: 1.3, letterSpacing: "-0.02em", color: "var(--ink)", maxWidth: 880, marginTop: 0, marginBottom: "clamp(48px, 6vw, 72px)" }}>
        You don't need another vendor pitching you. You need to know which of them is <Bracket>worth the meeting</Bracket>, and whether the thing actually works once you sign.
      </p>

      {/* Two-track */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 1, background: "rgba(var(--ink-rgb), 0.12)", border: "1px solid rgba(var(--ink-rgb), 0.12)", marginBottom: "clamp(48px, 6vw, 72px)" }}>
        {[
          { tag: "↳ The introduction", headline: "Free. Always.", body: "Tell me what you're solving. If someone on the list fits, I'll make the introduction by email, by text, or on stage. If no one fits, I'll tell you, and point you somewhere I'd actually look.", note: "Vendors are the customer here, not you. The credibility only works if I'm willing to say no." },
          { tag: "↳ The implementation", headline: <>For fee.<br />When you want it.</>, body: "Buying a tool is the easy part. Actually getting it running inside your agency—workflows, data, training, the politics of producer adoption—is where most vendor deals quietly die. I do that work for agencies that want it done right.", note: "Scope and pricing depend on the engagement. Let's talk." },
        ].map((card, i) => (
          <div key={i} style={{ background: "var(--site-bg)", padding: "clamp(28px, 3.5vw, 44px)" }}>
            <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>{card.tag}</div>
            <div style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(32px, 3.6vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--ink)", marginBottom: 18 }}>{card.headline}</div>
            <div style={{ ...fontDisplay, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.7)", marginBottom: 18 }}>{card.body}</div>
            <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 14, color: "rgba(var(--ink-rgb), 0.5)" }}>{card.note}</div>
          </div>
        ))}
      </div>

      {/* Implementation detail */}
      <div style={{ marginBottom: "clamp(48px, 6vw, 72px)" }}>
        <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 24 }}>// What implementation looks like</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(24px, 3vw, 40px)" }}>
          {[
            { t: "Vendor selection", d: "Help you choose between two or three on the list once you know the problem. The intro is free; the analysis that follows is the work." },
            { t: "Stand-up & integration", d: "Configure the tool inside your stack. Map your workflows, your AMS, your producers. Get it talking to the systems you already run." },
            { t: "Adoption & training", d: "Train the team that will actually use it. Most tools fail because nobody owns rollout inside the agency. I own it until you don't need me to." },
            { t: "30-60-90 audit", d: "Come back ninety days later, measure what changed, and tell you honestly whether to renew or rip it out." },
          ].map((item) => (
            <div key={item.t}>
              <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(17px, 1.4vw, 20px)", letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: 10 }}>{item.t}</div>
              <div style={{ ...fontDisplay, fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.62)" }}>{item.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1.35, letterSpacing: "-0.015em", color: "var(--ink)", maxWidth: 720, marginBottom: 36, paddingTop: "clamp(24px, 3vw, 40px)", borderTop: "1px solid rgba(var(--ink-rgb), 0.12)" }}>
        Tell me what you're solving.
      </div>
      <p style={{ ...fontDisplay, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.6)", maxWidth: 640, marginTop: 0, marginBottom: 40 }}>
        Two business days for a response. Either a name and a warm intro, or a straight answer about why this isn't ready yet.
      </p>
      {!agencyForm.submitted ? (
        <form onSubmit={submitAgencyForm} className="grid gap-8" style={{ maxWidth: 640 }}>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Agency</label>
            <input type="text" required value={agencyForm.agency} onChange={(e) => setAgencyForm({ ...agencyForm, agency: e.target.value })} placeholder="Your agency name and city"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb), 0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>What you're solving</label>
            <textarea required value={agencyForm.problem} onChange={(e) => setAgencyForm({ ...agencyForm, problem: e.target.value })} placeholder="The actual headache. The thing costing producer hours every week."
              style={{ background: "transparent", border: "1px solid rgba(var(--ink-rgb), 0.12)", ...fontDisplay, fontSize: 17, color: "var(--ink)", padding: 16, outline: "none", width: "100%", minHeight: 140, resize: "vertical", lineHeight: 1.5 }} />
          </div>
          <button type="submit" className="self-start cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
            Request a name →
          </button>
        </form>
      ) : (
        <div style={{ maxWidth: 640 }}>
          <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.2, color: "var(--accent)", marginBottom: 16 }}>Received.</div>
          <p style={{ ...fontDisplay, fontSize: 18, lineHeight: 1.55, color: "rgba(var(--ink-rgb), 0.72)" }}>I'll get back to you within two business days. Either with a name and a warm intro, or with a straight answer about why this isn't ready yet.</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "var(--site-bg)", color: "var(--ink)", ...fontDisplay }}>
      {selectedVendor && <VendorIntroDrawer vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />}
      <SiteHeader activeView={activeView} onNav={goTo} />

      {/* MAIN */}
      <main className="mx-auto" style={{ padding: "60px clamp(20px, 5vw, 80px) 0 clamp(20px, 5vw, 80px)", maxWidth: 1680 }}>
        {activeView === "home" && <HomeView />}
        {activeView === "agencies" && <AgenciesView />}
        {activeView === "agencyx" && <AgencyXView onBack={() => goTo("home")} />}
        {activeView === "micedup" && <MicedUpView onBack={() => goTo("home")} />}
        {activeView === "community" && <CommunityView onBack={() => goTo("home")} />}
      </main>

      {/* FOOTER */}
      <footer className="mx-auto" style={{ padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px) clamp(40px, 4vw, 60px) clamp(20px, 5vw, 80px)", maxWidth: 1680, borderTop: "1px solid rgba(var(--ink-rgb), 0.12)", marginTop: "clamp(80px, 12vw, 140px)" }}>
        <div style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(40px, 8vw, 120px)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: "clamp(40px, 6vw, 80px)", maxWidth: 1200 }}>
          Built in the open, <Bracket>on the record</Bracket>.
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "clamp(28px, 3vw, 48px)", marginBottom: 60 }}>
          {[
            { title: "Contact.", lines: [<>Casey B. Nelson</>, <>A media company for the insurance channel</>, <a href="mailto:casey@caseybnelson.com" style={{ color: "var(--accent)", textDecoration: "none" }}>casey@caseybnelson.com</a>] },
            { title: "Listen.", lines: [<a href="#" style={{ color: "inherit", textDecoration: "none" }}>Apple Podcasts ↗</a>, <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Spotify ↗</a>, <a href="#" style={{ color: "inherit", textDecoration: "none" }}>YouTube ↗</a>] },
            { title: "Follow.", lines: [<a href="#" style={{ color: "inherit", textDecoration: "none" }}>LinkedIn ↗</a>, <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Twitter ↗</a>, <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Newsletter ↗</a>] },
            { title: "Index.", lines: [<span onClick={() => goTo("home")} className="cursor-pointer">Home</span>, <span onClick={() => goTo("agencyx")} className="cursor-pointer">Agency X</span>, <span onClick={() => goTo("micedup")} className="cursor-pointer">Miced Up</span>, <span onClick={() => goTo("community")} className="cursor-pointer">The Community</span>] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>{col.title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.9, color: "rgba(var(--ink-rgb), 0.85)" }}>
                {col.lines.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between flex-wrap" style={{ gap: 16, paddingTop: 32, borderTop: "1px solid rgba(var(--ink-rgb), 0.08)", fontSize: 12, color: "var(--muted)", letterSpacing: "0.04em" }}>
          <div>© 2026 Casey B. Nelson</div>
          <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 14 }}>A small market, kept small on purpose.</div>
        </div>
      </footer>
    </div>
  );
}
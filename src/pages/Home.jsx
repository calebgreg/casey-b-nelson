import React, { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";

export default function Home() {
  const [activeView, setActiveView] = useState("home");
  const [vendorForm, setVendorForm] = useState({ company: "", category: "", why: "", submitted: false });
  const [agencyForm, setAgencyForm] = useState({ agency: "", problem: "", submitted: false });
  const [briefSignup, setBriefSignup] = useState({ email: "", submitted: false });
  const [hoveredVendor, setHoveredVendor] = useState(null);
  const [channel, setChannel] = useState("email");
  const [wordmarkColor, setWordmarkColor] = useState("#ffffff");
  const [scrolled, setScrolled] = useState(false);
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });

  // Track scroll for nav glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-driven wordmark color cycle
  useEffect(() => {
    const palette = [
      [255, 255, 255],
      [61, 202, 184],
      [240, 235, 224],
      [200, 150, 255],
      [61, 202, 184],
      [255, 200, 100],
      [255, 255, 255],
    ];
    const lerp = (a, b, t) => a + (b - a) * t;
    const interpolateColor = (t) => {
      const scaled = t * (palette.length - 1);
      const idx = Math.min(Math.floor(scaled), palette.length - 2);
      const frac = scaled - idx;
      const from = palette[idx];
      const to = palette[idx + 1];
      return `rgb(${Math.round(lerp(from[0], to[0], frac))}, ${Math.round(lerp(from[1], to[1], frac))}, ${Math.round(lerp(from[2], to[2], frac))})`;
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const t = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
        setWordmarkColor(interpolateColor(t));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Hero network animation
  useEffect(() => {
    if (activeView !== "home") return;
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
      const a = Math.floor(Math.random() * nodes.length);
      let b = Math.floor(Math.random() * nodes.length);
      while (b === a) b = Math.floor(Math.random() * nodes.length);
      connections.push({ a, b, life: 0, max: 180 + Math.random() * 120 });
    };
    const spawnInterval = setInterval(spawnConnection, 900);

    const cursor = cursorRef.current;
    const draw = () => {
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
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
        ctx.fillStyle = `rgba(240, 235, 224, ${0.18 + proximity * 0.65})`;
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
        ctx.strokeStyle = `rgba(61, 202, 184, ${alpha * 0.55})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61, 202, 184, ${alpha * 0.9})`;
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
  }, [activeView]);

  const goTo = (v) => { setActiveView(v); window.scrollTo({ top: 0 }); };

  const vendors = [
    { name: "Submissions Co.", category: "Submissions", since: "03·26" },
    { name: "AgencyBeam", category: "AMS", since: "01·26" },
    { name: "Hearth Compare", category: "Personal Lines", since: "03·26" },
    { name: "BenefitsBeam", category: "Benefits", since: "02·26" },
    { name: "ClaimsFlow", category: "Claims", since: "03·26" },
    { name: "Verdant Loss", category: "Loss Control", since: "04·26" },
    { name: "Certify Layer", category: "Certificates", since: "12·25" },
    { name: "Threadwork", category: "Marketing", since: "04·26" },
    { name: "Ledger CRM", category: "CRM", since: "01·26" },
    { name: "QuoteForge", category: "Raters", since: "02·26" },
    { name: "Marketwise", category: "Data", since: "02·26" },
    { name: "Northsight", category: "Data", since: "04·26" },
  ];

  const submitVendorForm = (e) => { e.preventDefault(); setVendorForm({ ...vendorForm, submitted: true }); };
  const submitAgencyForm = (e) => { e.preventDefault(); setAgencyForm({ ...agencyForm, submitted: true }); };
  const submitBriefSignup = (e) => { e.preventDefault(); setBriefSignup({ ...briefSignup, submitted: true }); };

  const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
  const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };
  const fontScript = { fontFamily: '"Ms Madi", "Brush Script MT", cursive' };

  const Bracket = ({ children, onClick }) => (
    <span onClick={onClick} className={onClick ? "cursor-pointer" : ""} style={{ ...fontSerif, fontStyle: "italic", color: "#3DCAB8", fontWeight: 400, position: "relative" }}>
      <span style={{ color: "rgba(61, 202, 184, 0.4)", fontWeight: 300, fontStyle: "normal", marginRight: "0.06em" }}>[</span>
      {children}
      <span style={{ color: "rgba(61, 202, 184, 0.4)", fontWeight: 300, fontStyle: "normal", marginLeft: "0.06em" }}>]</span>
    </span>
  );

  const SectionLabel = ({ children, count }) => (
    <div className="flex items-baseline gap-4 md:gap-5" style={{ marginBottom: "clamp(28px, 5vw, 56px)" }}>
      <h2 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(56px, 11vw, 168px)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: 0, color: "#F0EBE0" }}>
        {children}
      </h2>
      {count !== undefined && (
        <span style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(14px, 1.4vw, 18px)", color: "#6B6760", letterSpacing: "0.02em" }}>({count})</span>
      )}
    </div>
  );

  const channelTabs = [
    {
      id: "email", label: "The email", sub: "Written intro",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" /><path d="M3 7l9 6 9-6" /></svg>,
    },
    {
      id: "text", label: "The text", sub: "Direct handoff",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="3" width="12" height="18" rx="2" /><line x1="11" y1="18" x2="13" y2="18" /></svg>,
    },
    {
      id: "stage", label: "The stage", sub: "Public endorsement",
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 8h16v9H4z" /><path d="M2 17h20" /><path d="M9 8V5h6v3" /><circle cx="12" cy="12.5" r="1.2" fill="currentColor" /></svg>,
    },
  ];

  // ---------------- VIEWS ----------------

  const HomeView = (
    <>
      {/* HERO */}
      <section className="relative flex flex-col justify-between" style={{ minHeight: "calc(100vh - 80px)", paddingTop: "clamp(60px, 12vh, 140px)", paddingBottom: "clamp(60px, 8vh, 100px)" }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "auto" }} />

        <div className="relative z-10 pointer-events-none">

          <h1 style={{ ...fontDisplay, fontWeight: 900, fontSize: "clamp(36px, 10vw, 240px)", lineHeight: 0.88, letterSpacing: "-0.045em", margin: 0, color: "#F0EBE0", maxWidth: 1400 }}>
            Introductions in <Bracket>insurance</Bracket>.
          </h1>
        </div>

        <div className="relative z-10 pointer-events-none" style={{ maxWidth: 620, ...fontDisplay, fontWeight: 400, fontSize: "clamp(16px, 1.4vw, 21px)", lineHeight: 1.55, color: "rgba(240, 235, 224, 0.78)" }}>
          A private list of vendors I introduce to agencies that ask.{" "}
          <span style={{ color: "#F0EBE0" }}>Vendors retain me. Agencies pay nothing.</span>
        </div>
      </section>

      {/* THE PRODUCT */}
      <section style={{ padding: "clamp(100px, 14vw, 200px) 0 clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel>The product.</SectionLabel>

        <div style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(24px, 2.8vw, 42px)", lineHeight: 1.25, letterSpacing: "-0.02em", maxWidth: 980, color: "#F0EBE0", marginBottom: "clamp(48px, 6vw, 80px)" }}>
          Cold outreach is collapsing. Reply rates in the channel have fallen every quarter. Retain me, and your next conversation with a principal happens <Bracket>three ways</Bracket>.
        </div>

        {/* CHANNEL TOGGLE */}
        <div className="flex" style={{ justifyContent: "center", gap: 1, background: "rgba(240, 235, 224, 0.12)", border: "1px solid rgba(240, 235, 224, 0.12)", maxWidth: 760, margin: "0 auto clamp(20px, 2.5vw, 32px) auto" }}>
          {channelTabs.map((c) => {
            const isActive = channel === c.id;
            return (
              <button key={c.id} type="button" onClick={() => setChannel(c.id)} className="cursor-pointer flex-1 flex flex-col items-center"
                style={{ background: isActive ? "#13110D" : "#0A0A0A", border: "none", padding: "clamp(16px, 2.2vw, 28px) clamp(10px, 2vw, 24px)", color: isActive ? "#3DCAB8" : "rgba(240, 235, 224, 0.45)", transition: "all 0.25s ease", gap: 10, borderTop: isActive ? "1px solid #3DCAB8" : "1px solid transparent" }}>
                {c.icon}
                <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(12px, 1.2vw, 16px)", letterSpacing: "-0.01em" }}>{c.label}</div>
                <div style={{ ...fontDisplay, fontWeight: 400, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: isActive ? "rgba(61, 202, 184, 0.6)" : "rgba(240, 235, 224, 0.35)" }}>{c.sub}</div>
              </button>
            );
          })}
        </div>

        {/* CHANNEL PANEL */}
        <div key={channel} style={{ maxWidth: 760, margin: "0 auto", background: "#13110D", border: "1px solid rgba(240, 235, 224, 0.12)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", position: "relative", animation: "channelFade 0.35s ease-out" }}>
          <style>{`@keyframes channelFade { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:translateY(0);} }`}</style>
          <div style={{ position: "absolute", top: -1, left: -1, width: 60, height: 1, background: "#3DCAB8" }} />
          <div style={{ position: "absolute", top: -1, left: -1, width: 1, height: 60, background: "#3DCAB8" }} />

          {channel === "email" && (
            <>
              <div style={{ padding: "clamp(20px, 2.5vw, 28px) clamp(20px, 3vw, 36px)", borderBottom: "1px solid rgba(240, 235, 224, 0.08)", display: "grid", gap: 10 }}>
                {[
                  { label: "From", value: "Casey B. Nelson <casey@caseybnelson.com>" },
                  { label: "To", value: "Alice Park, Principal at Premier Risk Brokers" },
                  { label: "Cc", value: "[Founder], CEO at [Your Company]" },
                  { label: "Subject", value: "an introduction", emphasize: true },
                ].map((row) => (
                  <div key={row.label} className="flex" style={{ gap: 16, fontSize: "clamp(12px, 1vw, 13px)", alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ ...fontDisplay, fontWeight: 500, color: "#6B6760", width: 56, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10, flexShrink: 0 }}>{row.label}</span>
                    <span style={{ ...fontDisplay, fontWeight: row.emphasize ? 600 : 400, color: row.emphasize ? "#F0EBE0" : "rgba(240, 235, 224, 0.78)", fontSize: row.emphasize ? "clamp(14px, 1.2vw, 16px)" : "clamp(13px, 1.1vw, 14px)" }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "clamp(24px, 3.5vw, 44px) clamp(20px, 3vw, 36px)", ...fontDisplay, fontWeight: 400, fontSize: "clamp(15px, 1.3vw, 17px)", lineHeight: 1.7, color: "rgba(240, 235, 224, 0.88)" }}>
                <p style={{ margin: "0 0 18px 0" }}>Alice,</p>
                <p style={{ margin: "0 0 18px 0" }}><span style={{ color: "#F0EBE0", fontWeight: 500 }}>[Your Company]</span> handles submissions for agencies in your size band. I've spent time with their team and would put them in the small handful of people I'd actually trust here.</p>
                <p style={{ margin: "0 0 28px 0" }}>Worth fifteen minutes if you've been thinking about ingestion speed. Cc'd is [Founder]. They'll take it from there.</p>
                <div style={{ ...fontScript, fontSize: "clamp(30px, 3.5vw, 44px)", color: "#3DCAB8", lineHeight: 1, marginTop: 12 }}>Casey</div>
              </div>
              <div style={{ padding: "14px clamp(20px, 3vw, 36px)", borderTop: "1px solid rgba(240, 235, 224, 0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", ...fontDisplay, fontSize: 11, letterSpacing: "0.04em", color: "#6B6760", flexWrap: "wrap", gap: 8 }}>
                <span>1 of 1 in thread</span>
                <span style={{ ...fontSerif, fontStyle: "italic", fontSize: 12, color: "#3DCAB8" }}>sent personally, never automated</span>
              </div>
            </>
          )}

          {channel === "text" && (
            <div style={{ padding: "clamp(24px, 3.5vw, 44px) clamp(16px, 3vw, 36px)" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 4, paddingBottom: 24, marginBottom: 28, borderBottom: "1px solid rgba(240, 235, 224, 0.06)" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(61, 202, 184, 0.12)", border: "1px solid rgba(61, 202, 184, 0.3)", display: "flex", justifyContent: "center", alignItems: "center", ...fontScript, fontSize: 22, color: "#3DCAB8", lineHeight: 1, paddingBottom: 4 }}>C</div>
                <div style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "#F0EBE0", marginTop: 6 }}>Casey B. Nelson</div>
                <div style={{ ...fontDisplay, fontSize: 11, color: "#6B6760", letterSpacing: "0.04em" }}>iMessage · Tue 9:42 AM</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 520, margin: "0 auto" }}>
                {[
                  { text: "Alice. Quick one. Two people you should know each other.", align: "start", bg: "rgba(240, 235, 224, 0.08)", color: "#F0EBE0", radius: "18px 18px 18px 4px", maxW: "78%" },
                  { text: <><span style={{ fontWeight: 600 }}>[Founder]</span> at <span style={{ fontWeight: 600 }}>[Your Company]</span>. Built the submissions tool you mentioned needing last month. They're at your scale, not enterprise. Worth a look.</>, align: "start", bg: "rgba(240, 235, 224, 0.08)", color: "#F0EBE0", radius: "18px 18px 18px 4px", maxW: "82%" },
                  { text: "Cool with me passing your number?", align: "start", bg: "rgba(240, 235, 224, 0.08)", color: "#F0EBE0", radius: "18px 18px 18px 4px", maxW: "60%" },
                ].map((bubble, i) => (
                  <div key={i} style={{ alignSelf: `flex-${bubble.align}`, maxWidth: bubble.maxW, background: bubble.bg, color: bubble.color, borderRadius: bubble.radius, padding: "12px 16px", ...fontDisplay, fontSize: "clamp(14px, 1.2vw, 16px)", lineHeight: 1.45 }}>{bubble.text}</div>
                ))}
                <div style={{ alignSelf: "flex-end", ...fontDisplay, fontSize: 10, color: "#6B6760", letterSpacing: "0.04em", marginTop: 4 }}>Read 9:43 AM</div>
                <div style={{ alignSelf: "flex-end", maxWidth: "50%", background: "#3DCAB8", color: "#0A0A0A", borderRadius: "18px 18px 4px 18px", padding: "12px 16px", ...fontDisplay, fontSize: "clamp(14px, 1.2vw, 16px)", fontWeight: 500, lineHeight: 1.45, marginTop: 8 }}>Send it.</div>
              </div>
              <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid rgba(240, 235, 224, 0.06)", display: "flex", justifyContent: "center", ...fontSerif, fontStyle: "italic", fontSize: 12, color: "#3DCAB8" }}>when the principal already takes my texts</div>
            </div>
          )}

          {channel === "stage" && (
            <div>
              <div style={{ padding: "clamp(20px, 2.5vw, 28px) clamp(20px, 3vw, 36px)", borderBottom: "1px solid rgba(240, 235, 224, 0.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3DCAB8", marginBottom: 8 }}>↗ Speaking · Keynote</div>
                  <div style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(20px, 1.8vw, 26px)", letterSpacing: "-0.02em", color: "#F0EBE0", lineHeight: 1.15 }}>Insurtech Hartford 2026</div>
                  <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 14, color: "rgba(240, 235, 224, 0.6)", marginTop: 4 }}>"The vendors actually worth your time."</div>
                </div>
                <div style={{ ...fontDisplay, fontSize: 11, color: "#6B6760", letterSpacing: "0.04em", textAlign: "right", whiteSpace: "nowrap" }}>June 18, 2026<br />4:00 PM main stage</div>
              </div>
              <div style={{ padding: "clamp(24px, 3.5vw, 44px) clamp(20px, 3vw, 36px)" }}>
                <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6760", marginBottom: 18 }}>// From the talk</div>
                <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(17px, 1.6vw, 24px)", lineHeight: 1.45, letterSpacing: "-0.01em", color: "rgba(240, 235, 224, 0.92)", paddingLeft: 18, borderLeft: "2px solid #3DCAB8" }}>
                  "I'll give you the five vendors I'd hand my own book to. <span style={{ color: "#F0EBE0", fontWeight: 600 }}>[Your Company]</span> is one of them, and here's why I won't shut up about them this year."
                </div>
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(240, 235, 224, 0.06)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 24 }}>
                  {[{ label: "Room", val: "~600 principals" }, { label: "Featured vendors", val: "5 from the list" }, { label: "Format", val: "Named on stage" }].map((s) => (
                    <div key={s.label}>
                      <div style={{ ...fontDisplay, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6760", marginBottom: 6 }}>{s.label}</div>
                      <div style={{ ...fontDisplay, fontWeight: 600, fontSize: 15, color: "#F0EBE0" }}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "14px clamp(20px, 3vw, 36px)", borderTop: "1px solid rgba(240, 235, 224, 0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", ...fontDisplay, fontSize: 11, letterSpacing: "0.04em", color: "#6B6760", flexWrap: "wrap", gap: 8 }}>
                <span>4 conferences booked · 2026</span>
                <span style={{ ...fontSerif, fontStyle: "italic", fontSize: 12, color: "#3DCAB8" }}>public endorsement, on the record</span>
              </div>
            </div>
          )}
        </div>

        {/* PROOF STATS */}
        <div className="grid" style={{ marginTop: "clamp(60px, 8vw, 100px)", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 1, background: "rgba(240, 235, 224, 0.12)", border: "1px solid rgba(240, 235, 224, 0.12)" }}>
          {[
            { num: "60%+", label: "Reply rate", sub: "vs 1–3% on cold outreach" },
            { num: "400+", label: "Agency network", sub: "Personal + commercial lines, US" },
            { num: "2–4", label: "Intros per month", sub: "Per vendor on the list" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "#0A0A0A", padding: "clamp(28px, 3.5vw, 44px) clamp(20px, 3vw, 36px)" }}>
              <div style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(48px, 6vw, 80px)", lineHeight: 0.95, letterSpacing: "-0.04em", color: "#F0EBE0", marginBottom: 14 }}>{stat.num}</div>
              <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(15px, 1.2vw, 17px)", color: "#F0EBE0", marginBottom: 6, letterSpacing: "-0.01em" }}>{stat.label}</div>
              <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(13px, 1vw, 15px)", lineHeight: 1.4, color: "rgba(240, 235, 224, 0.5)" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* TERMS + CTA */}
        <div className="flex flex-wrap items-baseline" style={{ marginTop: "clamp(48px, 6vw, 72px)", gap: "clamp(24px, 3vw, 48px)", justifyContent: "space-between" }}>
          <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(16px, 1.3vw, 19px)", lineHeight: 1.5, color: "rgba(240, 235, 224, 0.7)", maxWidth: 620 }}>
            Flat monthly retainer. No commissions, no per-deal fees, no equity. The fee is the same whether I introduce you once or twenty times. Keeps the incentive on <Bracket>signal, not volume</Bracket>.
          </div>
          <button type="button" onClick={() => goTo("vendors")} className="cursor-pointer inline-flex items-center" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "#0A0A0A", background: "#3DCAB8", border: "none", padding: "14px 26px", letterSpacing: "0.02em", gap: 10, whiteSpace: "nowrap" }}>
            Apply to be on the list →
          </button>
        </div>
      </section>

      {/* ON THE LIST */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel count={vendors.length}>On the list.</SectionLabel>

        <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(17px, 1.3vw, 19px)", lineHeight: 1.55, color: "rgba(240, 235, 224, 0.62)", maxWidth: 600, marginBottom: "clamp(40px, 5vw, 64px)" }}>
          A working directory of vendors I'm actively introducing.{" "}
          <span onClick={() => goTo("agencies")} className="cursor-pointer underline" style={{ color: "#3DCAB8", textDecorationThickness: 1, textUnderlineOffset: 4 }}>
            Agencies, request the full briefing.
          </span>
        </div>

        <div style={{ borderTop: "1px solid rgba(240, 235, 224, 0.12)" }}>
          {vendors.map((v, i) => (
            <div key={v.name} onMouseEnter={() => setHoveredVendor(i)} onMouseLeave={() => setHoveredVendor(null)}
              className="grid cursor-pointer"
              style={{ gridTemplateColumns: "40px 1fr auto", gap: "clamp(10px, 3vw, 60px)", padding: "clamp(22px, 2.5vw, 32px) 0", borderBottom: "1px solid rgba(240, 235, 224, 0.12)", alignItems: "baseline", transition: "opacity 0.3s", opacity: hoveredVendor !== null && hoveredVendor !== i ? 0.35 : 1 }}>
              <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 13, color: "#6B6760", letterSpacing: "0.04em" }}>{String(i + 1).padStart(2, "0")}</div>
              <div className="flex items-baseline flex-wrap" style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(22px, 3.6vw, 52px)", lineHeight: 1, letterSpacing: "-0.025em", color: "#F0EBE0", gap: 16 }}>
                <span>{v.name}</span>
                {hoveredVendor === i && (
                  <span style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(16px, 1.4vw, 22px)", fontWeight: 400, color: "#3DCAB8", letterSpacing: "normal" }}>request an intro.</span>
                )}
              </div>
              <div className="hidden sm:block" style={{ ...fontDisplay, fontWeight: 400, fontSize: 14, color: "rgba(240, 235, 224, 0.7)", letterSpacing: "0.02em" }}>{v.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CASE POD */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel>The podcast.</SectionLabel>

        <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px, 4vw, 60px)" }}>
          <div>
            <div style={{ ...fontSerif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.1, color: "#3DCAB8", marginBottom: 24, maxWidth: 540 }}>
              Case Pod <Mic size={28} style={{ display: "inline", verticalAlign: "middle", marginLeft: "0.2em" }} />
            </div>
            <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(18px, 1.4vw, 22px)", lineHeight: 1.5, color: "rgba(240, 235, 224, 0.78)", maxWidth: 460, marginBottom: 32 }}>
              Conversations with the people I would actually introduce you to. Vendors building for agencies, principals who buy from them, and the market between.
            </div>
            <div className="flex gap-3.5 flex-wrap">
              {["Apple Podcasts", "Spotify", "YouTube", "RSS"].map((p) => (
                <a key={p} href="#"
                  style={{ ...fontDisplay, fontWeight: 500, fontSize: 13, letterSpacing: "0.02em", color: "rgba(240, 235, 224, 0.6)", textDecoration: "none", paddingBottom: 4, borderBottom: "1px solid rgba(240, 235, 224, 0.2)", transition: "color 0.2s, border-color 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#3DCAB8"; e.currentTarget.style.borderBottomColor = "#3DCAB8"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240, 235, 224, 0.6)"; e.currentTarget.style.borderBottomColor = "rgba(240, 235, 224, 0.2)"; }}>
                  {p} ↗
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2.5" style={{ ...fontDisplay, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3DCAB8", marginBottom: 14 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3DCAB8" }} />
              Latest · Ep 04
            </div>
            <h3 style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(26px, 2.4vw, 38px)", lineHeight: 1.15, letterSpacing: "-0.025em", color: "#F0EBE0", marginTop: 0, marginBottom: 14 }}>
              Why we walked away from the enterprise tier.
            </h3>
            <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 17, color: "rgba(240, 235, 224, 0.6)", marginBottom: 20 }}>with [guest name], [agency name]</div>
            <p style={{ ...fontDisplay, fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: "rgba(240, 235, 224, 0.62)", margin: "0 0 24px 0" }}>
              Most vendors chase the biggest logo on the deck. This agency principal explains why that's exactly backwards if you're selling to brokers, and what he tells founders who ask him to pilot.
            </p>
            <button type="button" className="inline-flex items-center gap-2.5 cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "#0A0A0A", background: "#3DCAB8", border: "none", padding: "13px 22px", letterSpacing: "0.02em" }}>
              ▸ Play episode · 47:23
            </button>
          </div>
        </div>
      </section>

      {/* CTA STRIPE */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 1, background: "rgba(240, 235, 224, 0.12)", border: "1px solid rgba(240, 235, 224, 0.12)" }}>
          {[
            { id: "vendors", tag: "↳ For vendors", headline: <>Apply to be <Bracket>on the list</Bracket>.</>, body: "Small intake per quarter. Tell me who it's for and why this is the right room." },
            { id: "agencies", tag: "↳ For agencies", headline: <>Tell me what <Bracket>you're solving</Bracket>.</>, body: "No fee for the intro. For-fee for the implementation if you want help getting it running." },
          ].map((card) => (
            <div key={card.id} onClick={() => goTo(card.id)} className="cursor-pointer" style={{ background: "#0A0A0A", padding: "clamp(40px, 5vw, 64px)", transition: "background 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#13110D")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0A0A0A")}>
              <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6760", marginBottom: 24 }}>{card.tag}</div>
              <div style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#F0EBE0", marginBottom: 18 }}>{card.headline}</div>
              <div style={{ ...fontDisplay, fontSize: 16, lineHeight: 1.5, color: "rgba(240, 235, 224, 0.6)" }}>{card.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BRIEF */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel>Brief.</SectionLabel>
        <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px, 4vw, 80px)" }}>
          <div style={{ ...fontDisplay, fontWeight: 400, fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1.4, color: "rgba(240, 235, 224, 0.82)", letterSpacing: "-0.01em", maxWidth: 540 }}>
            One email per month. New names on the list, what I'm watching in the channel, and one thing I'd push back on.
          </div>
          <div>
            {!briefSignup.submitted ? (
              <form onSubmit={submitBriefSignup} className="flex flex-col gap-4">
                <input type="email" required value={briefSignup.email} onChange={(e) => setBriefSignup({ ...briefSignup, email: e.target.value })} placeholder="your email"
                  style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(240, 235, 224, 0.3)", ...fontDisplay, fontWeight: 400, fontSize: "clamp(22px, 2vw, 30px)", color: "#F0EBE0", padding: "14px 0", outline: "none", width: "100%" }} />
                <button type="submit" className="self-start cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "#0A0A0A", background: "#3DCAB8", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
                  Subscribe →
                </button>
              </form>
            ) : (
              <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(24px, 2.4vw, 36px)", lineHeight: 1.2, color: "#3DCAB8" }}>
                You're on the list. First brief lands the first Tuesday of next month.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const VendorsView = (
    <section style={{ padding: "clamp(40px, 8vw, 120px) 0" }}>
      <button type="button" onClick={() => goTo("home")} className="cursor-pointer" style={{ background: "transparent", border: "none", ...fontDisplay, fontSize: 13, color: "#6B6760", marginBottom: 60, padding: 0, letterSpacing: "0.04em" }}>← back</button>
      <SectionLabel>For vendors.</SectionLabel>
      <p style={{ ...fontDisplay, fontSize: "clamp(18px, 1.5vw, 22px)", lineHeight: 1.5, color: "rgba(240, 235, 224, 0.7)", maxWidth: 640, marginTop: 0, marginBottom: 56 }}>
        Small intake per quarter. Tell me what you do, who it's for, and why this is the right room.
      </p>
      {!vendorForm.submitted ? (
        <form onSubmit={submitVendorForm} className="grid gap-8" style={{ maxWidth: 640 }}>
          {[
            { k: "company", label: "Company", placeholder: "Acme Submissions, Inc." },
            { k: "category", label: "Category", placeholder: "AMS, raters, benefits, claims, personal lines..." },
          ].map((f) => (
            <div key={f.k}>
              <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6760", marginBottom: 8 }}>{f.label}</label>
              <input type="text" required value={vendorForm[f.k]} onChange={(e) => setVendorForm({ ...vendorForm, [f.k]: e.target.value })} placeholder={f.placeholder}
                style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(240, 235, 224, 0.2)", ...fontDisplay, fontSize: 18, color: "#F0EBE0", padding: "10px 0", outline: "none", width: "100%" }} />
            </div>
          ))}
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6760", marginBottom: 8 }}>Why this room, why now</label>
            <textarea required value={vendorForm.why} onChange={(e) => setVendorForm({ ...vendorForm, why: e.target.value })} placeholder="The one thing about your product I'd tell an agency principal in a sentence."
              style={{ background: "transparent", border: "1px solid rgba(240, 235, 224, 0.12)", ...fontDisplay, fontSize: 17, color: "#F0EBE0", padding: 16, outline: "none", width: "100%", minHeight: 140, resize: "vertical", lineHeight: 1.5 }} />
          </div>
          <button type="submit" className="self-start cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "#0A0A0A", background: "#3DCAB8", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
            Submit application →
          </button>
        </form>
      ) : (
        <div style={{ maxWidth: 640 }}>
          <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.2, color: "#3DCAB8", marginBottom: 16 }}>Received.</div>
          <p style={{ ...fontDisplay, fontSize: 18, lineHeight: 1.55, color: "rgba(240, 235, 224, 0.72)" }}>I'll read it this week. If it's a fit, you'll hear from me directly. If not, I'll tell you why and what I'd need to see.</p>
        </div>
      )}
    </section>
  );

  const AgenciesView = (
    <section style={{ padding: "clamp(40px, 8vw, 120px) 0" }}>
      <button type="button" onClick={() => goTo("home")} className="cursor-pointer" style={{ background: "transparent", border: "none", ...fontDisplay, fontSize: 13, color: "#6B6760", marginBottom: 60, padding: 0, letterSpacing: "0.04em" }}>← back</button>
      <SectionLabel>For agencies.</SectionLabel>
      <p style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(22px, 2.2vw, 32px)", lineHeight: 1.3, letterSpacing: "-0.02em", color: "#F0EBE0", maxWidth: 880, marginTop: 0, marginBottom: "clamp(48px, 6vw, 72px)" }}>
        You don't need another vendor pitching you. You need to know which of them is <Bracket>worth the meeting</Bracket>, and whether the thing actually works once you sign.
      </p>

      {/* Two-track */}
      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 1, background: "rgba(240, 235, 224, 0.12)", border: "1px solid rgba(240, 235, 224, 0.12)", marginBottom: "clamp(48px, 6vw, 72px)" }}>
        {[
          { tag: "↳ The introduction", headline: "Free. Always.", body: "Tell me what you're solving. If someone on the list fits, I'll make the introduction by email, by text, or on stage. If no one fits, I'll tell you, and point you somewhere I'd actually look.", note: "Vendors are the customer here, not you. The credibility only works if I'm willing to say no." },
          { tag: "↳ The implementation", headline: <>For fee.<br />When you want it.</>, body: "Buying a tool is the easy part. Actually getting it running inside your agency—workflows, data, training, the politics of producer adoption—is where most vendor deals quietly die. I do that work for agencies that want it done right.", note: "Scope and pricing depend on the engagement. Let's talk." },
        ].map((card, i) => (
          <div key={i} style={{ background: "#0A0A0A", padding: "clamp(28px, 3.5vw, 44px)" }}>
            <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3DCAB8", marginBottom: 16 }}>{card.tag}</div>
            <div style={{ ...fontDisplay, fontWeight: 700, fontSize: "clamp(32px, 3.6vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#F0EBE0", marginBottom: 18 }}>{card.headline}</div>
            <div style={{ ...fontDisplay, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.55, color: "rgba(240, 235, 224, 0.7)", marginBottom: 18 }}>{card.body}</div>
            <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 14, color: "rgba(240, 235, 224, 0.5)" }}>{card.note}</div>
          </div>
        ))}
      </div>

      {/* Implementation detail */}
      <div style={{ marginBottom: "clamp(48px, 6vw, 72px)" }}>
        <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6760", marginBottom: 24 }}>// What implementation looks like</div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "clamp(24px, 3vw, 40px)" }}>
          {[
            { t: "Vendor selection", d: "Help you choose between two or three on the list once you know the problem. The intro is free; the analysis that follows is the work." },
            { t: "Stand-up & integration", d: "Configure the tool inside your stack. Map your workflows, your AMS, your producers. Get it talking to the systems you already run." },
            { t: "Adoption & training", d: "Train the team that will actually use it. Most tools fail because nobody owns rollout inside the agency. I own it until you don't need me to." },
            { t: "30-60-90 audit", d: "Come back ninety days later, measure what changed, and tell you honestly whether to renew or rip it out." },
          ].map((item) => (
            <div key={item.t}>
              <div style={{ ...fontDisplay, fontWeight: 600, fontSize: "clamp(17px, 1.4vw, 20px)", letterSpacing: "-0.015em", color: "#F0EBE0", marginBottom: 10 }}>{item.t}</div>
              <div style={{ ...fontDisplay, fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: "rgba(240, 235, 224, 0.62)" }}>{item.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ ...fontDisplay, fontWeight: 500, fontSize: "clamp(20px, 1.8vw, 26px)", lineHeight: 1.35, letterSpacing: "-0.015em", color: "#F0EBE0", maxWidth: 720, marginBottom: 36, paddingTop: "clamp(24px, 3vw, 40px)", borderTop: "1px solid rgba(240, 235, 224, 0.12)" }}>
        Tell me what you're solving.
      </div>
      <p style={{ ...fontDisplay, fontSize: "clamp(15px, 1.2vw, 17px)", lineHeight: 1.55, color: "rgba(240, 235, 224, 0.6)", maxWidth: 640, marginTop: 0, marginBottom: 40 }}>
        Two business days for a response. Either a name and a warm intro, or a straight answer about why this isn't ready yet.
      </p>
      {!agencyForm.submitted ? (
        <form onSubmit={submitAgencyForm} className="grid gap-8" style={{ maxWidth: 640 }}>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6760", marginBottom: 8 }}>Agency</label>
            <input type="text" required value={agencyForm.agency} onChange={(e) => setAgencyForm({ ...agencyForm, agency: e.target.value })} placeholder="Your agency name and city"
              style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(240, 235, 224, 0.2)", ...fontDisplay, fontSize: 18, color: "#F0EBE0", padding: "10px 0", outline: "none", width: "100%" }} />
          </div>
          <div>
            <label className="block" style={{ ...fontDisplay, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B6760", marginBottom: 8 }}>What you're solving</label>
            <textarea required value={agencyForm.problem} onChange={(e) => setAgencyForm({ ...agencyForm, problem: e.target.value })} placeholder="The actual headache. The thing costing producer hours every week."
              style={{ background: "transparent", border: "1px solid rgba(240, 235, 224, 0.12)", ...fontDisplay, fontSize: 17, color: "#F0EBE0", padding: 16, outline: "none", width: "100%", minHeight: 140, resize: "vertical", lineHeight: 1.5 }} />
          </div>
          <button type="submit" className="self-start cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "#0A0A0A", background: "#3DCAB8", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
            Request a name →
          </button>
        </form>
      ) : (
        <div style={{ maxWidth: 640 }}>
          <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.2, color: "#3DCAB8", marginBottom: 16 }}>Received.</div>
          <p style={{ ...fontDisplay, fontSize: 18, lineHeight: 1.55, color: "rgba(240, 235, 224, 0.72)" }}>I'll get back to you within two business days. Either with a name and a warm intro, or with a straight answer about why this isn't ready yet.</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#0A0A0A", color: "#F0EBE0", ...fontDisplay }}>
      {/* HEADER — your version with glass scroll + color-cycling wordmark */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between"
        style={{ zIndex: 50, padding: "0 clamp(16px, 4vw, 32px)", height: 60, transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease", background: scrolled ? "rgba(10, 10, 10, 0.55)" : "transparent", backdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none", WebkitBackdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none", borderBottom: scrolled ? "1px solid rgba(240, 235, 224, 0.07)" : "1px solid transparent" }}>
        <div className="cursor-pointer inline-flex items-start" style={{ ...fontScript, fontWeight: 400, fontSize: "clamp(26px, 5vw, 38px)", lineHeight: 1, letterSpacing: "0.005em", color: wordmarkColor, gap: 4, transition: "color 0.1s linear" }} onClick={() => goTo("home")}>
          <span>Casey B. Nelson</span>
          <sup style={{ ...fontSerif, fontStyle: "italic", fontWeight: 400, fontSize: 11, marginTop: 8, color: "#3DCAB8", letterSpacing: 0 }}>©</sup>
        </div>
        <nav className="flex" style={{ gap: "clamp(16px, 3vw, 28px)" }}>
          {[{ id: "home", label: "Index" }, { id: "vendors", label: "Vendors" }, { id: "agencies", label: "Agencies" }].map((item) => (
            <button key={item.id} type="button" onClick={() => goTo(item.id)} className="cursor-pointer"
              style={{ background: "transparent", border: "none", padding: 0, ...fontDisplay, fontWeight: 500, fontSize: "clamp(12px, 2.5vw, 14px)", letterSpacing: "0.01em", color: activeView === item.id ? "#3DCAB8" : "rgba(240, 235, 224, 0.85)", transition: "color 0.2s", whiteSpace: "nowrap" }}>
              {item.label}
              {activeView === item.id && <span className="inline-block" style={{ width: 5, height: 5, borderRadius: "50%", background: "#3DCAB8", marginLeft: 6, transform: "translateY(-2px)" }} />}
            </button>
          ))}
        </nav>
      </header>

      {/* MAIN */}
      <main className="mx-auto" style={{ padding: "60px clamp(20px, 5vw, 80px) 0 clamp(20px, 5vw, 80px)", maxWidth: 1680 }}>
        {activeView === "home" && HomeView}
        {activeView === "vendors" && VendorsView}
        {activeView === "agencies" && AgenciesView}
      </main>

      {/* FOOTER */}
      <footer className="mx-auto" style={{ padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 80px) clamp(40px, 4vw, 60px) clamp(20px, 5vw, 80px)", maxWidth: 1680, borderTop: "1px solid rgba(240, 235, 224, 0.12)", marginTop: "clamp(80px, 12vw, 140px)" }}>
        <div style={{ ...fontDisplay, fontWeight: 800, fontSize: "clamp(40px, 8vw, 120px)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: "clamp(40px, 6vw, 80px)", maxWidth: 1200 }}>
          The introduction is the <Bracket>product</Bracket>.
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "clamp(28px, 3vw, 48px)", marginBottom: 60 }}>
          {[
            { title: "Contact.", lines: [<>Casey B. Nelson</>, <>Private list, by introduction</>, <a href="mailto:casey@caseybnelson.com" style={{ color: "#3DCAB8", textDecoration: "none" }}>casey@caseybnelson.com</a>] },
            { title: "Listen.", lines: [<a href="#" style={{ color: "inherit", textDecoration: "none" }}>Apple Podcasts ↗</a>, <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Spotify ↗</a>, <a href="#" style={{ color: "inherit", textDecoration: "none" }}>YouTube ↗</a>] },
            { title: "Follow.", lines: [<a href="#" style={{ color: "inherit", textDecoration: "none" }}>LinkedIn ↗</a>, <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Twitter ↗</a>, <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Newsletter ↗</a>] },
            { title: "Index.", lines: [<span onClick={() => goTo("home")} className="cursor-pointer">Home</span>, <span onClick={() => goTo("vendors")} className="cursor-pointer">For vendors</span>, <span onClick={() => goTo("agencies")} className="cursor-pointer">For agencies</span>] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "#6B6760", marginBottom: 14 }}>{col.title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.9, color: "rgba(240, 235, 224, 0.85)" }}>
                {col.lines.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between flex-wrap" style={{ gap: 16, paddingTop: 32, borderTop: "1px solid rgba(240, 235, 224, 0.08)", fontSize: 12, color: "#6B6760", letterSpacing: "0.04em" }}>
          <div>© 2026 Casey B. Nelson</div>
          <div style={{ ...fontSerif, fontStyle: "italic", fontSize: 14 }}>A small market, kept small on purpose.</div>
        </div>
      </footer>
    </div>
  );
}
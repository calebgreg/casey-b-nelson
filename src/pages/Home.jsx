import React, { useState, useEffect, useRef } from "react";

export default function Home() {
  const [activeView, setActiveView] = useState("home");
  const [vendorForm, setVendorForm] = useState({ company: "", category: "", why: "", submitted: false });
  const [agencyForm, setAgencyForm] = useState({ agency: "", problem: "", submitted: false });
  const [briefSignup, setBriefSignup] = useState({ email: "", submitted: false });
  const [hoveredVendor, setHoveredVendor] = useState(null);
  const [wordmarkColor, setWordmarkColor] = useState("#ffffff");
  const canvasRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0 });

  // Scroll-driven wordmark color cycle
  useEffect(() => {
    // A palette of colors to cycle through as the user scrolls
    const palette = [
      [255, 255, 255],       // white (top)
      [61, 202, 184],        // teal
      [240, 235, 224],       // cream
      [200, 150, 255],       // lavender
      [61, 202, 184],        // teal again
      [255, 200, 100],       // warm gold
      [255, 255, 255],       // back to white
    ];

    const lerp = (a, b, t) => a + (b - a) * t;

    const interpolateColor = (t) => {
      // t is 0..1 across full page scroll
      const scaled = t * (palette.length - 1);
      const idx = Math.min(Math.floor(scaled), palette.length - 2);
      const frac = scaled - idx;
      const from = palette[idx];
      const to = palette[idx + 1];
      const r = Math.round(lerp(from[0], to[0], frac));
      const g = Math.round(lerp(from[1], to[1], frac));
      const b = Math.round(lerp(from[2], to[2], frac));
      return `rgb(${r}, ${g}, ${b})`;
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const t = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
        setWordmarkColor(interpolateColor(t));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load fonts once on mount
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
    const handleLeave = () => {
      cursor.x = -9999;
      cursor.y = -9999;
    };
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

  const goTo = (v) => {
    setActiveView(v);
    window.scrollTo({ top: 0 });
  };

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

  const submitVendorForm = (e) => {
    e.preventDefault();
    setVendorForm({ ...vendorForm, submitted: true });
  };
  const submitAgencyForm = (e) => {
    e.preventDefault();
    setAgencyForm({ ...agencyForm, submitted: true });
  };
  const submitBriefSignup = (e) => {
    e.preventDefault();
    setBriefSignup({ ...briefSignup, submitted: true });
  };

  // Font style helpers
  const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
  const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };
  const fontScript = { fontFamily: '"Ms Madi", "Brush Script MT", cursive' };

  // Bracketed accent
  const Bracket = ({ children, onClick }) => (
    <span
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
      style={{
        ...fontSerif,
        fontStyle: "italic",
        color: "#3DCAB8",
        fontWeight: 400,
        position: "relative",
      }}
    >
      <span style={{ color: "rgba(61, 202, 184, 0.4)", fontWeight: 300, fontStyle: "normal", marginRight: "0.06em" }}>[</span>
      {children}
      <span style={{ color: "rgba(61, 202, 184, 0.4)", fontWeight: 300, fontStyle: "normal", marginLeft: "0.06em" }}>]</span>
    </span>
  );

  // Section H2 label
  const SectionLabel = ({ children, count }) => (
    <div className="flex items-baseline gap-4 md:gap-5" style={{ marginBottom: "clamp(28px, 5vw, 56px)" }}>
      <h2
        style={{
          ...fontDisplay,
          fontWeight: 900,
          fontSize: "clamp(56px, 11vw, 168px)",
          lineHeight: 0.92,
          letterSpacing: "-0.04em",
          margin: 0,
          color: "#F0EBE0",
        }}
      >
        {children}
      </h2>
      {count !== undefined && (
        <span
          style={{
            ...fontDisplay,
            fontWeight: 500,
            fontSize: "clamp(14px, 1.4vw, 18px)",
            color: "#6B6760",
            letterSpacing: "0.02em",
          }}
        >
          ({count})
        </span>
      )}
    </div>
  );

  // ---------------- VIEWS ----------------

  const HomeView = (
    <>
      {/* HERO */}
      <section
        className="relative flex flex-col justify-between"
        style={{
          minHeight: "calc(100vh - 80px)",
          paddingTop: "clamp(60px, 12vh, 140px)",
          paddingBottom: "clamp(60px, 8vh, 100px)",
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "auto" }} />

        <div className="relative z-10 pointer-events-none">
          <div
            style={{
              ...fontDisplay,
              fontWeight: 500,
              fontSize: 13,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6B6760",
              marginBottom: 40,
            }}
          >
            <span className="inline-flex items-center gap-2.5">
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#3DCAB8",
                  boxShadow: "0 0 12px rgba(61, 202, 184, 0.6)",
                }}
              />
              Open desk · Spring 2026
            </span>
          </div>

          <h1
            style={{
              ...fontDisplay,
              fontWeight: 900,
              fontSize: "clamp(72px, 14vw, 240px)",
              lineHeight: 0.88,
              letterSpacing: "-0.045em",
              margin: 0,
              color: "#F0EBE0",
              maxWidth: 1400,
            }}
          >
            Introductions in <Bracket>insurance</Bracket>.
          </h1>
        </div>

        <div
          className="relative z-10 pointer-events-none"
          style={{
            maxWidth: 620,
            ...fontDisplay,
            fontWeight: 400,
            fontSize: "clamp(17px, 1.4vw, 21px)",
            lineHeight: 1.5,
            color: "rgba(240, 235, 224, 0.78)",
          }}
        >
          A private list of vendors I vouch for, opened to agencies that ask.{" "}
          <span style={{ color: "#F0EBE0" }}>Vendors retain me. Agencies pay nothing.</span>
        </div>
      </section>

      {/* WHAT I DO */}
      <section style={{ padding: "clamp(100px, 14vw, 200px) 0 clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel>What I do.</SectionLabel>

        <div
          style={{
            ...fontDisplay,
            fontWeight: 500,
            fontSize: "clamp(28px, 3.6vw, 56px)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            maxWidth: 1200,
            color: "#F0EBE0",
          }}
        >
          I keep a small, working list of vendors I'd actually <Bracket>introduce to a friend</Bracket>. Agencies use it to skip the cold pitch carousel. Vendors retain me to get put in front of buyers who <Bracket>pick up the phone</Bracket>. The introduction is the product — everything else is logistics.
        </div>

        <div
          className="grid"
          style={{
            marginTop: "clamp(60px, 8vw, 100px)",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(32px, 4vw, 64px)",
          }}
        >
          {[
            { n: "01", t: "Vendors retain me.", d: "Flat monthly retainer. No commissions, no per-deal fees. Incentive stays on signal quality, not volume." },
            { n: "02", t: "Introductions in writing.", d: "Each intro is a personal note, not a forwarded deck. Specific principal, specific reason, my name on it." },
            { n: "03", t: "Agencies pay nothing.", d: "The list is free for agency-side use. The credibility only works if I am willing to say no." },
          ].map((p) => (
            <div key={p.n}>
              <div
                style={{
                  ...fontSerif,
                  fontStyle: "italic",
                  fontSize: "clamp(40px, 5vw, 64px)",
                  lineHeight: 1,
                  color: "#3DCAB8",
                  marginBottom: 18,
                }}
              >
                {p.n}.
              </div>
              <div
                style={{
                  ...fontDisplay,
                  fontWeight: 600,
                  fontSize: "clamp(20px, 1.8vw, 26px)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "#F0EBE0",
                  marginBottom: 12,
                }}
              >
                {p.t}
              </div>
              <div
                style={{
                  ...fontDisplay,
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "rgba(240, 235, 224, 0.62)",
                }}
              >
                {p.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VOUCHED */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel count={vendors.length}>Vouched.</SectionLabel>

        <div
          style={{
            ...fontDisplay,
            fontWeight: 400,
            fontSize: "clamp(17px, 1.3vw, 19px)",
            lineHeight: 1.55,
            color: "rgba(240, 235, 224, 0.62)",
            maxWidth: 600,
            marginBottom: "clamp(40px, 5vw, 64px)",
          }}
        >
          A working directory of vendors I'm actively introducing.{" "}
          <span
            onClick={() => goTo("agencies")}
            className="cursor-pointer underline"
            style={{ color: "#3DCAB8", textDecorationThickness: 1, textUnderlineOffset: 4 }}
          >
            Agencies, request the full briefing.
          </span>
        </div>

        <div style={{ borderTop: "1px solid rgba(240, 235, 224, 0.12)" }}>
          {vendors.map((v, i) => (
            <div
              key={v.name}
              onMouseEnter={() => setHoveredVendor(i)}
              onMouseLeave={() => setHoveredVendor(null)}
              className="grid cursor-pointer"
              style={{
                gridTemplateColumns: "60px 1fr auto auto",
                gap: "clamp(20px, 4vw, 60px)",
                padding: "clamp(22px, 2.5vw, 32px) 0",
                borderBottom: "1px solid rgba(240, 235, 224, 0.12)",
                alignItems: "baseline",
                transition: "opacity 0.3s",
                opacity: hoveredVendor !== null && hoveredVendor !== i ? 0.35 : 1,
              }}
            >
              <div
                style={{
                  ...fontDisplay,
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#6B6760",
                  letterSpacing: "0.04em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className="flex items-baseline flex-wrap"
                style={{
                  ...fontDisplay,
                  fontWeight: 700,
                  fontSize: "clamp(28px, 3.6vw, 52px)",
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  color: "#F0EBE0",
                  gap: 16,
                }}
              >
                <span>{v.name}</span>
                {hoveredVendor === i && (
                  <span
                    style={{
                      ...fontSerif,
                      fontStyle: "italic",
                      fontSize: "clamp(18px, 1.4vw, 22px)",
                      fontWeight: 400,
                      color: "#3DCAB8",
                      letterSpacing: "normal",
                    }}
                  >
                    — vouched.
                  </span>
                )}
              </div>
              <div
                style={{
                  ...fontDisplay,
                  fontWeight: 400,
                  fontSize: 14,
                  color: "rgba(240, 235, 224, 0.7)",
                  letterSpacing: "0.02em",
                }}
              >
                {v.category}
              </div>
              <div
                className="text-right"
                style={{
                  ...fontDisplay,
                  fontWeight: 400,
                  fontSize: 13,
                  color: "#6B6760",
                  letterSpacing: "0.04em",
                  minWidth: 50,
                }}
              >
                {v.since}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HEARD */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel>Heard.</SectionLabel>

        <div
          className="grid items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(32px, 4vw, 60px)",
          }}
        >
          <div>
            <div
              style={{
                ...fontSerif,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(36px, 4vw, 56px)",
                lineHeight: 1.1,
                color: "#3DCAB8",
                marginBottom: 24,
                maxWidth: 540,
              }}
            >
              The Vouched —
            </div>
            <div
              style={{
                ...fontDisplay,
                fontWeight: 400,
                fontSize: "clamp(18px, 1.4vw, 22px)",
                lineHeight: 1.5,
                color: "rgba(240, 235, 224, 0.78)",
                maxWidth: 460,
                marginBottom: 32,
              }}
            >
              Conversations with the people I would actually introduce you to. Vendors I vouch for, agency principals who buy them, and the market between.
            </div>
            <div className="flex gap-3.5 flex-wrap">
              {["Apple Podcasts", "Spotify", "YouTube", "RSS"].map((p) => (
                <a
                  key={p}
                  href="#"
                  style={{
                    ...fontDisplay,
                    fontWeight: 500,
                    fontSize: 13,
                    letterSpacing: "0.02em",
                    color: "rgba(240, 235, 224, 0.6)",
                    textDecoration: "none",
                    paddingBottom: 4,
                    borderBottom: "1px solid rgba(240, 235, 224, 0.2)",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#3DCAB8";
                    e.currentTarget.style.borderBottomColor = "#3DCAB8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(240, 235, 224, 0.6)";
                    e.currentTarget.style.borderBottomColor = "rgba(240, 235, 224, 0.2)";
                  }}
                >
                  {p} ↗
                </a>
              ))}
            </div>
          </div>

          <div>
            <div
              className="inline-flex items-center gap-2.5"
              style={{
                ...fontDisplay,
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#3DCAB8",
                marginBottom: 14,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3DCAB8" }} />
              Latest · Ep 04
            </div>
            <h3
              style={{
                ...fontDisplay,
                fontWeight: 700,
                fontSize: "clamp(26px, 2.4vw, 38px)",
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
                color: "#F0EBE0",
                marginTop: 0,
                marginBottom: 14,
              }}
            >
              Why we walked away from the enterprise tier.
            </h3>
            <div
              style={{
                ...fontSerif,
                fontStyle: "italic",
                fontSize: 17,
                color: "rgba(240, 235, 224, 0.6)",
                marginBottom: 20,
              }}
            >
              with [guest name], [agency name]
            </div>
            <p
              style={{
                ...fontDisplay,
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(240, 235, 224, 0.62)",
                margin: 0,
                marginBottom: 24,
              }}
            >
              Most vendors chase the biggest logo on the deck. This agency principal explains why that's exactly backwards if you're selling to brokers — and what he tells founders who ask him to pilot.
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2.5 cursor-pointer"
              style={{
                ...fontDisplay,
                fontWeight: 600,
                fontSize: 14,
                color: "#0A0A0A",
                background: "#3DCAB8",
                border: "none",
                padding: "13px 22px",
                letterSpacing: "0.02em",
              }}
            >
              ▸ Play episode · 47:23
            </button>
          </div>
        </div>
      </section>

      {/* CTA STRIPE */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 1,
            background: "rgba(240, 235, 224, 0.12)",
            border: "1px solid rgba(240, 235, 224, 0.12)",
          }}
        >
          <div
            onClick={() => goTo("vendors")}
            className="cursor-pointer"
            style={{
              background: "#0A0A0A",
              padding: "clamp(40px, 5vw, 64px)",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#13110D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0A0A0A")}
          >
            <div
              style={{
                ...fontDisplay,
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 24,
              }}
            >
              ↳ For vendors
            </div>
            <div
              style={{
                ...fontDisplay,
                fontWeight: 700,
                fontSize: "clamp(36px, 4vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#F0EBE0",
                marginBottom: 18,
              }}
            >
              Apply to be <Bracket>on the list</Bracket>.
            </div>
            <div
              style={{
                ...fontDisplay,
                fontSize: 16,
                lineHeight: 1.5,
                color: "rgba(240, 235, 224, 0.6)",
              }}
            >
              Small intake per quarter. Tell me who it's for and why this is the right room.
            </div>
          </div>

          <div
            onClick={() => goTo("agencies")}
            className="cursor-pointer"
            style={{
              background: "#0A0A0A",
              padding: "clamp(40px, 5vw, 64px)",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#13110D")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0A0A0A")}
          >
            <div
              style={{
                ...fontDisplay,
                fontWeight: 500,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 24,
              }}
            >
              ↳ For agencies
            </div>
            <div
              style={{
                ...fontDisplay,
                fontWeight: 700,
                fontSize: "clamp(36px, 4vw, 56px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#F0EBE0",
                marginBottom: 18,
              }}
            >
              Tell me what <Bracket>you're solving</Bracket>.
            </div>
            <div
              style={{
                ...fontDisplay,
                fontSize: 16,
                lineHeight: 1.5,
                color: "rgba(240, 235, 224, 0.6)",
              }}
            >
              No fee. I'll make the intro or tell you where else I'd actually look.
            </div>
          </div>
        </div>
      </section>

      {/* BRIEF */}
      <section style={{ padding: "clamp(80px, 10vw, 140px) 0" }}>
        <SectionLabel>Brief.</SectionLabel>

        <div
          className="grid items-start"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "clamp(32px, 4vw, 80px)",
          }}
        >
          <div
            style={{
              ...fontDisplay,
              fontWeight: 400,
              fontSize: "clamp(20px, 1.8vw, 26px)",
              lineHeight: 1.4,
              color: "rgba(240, 235, 224, 0.82)",
              letterSpacing: "-0.01em",
              maxWidth: 540,
            }}
          >
            One email per month. New names on the list, what I'm watching in the channel, and one thing I'd push back on.
          </div>

          <div>
            {!briefSignup.submitted ? (
              <form onSubmit={submitBriefSignup} className="flex flex-col gap-4">
                <input
                  type="email"
                  required
                  value={briefSignup.email}
                  onChange={(e) => setBriefSignup({ ...briefSignup, email: e.target.value })}
                  placeholder="your email"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid rgba(240, 235, 224, 0.3)",
                    ...fontDisplay,
                    fontWeight: 400,
                    fontSize: "clamp(22px, 2vw, 30px)",
                    color: "#F0EBE0",
                    padding: "14px 0",
                    outline: "none",
                    width: "100%",
                  }}
                />
                <button
                  type="submit"
                  className="self-start cursor-pointer"
                  style={{
                    ...fontDisplay,
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#0A0A0A",
                    background: "#3DCAB8",
                    border: "none",
                    padding: "14px 26px",
                    letterSpacing: "0.02em",
                  }}
                >
                  Subscribe →
                </button>
              </form>
            ) : (
              <div
                style={{
                  ...fontSerif,
                  fontStyle: "italic",
                  fontSize: "clamp(24px, 2.4vw, 36px)",
                  lineHeight: 1.2,
                  color: "#3DCAB8",
                }}
              >
                You're on the list. First brief lands the first Tuesday of next month.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  const VendorsView = (
    <section style={{ padding: "clamp(60px, 8vw, 120px) 0" }}>
      <button
        type="button"
        onClick={() => goTo("home")}
        className="cursor-pointer"
        style={{
          background: "transparent",
          border: "none",
          ...fontDisplay,
          fontSize: 13,
          color: "#6B6760",
          marginBottom: 60,
          padding: 0,
          letterSpacing: "0.04em",
        }}
      >
        ← back
      </button>
      <SectionLabel>For vendors.</SectionLabel>
      <p
        style={{
          ...fontDisplay,
          fontSize: "clamp(18px, 1.5vw, 22px)",
          lineHeight: 1.5,
          color: "rgba(240, 235, 224, 0.7)",
          maxWidth: 640,
          marginTop: 0,
          marginBottom: 56,
        }}
      >
        Small intake per quarter. Tell me what you do, who it's for, and why this is the right room.
      </p>
      {!vendorForm.submitted ? (
        <form onSubmit={submitVendorForm} className="grid gap-8" style={{ maxWidth: 640 }}>
          {[
            { k: "company", label: "Company", placeholder: "Acme Submissions, Inc." },
            { k: "category", label: "Category", placeholder: "AMS, raters, benefits, claims, personal lines..." },
          ].map((f) => (
            <div key={f.k}>
              <label
                className="block"
                style={{
                  ...fontDisplay,
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#6B6760",
                  marginBottom: 8,
                }}
              >
                {f.label}
              </label>
              <input
                type="text"
                required
                value={vendorForm[f.k]}
                onChange={(e) => setVendorForm({ ...vendorForm, [f.k]: e.target.value })}
                placeholder={f.placeholder}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(240, 235, 224, 0.2)",
                  ...fontDisplay,
                  fontSize: 18,
                  color: "#F0EBE0",
                  padding: "10px 0",
                  outline: "none",
                  width: "100%",
                }}
              />
            </div>
          ))}
          <div>
            <label
              className="block"
              style={{
                ...fontDisplay,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 8,
              }}
            >
              Why this room, why now
            </label>
            <textarea
              required
              value={vendorForm.why}
              onChange={(e) => setVendorForm({ ...vendorForm, why: e.target.value })}
              placeholder="The one thing about your product I'd tell an agency principal in a sentence."
              style={{
                background: "transparent",
                border: "1px solid rgba(240, 235, 224, 0.12)",
                ...fontDisplay,
                fontSize: 17,
                color: "#F0EBE0",
                padding: 16,
                outline: "none",
                width: "100%",
                minHeight: 140,
                resize: "vertical",
                lineHeight: 1.5,
              }}
            />
          </div>
          <button
            type="submit"
            className="self-start cursor-pointer"
            style={{
              ...fontDisplay,
              fontWeight: 600,
              fontSize: 14,
              color: "#0A0A0A",
              background: "#3DCAB8",
              border: "none",
              padding: "14px 26px",
              letterSpacing: "0.02em",
            }}
          >
            Submit application →
          </button>
        </form>
      ) : (
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              ...fontSerif,
              fontStyle: "italic",
              fontSize: "clamp(28px, 3vw, 44px)",
              lineHeight: 1.2,
              color: "#3DCAB8",
              marginBottom: 16,
            }}
          >
            Received.
          </div>
          <p
            style={{
              ...fontDisplay,
              fontSize: 18,
              lineHeight: 1.55,
              color: "rgba(240, 235, 224, 0.72)",
            }}
          >
            I'll read it this week. If it's a fit, you'll hear from me directly. If not, I'll tell you why and what I'd need to see.
          </p>
        </div>
      )}
    </section>
  );

  const AgenciesView = (
    <section style={{ padding: "clamp(60px, 8vw, 120px) 0" }}>
      <button
        type="button"
        onClick={() => goTo("home")}
        className="cursor-pointer"
        style={{
          background: "transparent",
          border: "none",
          ...fontDisplay,
          fontSize: 13,
          color: "#6B6760",
          marginBottom: 60,
          padding: 0,
          letterSpacing: "0.04em",
        }}
      >
        ← back
      </button>
      <SectionLabel>For agencies.</SectionLabel>
      <p
        style={{
          ...fontDisplay,
          fontSize: "clamp(18px, 1.5vw, 22px)",
          lineHeight: 1.5,
          color: "rgba(240, 235, 224, 0.7)",
          maxWidth: 640,
          marginTop: 0,
          marginBottom: 56,
        }}
      >
        No fee. If I have someone on the list who fits, I'll make the intro. If not, I'll tell you where I'd actually look.
      </p>
      {!agencyForm.submitted ? (
        <form onSubmit={submitAgencyForm} className="grid gap-8" style={{ maxWidth: 640 }}>
          <div>
            <label
              className="block"
              style={{
                ...fontDisplay,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 8,
              }}
            >
              Agency
            </label>
            <input
              type="text"
              required
              value={agencyForm.agency}
              onChange={(e) => setAgencyForm({ ...agencyForm, agency: e.target.value })}
              placeholder="Your agency name and city"
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(240, 235, 224, 0.2)",
                ...fontDisplay,
                fontSize: 18,
                color: "#F0EBE0",
                padding: "10px 0",
                outline: "none",
                width: "100%",
              }}
            />
          </div>
          <div>
            <label
              className="block"
              style={{
                ...fontDisplay,
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 8,
              }}
            >
              What you're solving
            </label>
            <textarea
              required
              value={agencyForm.problem}
              onChange={(e) => setAgencyForm({ ...agencyForm, problem: e.target.value })}
              placeholder="The actual headache. The thing costing producer hours every week."
              style={{
                background: "transparent",
                border: "1px solid rgba(240, 235, 224, 0.12)",
                ...fontDisplay,
                fontSize: 17,
                color: "#F0EBE0",
                padding: 16,
                outline: "none",
                width: "100%",
                minHeight: 140,
                resize: "vertical",
                lineHeight: 1.5,
              }}
            />
          </div>
          <button
            type="submit"
            className="self-start cursor-pointer"
            style={{
              ...fontDisplay,
              fontWeight: 600,
              fontSize: 14,
              color: "#0A0A0A",
              background: "#3DCAB8",
              border: "none",
              padding: "14px 26px",
              letterSpacing: "0.02em",
            }}
          >
            Request a name →
          </button>
        </form>
      ) : (
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              ...fontSerif,
              fontStyle: "italic",
              fontSize: "clamp(28px, 3vw, 44px)",
              lineHeight: 1.2,
              color: "#3DCAB8",
              marginBottom: 16,
            }}
          >
            Received.
          </div>
          <p
            style={{
              ...fontDisplay,
              fontSize: 18,
              lineHeight: 1.55,
              color: "rgba(240, 235, 224, 0.72)",
            }}
          >
            I'll get back to you within two business days — either with a name and a warm intro, or with a straight answer about why this isn't ready for an intro yet.
          </p>
        </div>
      )}
    </section>
  );

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundColor: "#0A0A0A",
        color: "#F0EBE0",
        ...fontDisplay,
      }}
    >
      {/* TOP-LEFT: signature wordmark */}
      <div
        className="fixed cursor-pointer inline-flex items-start"
        style={{
          top: 18,
          left: 32,
          zIndex: 50,
          ...fontScript,
          fontWeight: 400,
          fontSize: 38,
          lineHeight: 1,
          letterSpacing: "0.005em",
          color: wordmarkColor,
          gap: 4,
          transition: "color 0.1s linear",
        }}
        onClick={() => goTo("home")}
      >
        <span>Casey B. Nelson</span>
        <sup
          style={{
            ...fontSerif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 11,
            marginTop: 8,
            color: "#3DCAB8",
            letterSpacing: 0,
          }}
        >
          ©
        </sup>
      </div>

      {/* TOP-RIGHT: nav */}
      <nav
        className="fixed flex"
        style={{
          top: 28,
          right: 32,
          zIndex: 50,
          gap: 28,
          mixBlendMode: "difference",
        }}
      >
        {[
          { id: "home", label: "Index" },
          { id: "vendors", label: "Vendors" },
          { id: "agencies", label: "Agencies" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(item.id)}
            className="cursor-pointer"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              ...fontDisplay,
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.01em",
              color: activeView === item.id ? "#3DCAB8" : "#fff",
              transition: "color 0.2s",
            }}
          >
            {item.label}
            {activeView === item.id && (
              <span
                className="inline-block"
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#3DCAB8",
                  marginLeft: 6,
                  transform: "translateY(-2px)",
                }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <main
        className="mx-auto"
        style={{
          padding: "clamp(80px, 10vh, 110px) clamp(28px, 5vw, 80px) 0 clamp(28px, 5vw, 80px)",
          maxWidth: 1680,
        }}
      >
        {activeView === "home" && HomeView}
        {activeView === "vendors" && VendorsView}
        {activeView === "agencies" && AgenciesView}
      </main>

      {/* FOOTER */}
      <footer
        className="mx-auto"
        style={{
          padding: "clamp(60px, 8vw, 100px) clamp(28px, 5vw, 80px) clamp(40px, 4vw, 60px) clamp(28px, 5vw, 80px)",
          maxWidth: 1680,
          borderTop: "1px solid rgba(240, 235, 224, 0.12)",
          marginTop: "clamp(80px, 12vw, 140px)",
        }}
      >
        <div
          style={{
            ...fontDisplay,
            fontWeight: 800,
            fontSize: "clamp(48px, 8vw, 120px)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            marginBottom: "clamp(40px, 6vw, 80px)",
            maxWidth: 1200,
          }}
        >
          The introduction is the <Bracket>product</Bracket>.
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "clamp(28px, 3vw, 48px)",
            marginBottom: 60,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 14,
              }}
            >
              Contact.
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(240, 235, 224, 0.85)" }}>
              Casey B. Nelson
              <br />
              Private list, by introduction
              <br />
              <a href="mailto:casey@caseybnelson.com" style={{ color: "#3DCAB8", textDecoration: "none" }}>
                casey@caseybnelson.com
              </a>
            </div>
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 14,
              }}
            >
              Listen.
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.9, color: "rgba(240, 235, 224, 0.85)" }}>
              <div>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                  Apple Podcasts ↗
                </a>
              </div>
              <div>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                  Spotify ↗
                </a>
              </div>
              <div>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                  YouTube ↗
                </a>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 14,
              }}
            >
              Follow.
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.9, color: "rgba(240, 235, 224, 0.85)" }}>
              <div>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                  LinkedIn ↗
                </a>
              </div>
              <div>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                  Twitter ↗
                </a>
              </div>
              <div>
                <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
                  Newsletter ↗
                </a>
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#6B6760",
                marginBottom: 14,
              }}
            >
              Index.
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.9, color: "rgba(240, 235, 224, 0.85)" }}>
              <div onClick={() => goTo("home")} className="cursor-pointer">
                Home
              </div>
              <div onClick={() => goTo("vendors")} className="cursor-pointer">
                For vendors
              </div>
              <div onClick={() => goTo("agencies")} className="cursor-pointer">
                For agencies
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex justify-between flex-wrap"
          style={{
            gap: 16,
            paddingTop: 32,
            borderTop: "1px solid rgba(240, 235, 224, 0.08)",
            fontSize: 12,
            color: "#6B6760",
            letterSpacing: "0.04em",
          }}
        >
          <div>© 2026 Casey B. Nelson</div>
          <div
            style={{
              ...fontSerif,
              fontStyle: "italic",
              fontSize: 14,
            }}
          >
            A small market, kept small on purpose.
          </div>
        </div>
      </footer>
    </div>
  );
}
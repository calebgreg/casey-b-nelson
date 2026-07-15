import React, { useEffect, useRef } from "react";
import { useTheme } from "@/lib/ThemeContext";

const PHOTO =
  "https://images.unsplash.com/photo-1761998535969-11ca31e89f78?q=80&w=2400&auto=format&fit=crop";

// Photorealistic spotlight photo + a subtle layer of drifting dust motes.
export default function HeroSpotlight() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let dust = [];

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
    for (let i = 0; i < 70; i++) {
      dust.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.05,
        vy: 0.015 + Math.random() * 0.04,
        r: 0.3 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.004,
      });
    }

    const draw = () => {
      const r = canvas.getBoundingClientRect();
      const w = r.width, h = r.height;
      ctx.clearRect(0, 0, w, h);
      const isLight = document.documentElement.dataset.theme === "light";

      dust.forEach((p) => {
        p.phase += p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.04;
        p.y += p.vy;
        if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        // Motes are brighter toward the right side, where the light lives
        const lit = Math.pow(Math.max(0, (p.x / w - 0.35) / 0.65), 1.6);
        if (lit <= 0.02) return;
        const twinkle = 0.55 + 0.45 * Math.sin(p.phase * 3);
        const alpha = lit * twinkle * (isLight ? 0.25 : 0.55);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 230, ${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: "none" }}>
      <img
        src={PHOTO}
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover", objectPosition: "70% 40%", opacity: theme === "light" ? 0.14 : 1 }}
      />
      {/* Slow, subtle color drift over the light beams */}
      <style>{`
        @keyframes heroTintCycle {
          0%   { background-color: rgba(61, 202, 184, 0.0); }
          18%  { background-color: rgba(61, 202, 184, 0.16); }
          38%  { background-color: rgba(150, 120, 255, 0.13); }
          58%  { background-color: rgba(255, 190, 110, 0.11); }
          78%  { background-color: rgba(61, 202, 184, 0.14); }
          100% { background-color: rgba(61, 202, 184, 0.0); }
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          mixBlendMode: "color",
          animation: "heroTintCycle 45s ease-in-out infinite",
          maskImage: "linear-gradient(90deg, transparent 0%, transparent 30%, black 65%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, transparent 30%, black 65%)",
        }}
      />
      {/* Fade the left side to the page background so the headline stays crisp */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, var(--site-bg) 0%, rgba(var(--bg-rgb), 0.85) 30%, rgba(var(--bg-rgb), 0.35) 55%, rgba(var(--bg-rgb), 0) 80%)" }}
      />
      {/* Fade the bottom into the page so the section blends seamlessly */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(var(--bg-rgb), 0.55) 0%, rgba(var(--bg-rgb), 0) 30%, rgba(var(--bg-rgb), 0) 70%, var(--site-bg) 100%)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
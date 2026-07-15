import React, { useEffect, useRef } from "react";

// A stage spotlight beam with slowly drifting dust motes caught in the light.
export default function HeroSpotlight() {
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
    const DUST_COUNT = 110;
    for (let i = 0; i < DUST_COUNT; i++) {
      dust.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.06,
        vy: 0.02 + Math.random() * 0.05,
        r: 0.4 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.004,
      });
    }

    // Beam geometry: source above the top-right area, cone widening toward the floor
    const beam = (w, h) => ({
      sx: w * 0.68,          // source x
      sy: -h * 0.55,         // source y (above the canvas)
      topHalf: w * 0.015,    // half-width at source
      botHalf: w * 0.26,     // half-width at floor
    });

    // How close a point is to the beam center, 1 = center, 0 = outside
    const beamIntensity = (x, y, w, h) => {
      const b = beam(w, h);
      const t = (y - b.sy) / (h - b.sy);
      if (t <= 0) return 0;
      const half = b.topHalf + (b.botHalf - b.topHalf) * t;
      const cx = b.sx;
      const d = Math.abs(x - cx) / half;
      if (d >= 1) return 0;
      // softer toward the edges, fades slightly with depth
      return Math.pow(1 - d, 1.6) * (0.35 + 0.65 * t);
    };

    let time = 0;
    const draw = () => {
      const r = canvas.getBoundingClientRect();
      const w = r.width, h = r.height;
      ctx.clearRect(0, 0, w, h);
      const isLight = document.documentElement.dataset.theme === "light";
      time += 1;

      const b = beam(w, h);
      // Gentle flicker, like a real lamp
      const flicker = 1 + Math.sin(time * 0.013) * 0.04 + Math.sin(time * 0.037) * 0.02;

      // The cone
      const grad = ctx.createLinearGradient(b.sx, 0, b.sx, h);
      if (isLight) {
        grad.addColorStop(0, `rgba(255, 250, 235, ${0.5 * flicker})`);
        grad.addColorStop(1, `rgba(255, 245, 220, ${0.14 * flicker})`);
      } else {
        grad.addColorStop(0, `rgba(255, 246, 224, ${0.10 * flicker})`);
        grad.addColorStop(1, `rgba(255, 246, 224, ${0.028 * flicker})`);
      }
      ctx.beginPath();
      ctx.moveTo(b.sx - b.topHalf, b.sy);
      ctx.lineTo(b.sx + b.topHalf, b.sy);
      ctx.lineTo(b.sx + b.botHalf, h);
      ctx.lineTo(b.sx - b.botHalf, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Brighter core of the beam
      ctx.beginPath();
      ctx.moveTo(b.sx - b.topHalf * 0.5, b.sy);
      ctx.lineTo(b.sx + b.topHalf * 0.5, b.sy);
      ctx.lineTo(b.sx + b.botHalf * 0.45, h);
      ctx.lineTo(b.sx - b.botHalf * 0.45, h);
      ctx.closePath();
      ctx.fillStyle = isLight
        ? `rgba(255, 252, 242, ${0.30 * flicker})`
        : `rgba(255, 248, 230, ${0.055 * flicker})`;
      ctx.fill();

      // Floor pool where the light lands
      const poolGrad = ctx.createRadialGradient(b.sx, h, 0, b.sx, h, b.botHalf * 1.5);
      poolGrad.addColorStop(0, isLight ? `rgba(255, 250, 235, ${0.45 * flicker})` : `rgba(255, 246, 224, ${0.09 * flicker})`);
      poolGrad.addColorStop(1, "rgba(255, 246, 224, 0)");
      ctx.save();
      ctx.translate(b.sx, h);
      ctx.scale(1, 0.28);
      ctx.beginPath();
      ctx.arc(0, 0, b.botHalf * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = poolGrad;
      ctx.translate(-b.sx, -h);
      ctx.translate(b.sx, h);
      ctx.fill();
      ctx.restore();

      // Dust motes: drift down slowly, only visible inside the beam
      dust.forEach((p) => {
        p.phase += p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.05;
        p.y += p.vy;
        if (p.y > h + 4) { p.y = -4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        const lit = beamIntensity(p.x, p.y, w, h);
        if (lit <= 0.01) return;
        const twinkle = 0.6 + 0.4 * Math.sin(p.phase * 3);
        const alpha = lit * twinkle * (isLight ? 0.9 : 0.75) * flicker;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? `rgba(120, 100, 60, ${alpha * 0.5})` : `rgba(255, 248, 230, ${alpha})`;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />;
}
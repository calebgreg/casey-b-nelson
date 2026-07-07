import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };
const fontScript = { fontFamily: '"Ms Madi", "Brush Script MT", cursive' };

export default function SiteHeader({ activeView = "", onNav }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [wordmarkColor, setWordmarkColor] = useState(theme === "light" ? "#17140F" : "#ffffff");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-driven wordmark color cycle
  useEffect(() => {
    const palette = theme === "light"
      ? [
          [23, 20, 15],
          [29, 158, 140],
          [60, 54, 44],
          [130, 90, 170],
          [29, 158, 140],
          [170, 120, 40],
          [23, 20, 15],
        ]
      : [
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
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [theme]);

  const nav = (id) => {
    if (onNav) onNav(id);
    else window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between"
      style={{ zIndex: 50, padding: "0 clamp(16px, 4vw, 32px)", height: 60, transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease", background: scrolled ? "rgba(var(--bg-rgb), 0.55)" : "transparent", backdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none", WebkitBackdropFilter: scrolled ? "blur(18px) saturate(140%)" : "none", borderBottom: scrolled ? "1px solid rgba(var(--ink-rgb), 0.07)" : "1px solid transparent" }}>
      <div className="cursor-pointer inline-flex items-start" style={{ ...fontScript, fontWeight: 400, fontSize: "clamp(26px, 5vw, 38px)", lineHeight: 1, letterSpacing: "0.005em", color: wordmarkColor, gap: 4, transition: "color 0.1s linear" }} onClick={() => nav("home")}>
        <span>Casey B. Nelson</span>
        <sup style={{ ...fontSerif, fontStyle: "italic", fontWeight: 400, fontSize: 11, marginTop: 8, color: "var(--accent)", letterSpacing: 0 }}>©</sup>
      </div>
      <nav className="flex" style={{ gap: "clamp(16px, 3vw, 28px)" }}>
        {[
          { id: "vendors", label: "Vendors" },
          { id: "agencies", label: "Agencies" },
        ].map((item) => (
          <button key={item.id} type="button" onClick={() => nav(item.id)} className="cursor-pointer"
            style={{ background: "transparent", border: "none", padding: 0, ...fontDisplay, fontWeight: 500, fontSize: "clamp(12px, 2.5vw, 14px)", letterSpacing: "0.01em", color: activeView === item.id ? "var(--accent)" : "rgba(var(--ink-rgb), 0.85)", transition: "color 0.2s", whiteSpace: "nowrap" }}>
            {item.label}
            {activeView === item.id && <span className="inline-block" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", marginLeft: 6, transform: "translateY(-2px)" }} />}
          </button>
        ))}
        <button type="button" onClick={() => nav("events")} className="cursor-pointer"
          style={{ background: "transparent", border: "none", padding: 0, ...fontDisplay, fontWeight: 500, fontSize: "clamp(12px, 2.5vw, 14px)", letterSpacing: "0.01em", color: activeView === "events" ? "var(--accent)" : "rgba(var(--ink-rgb), 0.85)", transition: "color 0.2s", whiteSpace: "nowrap" }}>
          Events
          {activeView === "events" && <span className="inline-block" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", marginLeft: 6, transform: "translateY(-2px)" }} />}
        </button>
        <button type="button" onClick={toggleTheme} className="cursor-pointer" style={{ background: "transparent", border: "none", padding: 0, color: "rgba(var(--ink-rgb), 0.85)", display: "inline-flex", alignItems: "center" }} aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>
    </header>
  );
}
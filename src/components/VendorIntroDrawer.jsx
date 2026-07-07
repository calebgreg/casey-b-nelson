import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function VendorIntroDrawer({ vendor, onClose }) {
  const [form, setForm] = React.useState({ agency: "", problem: "", submitted: false });

  const fontDisplay = { fontFamily: '"Inter Tight", system-ui, sans-serif' };
  const fontSerif = { fontFamily: '"Instrument Serif", Georgia, serif' };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm({ ...form, submitted: true });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, backdropFilter: "blur(4px)" }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 101,
        background: "var(--panel)", borderTop: "1px solid rgba(var(--ink-rgb),0.12)",
        maxHeight: "85vh", overflowY: "auto",
        animation: "drawerUp 0.35s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <style>{`@keyframes drawerUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(32px, 4vw, 56px) clamp(20px, 5vw, 48px)" }}>
          {/* Header */}
          <div className="flex items-start justify-between" style={{ marginBottom: 32 }}>
            <div>
              <div style={{ ...fontDisplay, fontWeight: 500, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
                ↳ Request an intro
              </div>
              <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(28px, 3.5vw, 44px)", lineHeight: 1.1, color: "var(--ink)" }}>
                {vendor.name}
              </div>
              <div style={{ ...fontDisplay, fontSize: 14, color: "var(--muted)", marginTop: 6 }}>{vendor.category}</div>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4, marginTop: 4 }}>
              <X size={20} />
            </button>
          </div>

          {!form.submitted ? (
            <form onSubmit={handleSubmit} className="grid gap-7">
              <div>
                <label className="block" style={{ ...fontDisplay, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Your agency</label>
                <input
                  type="text" required
                  value={form.agency}
                  onChange={(e) => setForm({ ...form, agency: e.target.value })}
                  placeholder="Agency name and city"
                  style={{ background: "transparent", border: "none", borderBottom: "1px solid rgba(var(--ink-rgb),0.2)", ...fontDisplay, fontSize: 18, color: "var(--ink)", padding: "10px 0", outline: "none", width: "100%" }}
                />
              </div>
              <div>
                <label className="block" style={{ ...fontDisplay, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>What you're solving</label>
                <textarea
                  required
                  value={form.problem}
                  onChange={(e) => setForm({ ...form, problem: e.target.value })}
                  placeholder="The actual headache. The thing costing producer hours every week."
                  style={{ background: "transparent", border: "1px solid rgba(var(--ink-rgb),0.12)", ...fontDisplay, fontSize: 16, color: "var(--ink)", padding: 16, outline: "none", width: "100%", minHeight: 120, resize: "vertical", lineHeight: 1.5 }}
                />
              </div>
              <div className="flex gap-4 items-center flex-wrap">
                <button type="submit" className="cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
                  Request the intro →
                </button>
                <button type="button" onClick={onClose} className="cursor-pointer" style={{ ...fontDisplay, fontSize: 13, color: "var(--muted)", background: "transparent", border: "none", padding: 0 }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ ...fontSerif, fontStyle: "italic", fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.2, color: "var(--accent)", marginBottom: 16 }}>Received.</div>
              <p style={{ ...fontDisplay, fontSize: 17, lineHeight: 1.55, color: "rgba(var(--ink-rgb),0.72)", marginBottom: 32 }}>
                I'll get back to you within two business days — either with a warm intro to {vendor.name}, or a straight answer about fit.
              </p>
              <button onClick={onClose} className="cursor-pointer" style={{ ...fontDisplay, fontWeight: 600, fontSize: 14, color: "var(--accent-ink)", background: "var(--accent)", border: "none", padding: "14px 26px", letterSpacing: "0.02em" }}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ctaBackdropGlow, ctaCardsConverge, finalCtaSettle, finalTitleReveal, primaryButtonPop, proofChipsOrbitIn } from "../motion/atomic/finalCtaCardsConverge";
const cards = ["Ready setup", "Clear proof", "Fast launch"];
const chips = ["No code", "Reusable", "Approved next"];
export const FinalCtaCardsConvergePreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const backdrop = ctaBackdropGlow(input);
  const title = finalTitleReveal(input);
  const button = primaryButtonPop(input);
  const settle = finalCtaSettle(input);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, rgba(37,99,235,.18), transparent 34%), radial-gradient(circle at 18% 80%, rgba(20,184,166,.16), transparent 30%), linear-gradient(135deg,#F8FAFC,#F3F7FF 52%,#F7F1E8)", overflow: "hidden", fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif' }}>
      <div style={{ position: "absolute", inset: -80, opacity: .16, backgroundImage: "linear-gradient(rgba(15,23,42,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.10) 1px, transparent 1px)", backgroundSize: "46px 46px", transform: backdrop.transform }} />
      <div style={{ position: "absolute", inset: 0, opacity: settle.opacity, transform: settle.transform }}>
        <div style={{ position: "absolute", left: 126, top: 126, display: "flex", gap: 18 }}>
          {cards.map((card, i) => <div key={card} style={{ width: 210, height: 126, borderRadius: 28, background: "rgba(255,255,255,.92)", border: "1px solid rgba(15,23,42,.10)", boxShadow: "0 20px 54px rgba(30,41,59,.12)", display: "grid", placeItems: "center", color: "#0F172A", fontWeight: 900, fontSize: 20, ...ctaCardsConverge(input, i) }}>{card}</div>)}
        </div>
        <div style={{ position: "absolute", left: 150, right: 150, top: 280, textAlign: "center", ...title }}>
          <div style={{ color: "#2563EB", fontSize: 13, fontWeight: 900, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 16 }}>Shot 30 / Final CTA Candidate</div>
          <h1 style={{ margin: 0, color: "#0F172A", fontSize: 50, lineHeight: 1, letterSpacing: "-.06em", fontWeight: 950 }}>Ready to turn this into your next video?</h1>
        </div>
        <div style={{ position: "absolute", left: 356, top: 402, width: 248, height: 74, borderRadius: 999, background: "#2563EB", color: "white", boxShadow: "0 24px 68px rgba(37,99,235,.25)", display: "grid", placeItems: "center", fontSize: 22, fontWeight: 950, ...button }}>Start now</div>
        <div style={{ position: "absolute", left: 210, right: 210, bottom: 34, display: "flex", justifyContent: "center", gap: 14 }}>
          {chips.map((chip, i) => <div key={chip} style={{ padding: "12px 18px", borderRadius: 999, background: "rgba(255,255,255,.86)", border: "1px solid rgba(15,23,42,.08)", color: "#0F766E", fontWeight: 900, ...proofChipsOrbitIn(input, i) }}>{chip}</div>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

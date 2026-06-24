import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  comparisonBackdropDrift,
  comparisonDividerSweep,
  comparisonSettle,
  leftResultSlide,
  rightResultSlide,
  splitPanelsReveal,
  winnerCardLift,
} from "../motion/atomic/splitCompareCards";

const Row: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 74px", alignItems: "center", height: 42 }}>
    <span style={{ color: "#64748B", fontSize: 14, fontWeight: 700 }}>{label}</span>
    <strong style={{ color, fontSize: 15, textAlign: "right" }}>{value}</strong>
  </div>
);

const Panel: React.FC<{ title: string; tone: "muted" | "win" }> = ({ title, tone }) => {
  const color = tone === "win" ? "#0F766E" : "#64748B";
  return (
    <div
      style={{
        width: 338,
        height: 260,
        borderRadius: 26,
        background: "rgba(255,255,255,0.92)",
        border: `1px solid ${tone === "win" ? "rgba(15,118,110,.28)" : "rgba(15,23,42,.10)"}`,
        boxShadow: tone === "win" ? "0 26px 70px rgba(15,118,110,.18)" : "0 22px 60px rgba(30,41,59,.12)",
        padding: 24,
      }}
    >
      <div style={{ color, fontSize: 13, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ height: 24 }} />
      <Row label="Match" value={tone === "win" ? "94%" : "61%"} color={color} />
      <Row label="Setup" value={tone === "win" ? "Fast" : "Manual"} color={color} />
      <Row label="Signal" value={tone === "win" ? "Clear" : "Noisy"} color={color} />
      <div style={{ marginTop: 20, height: 54, borderRadius: 16, background: tone === "win" ? "rgba(15,118,110,.10)" : "rgba(100,116,139,.10)" }} />
    </div>
  );
};

export const SplitCompareCardsPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const backdrop = comparisonBackdropDrift(input);
  const panels = splitPanelsReveal(input);
  const left = leftResultSlide(input);
  const right = rightResultSlide(input);
  const divider = comparisonDividerSweep(input);
  const winner = winnerCardLift(input);
  const settle = comparisonSettle(input);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 76% 24%, rgba(15,118,110,0.20), transparent 30%), radial-gradient(circle at 20% 78%, rgba(37,99,235,0.18), transparent 32%), linear-gradient(135deg, #F8FAFC 0%, #EEF6FF 52%, #F8F4EA 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -80,
          opacity: 0.2,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          transform: backdrop.transform,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: settle.transform, opacity: settle.opacity }}>
        <div style={{ position: "absolute", left: 78, top: 70 }}>
          <div style={{ color: "#2563EB", fontSize: 13, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
            Shot 27 / Result Comparison Candidate
          </div>
          <h1 style={{ margin: 0, color: "#0F172A", fontSize: 42, lineHeight: 1, letterSpacing: "-0.055em", fontWeight: 900, maxWidth: 560 }}>
            Compare options. Make the result obvious.
          </h1>
        </div>
        <div style={{ position: "absolute", left: 108, top: 214, display: "flex", gap: 88, ...panels }}>
          <div style={left}>
            <Panel title="Before" tone="muted" />
          </div>
          <div style={right}>
            <Panel title="After" tone="win" />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 478,
            top: 232,
            width: 4,
            height: 226,
            borderRadius: 99,
            background: "linear-gradient(180deg, transparent, #2563EB, transparent)",
            transformOrigin: "center",
            ...divider,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 132,
            bottom: 76,
            width: 254,
            height: 82,
            borderRadius: 24,
            background: "rgba(15,118,110,.94)",
            color: "white",
            boxShadow: "0 24px 70px rgba(15,118,110,.22)",
            display: "grid",
            placeItems: "center",
            fontSize: 20,
            fontWeight: 900,
            ...winner,
          }}
        >
          Recommended path
        </div>
      </div>
    </AbsoluteFill>
  );
};

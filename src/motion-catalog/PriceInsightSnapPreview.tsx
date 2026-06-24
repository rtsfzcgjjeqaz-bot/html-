import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  commerceBackdropDrift,
  deviceShelfPush,
  insightPanelSlide,
  priceBadgePop,
  priceInsightSettle,
  savingsEmphasisPulse,
  valueRowsReveal,
} from "../motion/atomic/priceInsightSnap";

const rows = ["Plan", "Value", "Savings"];

export const PriceInsightSnapPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const backdrop = commerceBackdropDrift(input);
  const device = deviceShelfPush(input);
  const badge = priceBadgePop(input);
  const panel = insightPanelSlide(input);
  const emphasis = savingsEmphasisPulse(input);
  const settle = priceInsightSettle(input);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 24%, rgba(251,146,60,0.20), transparent 30%), radial-gradient(circle at 78% 30%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(135deg, #FFF8ED 0%, #F7FBFF 54%, #EEF7F1 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -80,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.10) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          transform: backdrop.transform,
        }}
      />
      <div style={{ position: "absolute", inset: 0, opacity: settle.opacity, transform: settle.transform }}>
        <div style={{ position: "absolute", left: 74, top: 60 }}>
          <div style={{ color: "#EA580C", fontSize: 13, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
            Shot 50 / Price Insight Candidate
          </div>
          <h1 style={{ margin: 0, color: "#0F172A", fontSize: 42, lineHeight: 1, letterSpacing: "-0.055em", fontWeight: 900, maxWidth: 590 }}>
            Make the value moment impossible to miss.
          </h1>
        </div>

        <div
          style={{
            position: "absolute",
            left: 158,
            top: 190,
            width: 620,
            height: 280,
            borderRadius: 34,
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(15,23,42,0.12)",
            boxShadow: "0 34px 96px rgba(30,41,59,0.17)",
            transformStyle: "preserve-3d",
            ...device,
          }}
        >
          <div style={{ height: 44, borderBottom: "1px solid rgba(15,23,42,0.08)", display: "flex", alignItems: "center", padding: "0 22px", gap: 8 }}>
            {["#FB7185", "#FDBA74", "#34D399"].map((color) => (
              <span key={color} style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
            ))}
            <div style={{ marginLeft: 16, height: 10, width: 220, borderRadius: 999, background: "#E2E8F0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 24, padding: 26 }}>
            <div>
              <div style={{ height: 18, width: 190, borderRadius: 999, background: "#0F172A", marginBottom: 16 }} />
              <div style={{ height: 10, width: 250, borderRadius: 999, background: "#CBD5E1", marginBottom: 12 }} />
              <div style={{ height: 10, width: 208, borderRadius: 999, background: "#E2E8F0", marginBottom: 28 }} />
              <div style={{ height: 92, borderRadius: 24, background: "linear-gradient(135deg, rgba(14,165,233,.10), rgba(34,197,94,.10))", border: "1px solid rgba(14,165,233,.16)" }} />
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ height: 168, borderRadius: 26, background: "#F8FAFC", border: "1px solid rgba(15,23,42,.08)", padding: 18, ...panel }}>
                <div style={{ color: "#0369A1", fontSize: 12, fontWeight: 900, textTransform: "uppercase", marginBottom: 16 }}>Pricing Evidence</div>
                {rows.map((row, index) => {
                  const rowStyle = valueRowsReveal(input, index);
                  return (
                    <div key={row} style={{ display: "grid", gridTemplateColumns: "72px 1fr", alignItems: "center", gap: 12, marginBottom: 14, transformOrigin: "left", ...rowStyle }}>
                      <strong style={{ color: "#334155", fontSize: 13 }}>{row}</strong>
                      <span style={{ height: 12, borderRadius: 999, background: index === 2 ? "#22C55E" : "#CBD5E1", width: `${76 + index * 8}%` }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 106,
            top: 318,
            width: 150,
            height: 118,
            borderRadius: 30,
            background: "#FFF7ED",
            border: "2px solid rgba(234,88,12,.24)",
            boxShadow: "0 24px 62px rgba(234,88,12,.20)",
            display: "grid",
            placeItems: "center",
            color: "#9A3412",
            ...badge,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>Save</div>
            <div style={{ fontSize: 42, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.06em", transformOrigin: "center", ...emphasis }}>28%</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>this cycle</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  aiBackdropFloat,
  aiSuggestionSettle,
  connectionLineDraw,
  contextPanelReveal,
  recommendationEmphasis,
  suggestionBubbleFloat,
} from "../motion/atomic/aiSuggestionBubbles";

const suggestions = ["Summarize intent", "Find stronger proof", "Recommend next action"];

export const AiSuggestionBubblesPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const backdrop = aiBackdropFloat(input);
  const context = contextPanelReveal(input);
  const line = connectionLineDraw(input);
  const recommendation = recommendationEmphasis(input);
  const settle = aiSuggestionSettle(input);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 74% 24%, rgba(124,58,237,0.18), transparent 32%), radial-gradient(circle at 18% 76%, rgba(37,99,235,0.18), transparent 30%), linear-gradient(135deg, #F8FAFC 0%, #F1F5FF 52%, #F7F1E8 100%)",
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
            "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          transform: backdrop.transform,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: settle.transform, opacity: settle.opacity }}>
        <div style={{ position: "absolute", left: 72, top: 62 }}>
          <div style={{ color: "#7C3AED", fontSize: 13, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
            Shot 28 / AI Recommendation Candidate
          </div>
          <h1 style={{ margin: 0, color: "#0F172A", fontSize: 42, lineHeight: 1, letterSpacing: "-0.055em", fontWeight: 900, maxWidth: 590 }}>
            Turn context into visible recommendations.
          </h1>
        </div>
        <div style={{ position: "absolute", left: 96, top: 220, width: 342, height: 230, borderRadius: 26, background: "rgba(255,255,255,.92)", border: "1px solid rgba(15,23,42,.10)", boxShadow: "0 24px 70px rgba(30,41,59,.14)", padding: 24, ...context }}>
          <div style={{ color: "#2563EB", fontSize: 13, fontWeight: 900, textTransform: "uppercase", marginBottom: 20 }}>Context</div>
          {[0, 1, 2, 3].map((item) => (
            <div key={item} style={{ height: 16, width: `${80 - item * 10}%`, borderRadius: 99, background: "#CBD5E1", marginBottom: 18 }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 430, top: 334, width: 178, height: 4, borderRadius: 99, background: "linear-gradient(90deg, #2563EB, #7C3AED)", transformOrigin: "left", ...line }} />
        <div style={{ position: "absolute", left: 574, top: 190, display: "grid", gap: 18 }}>
          {suggestions.map((label, index) => {
            const bubble = suggestionBubbleFloat(input, index);
            return (
              <div key={label} style={{ width: 310, height: 72, borderRadius: 24, background: "rgba(255,255,255,.92)", border: "1px solid rgba(124,58,237,.16)", boxShadow: "0 18px 50px rgba(30,41,59,.12)", display: "flex", alignItems: "center", padding: "0 20px", ...bubble }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, background: ["#2563EB", "#7C3AED", "#0F766E"][index], marginRight: 16 }} />
                <strong style={{ color: "#0F172A", fontSize: 17 }}>{label}</strong>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 94, bottom: 74, width: 280, height: 88, borderRadius: 26, background: "rgba(124,58,237,.94)", color: "white", boxShadow: "0 24px 70px rgba(124,58,237,.24)", display: "grid", placeItems: "center", fontSize: 20, fontWeight: 900, ...recommendation }}>
          Recommended next step
        </div>
      </div>
    </AbsoluteFill>
  );
};

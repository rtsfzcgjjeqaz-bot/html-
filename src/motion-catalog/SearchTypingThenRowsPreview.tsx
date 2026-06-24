import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  queryTypeReveal,
  resultRowsReveal,
  searchBackdropDrift,
  searchBarReveal,
  searchFocusSettle,
  submitPulse,
} from "../motion/atomic/searchTypingThenRows";

const resultLabels = ["Best matching page", "Pricing insight", "Setup guide", "Customer proof"];

export const SearchTypingThenRowsPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const backdrop = searchBackdropDrift(input);
  const settle = searchFocusSettle(input);
  const bar = searchBarReveal(input);
  const query = queryTypeReveal(input);
  const submit = submitPulse(input);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 68% 28%, rgba(37,99,235,0.28), transparent 34%), radial-gradient(circle at 28% 78%, rgba(20,184,166,0.18), transparent 32%), linear-gradient(135deg, #EEF4FF 0%, #F8FAFC 52%, #F7F1E8 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -80,
          opacity: 0.28,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          transform: backdrop.transform,
        }}
      />

      <div style={{ position: "absolute", inset: 0, transform: settle.transform, opacity: settle.opacity }}>
        <div style={{ position: "absolute", left: 110, top: 96, width: 740 }}>
          <div
            style={{
              color: "#1D4ED8",
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Shot 25 / Search Demo Candidate
          </div>
          <h1
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: 43,
              lineHeight: 1,
              letterSpacing: "-0.055em",
              fontWeight: 900,
              maxWidth: 520,
            }}
          >
            Search starts the product story.
          </h1>
        </div>

        <div
          style={{
            position: "absolute",
            left: 154,
            top: 236,
            width: 652,
            height: 72,
            borderRadius: 999,
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(15,23,42,0.10)",
            boxShadow: "0 30px 90px rgba(30,41,59,0.16)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            ...bar,
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: 99, border: "3px solid #2563EB", marginRight: 18 }} />
          <div style={{ color: "#0F172A", fontSize: 24, fontWeight: 800, minWidth: 315, ...query }}>
            find a better workflow
          </div>
          <div
            style={{
              marginLeft: "auto",
              width: 112,
              height: 46,
              borderRadius: 999,
              background: "#2563EB",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              fontSize: 15,
              ...submit,
            }}
          >
            SEARCH
          </div>
        </div>

        <div style={{ position: "absolute", left: 210, top: 340, width: 540 }}>
          {resultLabels.map((label, index) => {
            const row = resultRowsReveal(input, index);
            return (
              <div
                key={label}
                style={{
                  height: 54,
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(15,23,42,0.08)",
                  boxShadow: "0 14px 34px rgba(30,41,59,0.10)",
                  display: "grid",
                  gridTemplateColumns: "42px 1fr 84px",
                  alignItems: "center",
                  padding: "0 16px",
                  marginBottom: 12,
                  ...row,
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: 8, background: ["#2563EB", "#0F766E", "#B45309", "#7C3AED"][index] }} />
                <strong style={{ color: "#0F172A", fontSize: 15 }}>{label}</strong>
                <span style={{ height: 8, borderRadius: 99, background: "#CBD5E1" }} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

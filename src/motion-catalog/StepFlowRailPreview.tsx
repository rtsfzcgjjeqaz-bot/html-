import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  activeStepFocus,
  processLineDraw,
  progressMeterReveal,
  stepBackdropDrift,
  stepCardsCascade,
  stepFlowSettle,
  toolIconLift,
} from "../motion/atomic/stepFlowRail";

const steps = ["Request", "Plan", "Build", "Review"];

export const StepFlowRailPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const backdrop = stepBackdropDrift(input);
  const rail = processLineDraw(input);
  const focus = activeStepFocus(input);
  const tool = toolIconLift(input);
  const progress = progressMeterReveal(input);
  const settle = stepFlowSettle(input);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 20%, rgba(99,102,241,0.16), transparent 32%), radial-gradient(circle at 82% 78%, rgba(20,184,166,0.16), transparent 30%), linear-gradient(135deg, #F8FAFC 0%, #F4F7FF 52%, #F6F3EA 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -80,
          opacity: 0.16,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.10) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          transform: backdrop.transform,
        }}
      />
      <div style={{ position: "absolute", inset: 0, opacity: settle.opacity, transform: settle.transform }}>
        <div style={{ position: "absolute", left: 72, top: 60 }}>
          <div style={{ color: "#4F46E5", fontSize: 13, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
            Shot 03 / Step Flow Candidate
          </div>
          <h1 style={{ margin: 0, color: "#0F172A", fontSize: 42, lineHeight: 1, letterSpacing: "-0.055em", fontWeight: 900, maxWidth: 590 }}>
            Turn a process into a guided sequence.
          </h1>
        </div>

        <div style={{ position: "absolute", left: 116, top: 290, width: 650, height: 4, borderRadius: 99, background: "linear-gradient(90deg, #4F46E5, #14B8A6)", transformOrigin: "left", ...rail }} />

        <div style={{ position: "absolute", left: 96, top: 228, display: "grid", gridTemplateColumns: "repeat(4, 148px)", gap: 28 }}>
          {steps.map((step, index) => {
            const card = stepCardsCascade(input, index);
            const isActive = index === 2;
            return (
              <div key={step} style={{ position: "relative" }}>
                <div
                  style={{
                    width: 148,
                    height: 118,
                    borderRadius: 26,
                    background: "rgba(255,255,255,.94)",
                    border: isActive ? "1px solid rgba(79,70,229,.28)" : "1px solid rgba(15,23,42,.09)",
                    boxShadow: isActive ? "0 22px 62px rgba(79,70,229,.18)" : "0 18px 42px rgba(30,41,59,.10)",
                    display: "grid",
                    placeItems: "center",
                    ...card,
                    ...(isActive ? focus : {}),
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 13, background: ["#94A3B8", "#2563EB", "#4F46E5", "#0F766E"][index], margin: "0 auto 14px" }} />
                    <strong style={{ color: "#0F172A", fontSize: 17 }}>{step}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 560,
            top: 382,
            width: 150,
            height: 118,
            borderRadius: 30,
            background: "rgba(79,70,229,.94)",
            boxShadow: "0 28px 74px rgba(79,70,229,.24)",
            color: "white",
            display: "grid",
            placeItems: "center",
            ...tool,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 42, height: 34, borderRadius: 14, background: "rgba(255,255,255,.24)", margin: "0 auto 12px" }} />
            <strong style={{ fontSize: 17 }}>Auto route</strong>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 86,
            bottom: 70,
            width: 252,
            height: 132,
            borderRadius: 30,
            background: "rgba(255,255,255,.94)",
            border: "1px solid rgba(15,118,110,.16)",
            boxShadow: "0 24px 68px rgba(30,41,59,.14)",
            padding: 22,
            ...progress,
          }}
        >
          <div style={{ color: "#0F766E", fontSize: 13, fontWeight: 900, textTransform: "uppercase", marginBottom: 18 }}>Flow readiness</div>
          <div style={{ height: 14, borderRadius: 999, background: "#D1FAE5", overflow: "hidden" }}>
            <div style={{ width: "78%", height: "100%", borderRadius: 999, background: "#0F766E" }} />
          </div>
          <strong style={{ display: "block", color: "#0F172A", fontSize: 24, marginTop: 14 }}>78% aligned</strong>
        </div>
      </div>
    </AbsoluteFill>
  );
};

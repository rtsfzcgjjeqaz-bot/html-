import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  browserContentWipe,
  ctaSpotlightPulse,
  heroDeskBackdropDrift,
  heroHoldSettle,
  laptopFrameRise,
  titlePillReveal,
} from "../motion/atomic/websiteHeroCenterStage";

export const WebsiteHeroCenterStagePreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const backdrop = heroDeskBackdropDrift(input);
  const laptop = laptopFrameRise(input);
  const content = browserContentWipe(input);
  const pill = titlePillReveal(input);
  const cta = ctaSpotlightPulse(input);
  const settle = heroHoldSettle(input);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 28%, rgba(251,207,232,0.38), transparent 30%), radial-gradient(circle at 80% 28%, rgba(191,219,254,0.30), transparent 34%), linear-gradient(135deg, #FBF7F2 0%, #F8FAFC 55%, #EEF7FF 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif',
      }}
    >
      <div style={{ position: "absolute", inset: -70, transform: backdrop.transform }}>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 42, height: 118, borderRadius: "50%", background: "rgba(148,163,184,.16)", filter: "blur(18px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: "linear-gradient(rgba(15,23,42,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.10) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: settle.opacity, transform: settle.transform }}>
        <div style={{ position: "absolute", left: 70, top: 58, ...pill }}>
          <div style={{ color: "#2563EB", fontSize: 13, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
            Shot 37 / Website Hero Candidate
          </div>
          <h1 style={{ margin: 0, color: "#0F172A", fontSize: 40, lineHeight: 1, letterSpacing: "-0.055em", fontWeight: 900, maxWidth: 520 }}>
            Center the website, then reveal the value.
          </h1>
        </div>

        <div
          style={{
            position: "absolute",
            left: 190,
            top: 168,
            width: 580,
            height: 330,
            borderRadius: 22,
            background: "#111827",
            boxShadow: "0 34px 90px rgba(30,41,59,.22)",
            padding: 12,
            ...laptop,
          }}
        >
          <div style={{ height: 288, borderRadius: 14, background: "rgba(255,255,255,.98)", overflow: "hidden" }}>
            <div style={{ height: 34, display: "flex", alignItems: "center", gap: 6, padding: "0 14px", borderBottom: "1px solid rgba(15,23,42,.08)" }}>
              {["#FB7185", "#FDBA74", "#34D399"].map((color) => <span key={color} style={{ width: 8, height: 8, borderRadius: 999, background: color }} />)}
              <span style={{ marginLeft: 12, width: 170, height: 9, borderRadius: 999, background: "#E2E8F0" }} />
            </div>
            <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, transformOrigin: "top", ...content }}>
              <div>
                <div style={{ width: 210, height: 24, borderRadius: 10, background: "#0F172A", marginBottom: 12 }} />
                <div style={{ width: 178, height: 24, borderRadius: 10, background: "#334155", marginBottom: 18 }} />
                <div style={{ width: 225, height: 9, borderRadius: 99, background: "#CBD5E1", marginBottom: 10 }} />
                <div style={{ width: 176, height: 9, borderRadius: 99, background: "#E2E8F0", marginBottom: 22 }} />
                <div style={{ width: 116, height: 36, borderRadius: 13, background: "#2563EB" }} />
              </div>
              <div style={{ height: 176, borderRadius: 24, background: "linear-gradient(135deg, #93C5FD, #C4B5FD 52%, #F9A8D4)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.35)" }} />
            </div>
          </div>
          <div style={{ width: 640, height: 28, borderRadius: "0 0 34px 34px", background: "#CBD5E1", marginLeft: -30, marginTop: 0 }} />
        </div>

        <div
          style={{
            position: "absolute",
            right: 92,
            bottom: 74,
            width: 246,
            height: 82,
            borderRadius: 999,
            background: "rgba(37,99,235,.94)",
            color: "white",
            boxShadow: "0 24px 66px rgba(37,99,235,.24)",
            display: "grid",
            placeItems: "center",
            fontSize: 20,
            fontWeight: 900,
            ...cta,
          }}
        >
          Clear next step
        </div>
      </div>
    </AbsoluteFill>
  );
};

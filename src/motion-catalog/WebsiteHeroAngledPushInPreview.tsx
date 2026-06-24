import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  backgroundParallax,
  cameraPushIn,
  featureCardReveal,
  highlightBoxReveal,
  softSettle,
  titleReveal,
  websiteTiltIn,
} from "../motion/atomic/websiteHeroAngledPushIn";

const rows = ["Hero messaging", "Feature proof", "Conversion area", "Customer signal"];
const cards = [
  { label: "Fast setup", value: "3 steps" },
  { label: "Clear proof", value: "Live data" },
  { label: "Ready CTA", value: "Launch" },
];

export const WebsiteHeroAngledPushInPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const camera = cameraPushIn(input);
  const settle = softSettle(input);
  const bg = backgroundParallax(input);
  const site = websiteTiltIn(input);
  const title = titleReveal(input);
  const highlight = highlightBoxReveal(input);
  const scanX = interpolate(frame, [0, durationInFrames], [-20, 110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 72% 18%, rgba(39,113,255,0.20), transparent 28%), radial-gradient(circle at 14% 82%, rgba(20,184,166,0.14), transparent 30%), linear-gradient(135deg, #F7FAFF 0%, #EEF4FF 52%, #F8F4EA 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -80,
          opacity: bg.opacity,
          transform: bg.transform,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.13) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />

      <div style={{ position: "absolute", inset: 0, transform: `${camera.transform} ${settle.transform}` }}>
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 122,
            width: 332,
            ...title,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              borderRadius: 999,
              padding: "8px 12px",
              background: "rgba(37,99,235,0.11)",
              color: "#1D4ED8",
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 16,
            }}
          >
            WEBSITE HERO
          </div>
          <h1
            style={{
              margin: 0,
              color: "#0F172A",
              fontSize: 42,
              lineHeight: 0.97,
              letterSpacing: "-0.055em",
              fontWeight: 900,
            }}
          >
            Show the page. Reveal the value.
          </h1>
          <p style={{ margin: "16px 0 0", color: "#526173", fontSize: 16, lineHeight: 1.35, fontWeight: 650 }}>
            Generic browser, safe title bounds, semantic highlight, and value cards.
          </p>
        </div>

        <div
          style={{
            position: "absolute",
            right: 70,
            top: 92,
            width: 540,
            height: 330,
            borderRadius: 20,
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(15,23,42,0.10)",
            boxShadow: "0 30px 80px rgba(30,41,59,0.18)",
            overflow: "hidden",
            transformStyle: "preserve-3d",
            ...site,
          }}
        >
          <div
            style={{
              height: 36,
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "0 15px",
              borderBottom: "1px solid rgba(15,23,42,0.08)",
              background: "#FFFFFF",
            }}
          >
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: ["#F97316", "#FACC15", "#22C55E"][dot],
                }}
              />
            ))}
            <span style={{ marginLeft: 10, width: 190, height: 14, borderRadius: 99, background: "#EEF2F7" }} />
          </div>
          <div style={{ position: "relative", height: 294, padding: 22 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${scanX}%`,
                width: 70,
                background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.12), transparent)",
                transform: "skewX(-12deg)",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 0.9fr",
                gap: 18,
                height: "100%",
              }}
            >
              <div
                style={{
                  borderRadius: 16,
                  padding: 18,
                  background: "linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 68%, #ECFDF5 100%)",
                  border: "1px solid rgba(37,99,235,0.10)",
                }}
              >
                <div style={{ width: 68, height: 13, borderRadius: 99, background: "#DBEAFE", marginBottom: 17 }} />
                <div style={{ width: 206, height: 24, borderRadius: 8, background: "#111827", marginBottom: 8 }} />
                <div style={{ width: 164, height: 24, borderRadius: 8, background: "#334155", marginBottom: 17 }} />
                <div style={{ width: 220, height: 8, borderRadius: 99, background: "#CBD5E1", marginBottom: 8 }} />
                <div style={{ width: 172, height: 8, borderRadius: 99, background: "#CBD5E1", marginBottom: 20 }} />
                <div
                  style={{
                    width: 126,
                    height: 38,
                    borderRadius: 12,
                    background: "#2563EB",
                    boxShadow: "0 12px 28px rgba(37,99,235,0.24)",
                  }}
                />
              </div>
              <div>
                {rows.map((row, index) => (
                  <div
                    key={row}
                    style={{
                      height: 48,
                      borderRadius: 12,
                      background: "#FFFFFF",
                      border: "1px solid rgba(15,23,42,0.08)",
                      boxShadow: "0 8px 20px rgba(30,41,59,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 13px",
                      marginBottom: 10,
                    }}
                  >
                    <strong style={{ color: "#0F172A", fontSize: 11 }}>{row}</strong>
                    <span style={{ width: 38 + index * 8, height: 7, borderRadius: 99, background: "#CBD5E1" }} />
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: 42,
                top: 124,
                width: 164,
                height: 72,
                borderRadius: 16,
                border: "2px solid rgba(37,99,235,0.78)",
                boxShadow: "0 0 0 7px rgba(37,99,235,0.10)",
                ...highlight,
              }}
            />
          </div>
        </div>

        {cards.map((card, index) => (
          <div
            key={card.label}
            style={{
              position: "absolute",
              left: 525 + index * 132,
              top: 402 - index * 10,
              width: 118,
              height: 82,
              borderRadius: 16,
              background: "rgba(255,255,255,0.90)",
              border: "1px solid rgba(15,23,42,0.10)",
              boxShadow: "0 18px 44px rgba(30,41,59,0.13)",
              padding: 13,
              ...featureCardReveal(input, index),
            }}
          >
            <div style={{ width: 24, height: 24, borderRadius: 8, background: ["#2563EB", "#0F766E", "#B45309"][index] }} />
            <strong style={{ display: "block", marginTop: 8, color: "#0F172A", fontSize: 12 }}>{card.label}</strong>
            <span style={{ color: "#64748B", fontSize: 10, fontWeight: 800 }}>{card.value}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 44,
          right: 44,
          bottom: 24,
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(15,23,42,0.44)",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.13em",
        }}
      >
        <span>SHOT 26 / websiteHeroAngledPushIn</span>
        <span>approved: false / allowedInFactory: false</span>
      </div>
    </AbsoluteFill>
  );
};

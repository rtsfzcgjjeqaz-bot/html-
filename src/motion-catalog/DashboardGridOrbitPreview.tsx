import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import {
  calloutPinsPop,
  columnHighlightSweep,
  dashboardFrameOrbit,
  dashboardSettle,
  gridBackdropParallax,
  gridCellsCascade,
} from "../motion/atomic/dashboardGridOrbit";

const columns = ["Intake", "Plan", "Build", "Review"];

export const DashboardGridOrbitPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const backdrop = gridBackdropParallax(input);
  const dashboard = dashboardFrameOrbit(input);
  const highlight = columnHighlightSweep(input);
  const settle = dashboardSettle(input);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 74% 24%, rgba(37,99,235,0.22), transparent 32%), radial-gradient(circle at 18% 76%, rgba(20,184,166,0.16), transparent 30%), linear-gradient(135deg, #F8FAFC 0%, #EEF6FF 52%, #F7F1E8 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Segoe UI Variable Display", "Noto Sans SC", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -90,
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          transform: backdrop.transform,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: settle.transform, opacity: settle.opacity }}>
        <div style={{ position: "absolute", left: 78, top: 62 }}>
          <div style={{ color: "#2563EB", fontSize: 13, fontWeight: 900, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
            Shot 15 / App Grid Candidate
          </div>
          <h1 style={{ margin: 0, color: "#0F172A", fontSize: 42, lineHeight: 1, letterSpacing: "-0.055em", fontWeight: 900, maxWidth: 580 }}>
            Scan a dashboard without losing the story.
          </h1>
        </div>
        <div
          style={{
            position: "absolute",
            left: 126,
            top: 188,
            width: 708,
            height: 302,
            borderRadius: 28,
            background: "rgba(255,255,255,0.94)",
            border: "1px solid rgba(15,23,42,0.10)",
            boxShadow: "0 34px 96px rgba(30,41,59,0.16)",
            padding: 24,
            transformStyle: "preserve-3d",
            ...dashboard,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
            {columns.map((column) => (
              <div key={column} style={{ color: "#1D4ED8", fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>{column}</div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 198,
              top: 56,
              width: 145,
              height: 220,
              borderRadius: 18,
              background: "rgba(37,99,235,.08)",
              border: "1px solid rgba(37,99,235,.20)",
              ...highlight,
            }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, position: "relative" }}>
            {Array.from({ length: 16 }).map((_, index) => {
              const cell = gridCellsCascade(input, index);
              return (
                <div
                  key={index}
                  style={{
                    height: 47,
                    borderRadius: 14,
                    background: index % 5 === 0 ? "rgba(15,118,110,.10)" : "rgba(248,250,252,.95)",
                    border: "1px solid rgba(15,23,42,.08)",
                    padding: "10px 12px",
                    ...cell,
                  }}
                >
                  <div style={{ height: 7, width: `${44 + (index % 4) * 12}%`, borderRadius: 99, background: "#CBD5E1", marginBottom: 8 }} />
                  <div style={{ height: 7, width: `${32 + (index % 3) * 10}%`, borderRadius: 99, background: index % 5 === 0 ? "#0F766E" : "#E2E8F0" }} />
                </div>
              );
            })}
          </div>
        </div>
        {["Workflow", "Risk", "Owner"].map((label, index) => {
          const pin = calloutPinsPop(input, index);
          return (
            <div
              key={label}
              style={{
                position: "absolute",
                left: [716, 672, 806][index],
                top: [238, 342, 420][index],
                width: 112,
                height: 42,
                borderRadius: 999,
                background: "rgba(255,255,255,.92)",
                border: "1px solid rgba(37,99,235,.18)",
                boxShadow: "0 14px 34px rgba(30,41,59,.12)",
                display: "grid",
                placeItems: "center",
                color: "#2563EB",
                fontWeight: 900,
                fontSize: 13,
                ...pin,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

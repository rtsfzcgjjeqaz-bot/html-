import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { shot138Ease } from "../shot_138/shot138-atomic-motions";

export const SHOT_138_DURATION_FRAMES = 74;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

type BuilderRow = {
  label: string;
  value: string;
};

type Props = {
  title?: string;
  rows?: BuilderRow[];
  sideCards?: string[];
};

export const Shot138AgentBuilderPanelFocusChoreography: React.FC<Props> = ({
  title = "My Agent",
  rows = [
    { label: "Trigger", value: "New request" },
    { label: "Action", value: "Analyze context" },
    { label: "Output", value: "Create response" },
  ],
  sideCards = ["Knowledge", "Tools", "Rules"],
}) => {
  const frame = useCurrentFrame();
  const camera = shot138Ease({ frame, startFrame: 0, endFrame: 74 });
  const shell = shot138Ease({ frame, startFrame: 0, endFrame: 22 });
  const nav = shot138Ease({ frame, startFrame: 10, endFrame: 32 });
  const selected = shot138Ease({ frame, startFrame: 28, endFrame: 56 });
  const settle = shot138Ease({ frame, startFrame: 58, endFrame: 74 });

  return (
    <AbsoluteFill
      style={{
        background: "#f7faff",
        overflow: "hidden",
        color: "#111827",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 62% 44%, rgba(34,110,234,0.14), transparent 28%), radial-gradient(circle at 34% 76%, rgba(54,197,232,0.11), transparent 25%), linear-gradient(180deg,#ffffff 0%,#eef5ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 178,
          top: 108,
          width: 924,
          height: 504,
          borderRadius: 34,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(34,110,234,0.14)",
          boxShadow: "0 42px 130px rgba(42,73,128,0.14)",
          opacity: shell,
          transform: `translateY(${interpolate(shell, [0, 1], [42, 0], clamp)}px) scale(${interpolate(camera, [0, 1], [0.965, 1.018], clamp)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 28,
            width: 198,
            bottom: 28,
            borderRadius: 26,
            background: "linear-gradient(180deg,#f4f8ff,#ffffff)",
            border: "1px solid rgba(34,110,234,0.10)",
            opacity: nav,
          }}
        >
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                position: "absolute",
                left: 24,
                top: 42 + item * 62,
                width: item === 1 ? 138 : 108,
                height: 14,
                borderRadius: 999,
                background: item === 1 ? "#226eea" : "rgba(17,24,39,0.12)",
                opacity: interpolate(nav, [0, 1], [0.2, 1], clamp),
              }}
            />
          ))}
        </div>

        <div style={{ position: "absolute", left: 258, top: 42, fontSize: 28, fontWeight: 880 }}>
          {title}
        </div>
        <div style={{ position: "absolute", left: 258, top: 92, width: 438, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.10)" }} />

        {rows.slice(0, 3).map((row, index) => {
          const rowIn = shot138Ease({ frame, startFrame: 14 + index * 8, endFrame: 36 + index * 8 });
          const isSelected = index === 1;
          return (
            <div
              key={`${row.label}-${index}`}
              style={{
                position: "absolute",
                left: 258,
                top: 142 + index * 88,
                width: 416,
                height: 62,
                borderRadius: 20,
                background: isSelected ? "rgba(34,110,234,0.10)" : "#ffffff",
                border: isSelected ? "1px solid rgba(34,110,234,0.40)" : "1px solid rgba(17,24,39,0.08)",
                boxShadow: isSelected ? "0 22px 56px rgba(34,110,234,0.18)" : "0 12px 34px rgba(42,73,128,0.08)",
                opacity: rowIn,
                transform: `translateX(${interpolate(rowIn, [0, 1], [34, 0], clamp)}px) scale(${isSelected ? interpolate(selected, [0, 0.6, 1], [1, 1.04, 1.02], clamp) : 1})`,
              }}
            >
              <div style={{ position: "absolute", left: 22, top: 13, fontSize: 13, fontWeight: 780, color: "#5b6472" }}>
                {row.label}
              </div>
              <div style={{ position: "absolute", left: 22, top: 33, fontSize: 17, fontWeight: 850, color: isSelected ? "#226eea" : "#111827" }}>
                {row.value}
              </div>
              {isSelected ? (
                <div
                  style={{
                    position: "absolute",
                    right: 18,
                    top: 18,
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: "#226eea",
                    boxShadow: `0 0 ${interpolate(selected, [0, 1], [0, 26], clamp)}px rgba(34,110,234,0.36)`,
                  }}
                />
              ) : null}
            </div>
          );
        })}

        {sideCards.slice(0, 3).map((card, index) => {
          const cardIn = shot138Ease({ frame, startFrame: 34 + index * 7, endFrame: 56 + index * 7 });
          return (
            <div
              key={card}
              style={{
                position: "absolute",
                right: 42,
                top: 130 + index * 92,
                width: 226,
                height: 72,
                borderRadius: 22,
                background: "#ffffff",
                border: "1px solid rgba(34,110,234,0.12)",
                boxShadow: "0 20px 54px rgba(42,73,128,0.10)",
                opacity: cardIn,
                transform: `translateY(${interpolate(cardIn, [0, 1], [30, 0], clamp)}px) translateX(${interpolate(cardIn, [0, 1], [24, 0], clamp)}px)`,
              }}
            >
              <div style={{ position: "absolute", left: 20, top: 18, width: 38, height: 38, borderRadius: 14, background: index === 1 ? "#226eea" : "rgba(34,110,234,0.12)" }} />
              <div style={{ position: "absolute", left: 72, top: 20, fontSize: 16, fontWeight: 850 }}>{card}</div>
              <div style={{ position: "absolute", left: 72, top: 46, width: 92, height: 8, borderRadius: 999, background: "rgba(17,24,39,0.12)" }} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 464,
          right: 464,
          bottom: 80,
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(34,110,234,0), rgba(34,110,234,0.32), rgba(54,197,232,0))",
          opacity: interpolate(settle, [0, 1], [0.5, 0.34], clamp),
        }}
      />
    </AbsoluteFill>
  );
};


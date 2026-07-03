import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_114_DURATION_FRAMES = 78;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  phrase?: string;
  label?: string;
};

const actions = ["Grammar", "Search", "More"];
const ribbons = ["available am", "will be available", "availability", "make available"];
const lines = [
  "I am interested in visiting the workspace soon and I am available am",
  "The team can review the notes and apply the suggested edits",
  "Inline actions keep the document flow focused and easy to scan",
];

export const Shot114DocumentActionPanelRevealChoreography: React.FC<Props> = ({
  phrase = "available am",
  label = "Edit in context",
}) => {
  const frame = useCurrentFrame();
  const canvas = ease(frame, 0, 24);
  const selection = ease(frame, 12, 38);
  const popover = ease(frame, 24, 52);
  const cursor = ease(frame, 34, 58);
  const fan = ease(frame, 48, 78);
  const labelIn = ease(frame, 62, 78);

  return (
    <AbsoluteFill
      style={{
        background: "#f8fbff",
        overflow: "hidden",
        color: "#142033",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #ffffff 0%, #f2f7ff 58%, #edf9ff 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 70,
          width: 1090,
          height: 500,
          borderRadius: 30,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(125,155,190,0.18)",
          boxShadow: "0 36px 90px rgba(79,122,170,0.17)",
          opacity: interpolate(canvas, [0, 1], [0.42, 1], clamp),
          transformOrigin: "48% 52%",
          transform: `perspective(980px) rotateX(${interpolate(canvas, [0, 1], [48, 38], clamp)}deg) rotateZ(-10deg) translateX(${interpolate(canvas, [0, 1], [70, 0], clamp)}px) translateY(${interpolate(canvas, [0, 1], [-28, 0], clamp)}px) scale(${interpolate(canvas, [0, 1], [1.05, 1], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 48, top: 58, right: 48, height: 1, background: "rgba(40,70,110,0.08)" }} />
        {lines.map((line, index) => (
          <div
            key={line}
            style={{
              position: "absolute",
              left: 76,
              top: 86 + index * 66,
              color: "#28364a",
              fontSize: 25,
              fontWeight: 620,
              opacity: 0.72,
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 688,
            top: 80,
            width: interpolate(selection, [0, 1], [0, 184], clamp),
            height: 42,
            borderRadius: 12,
            background: "rgba(40,154,255,0.26)",
            boxShadow: "0 0 24px rgba(40,154,255,0.26)",
          }}
        />
        <div style={{ position: "absolute", left: 702, top: 91, fontSize: 25, fontWeight: 760, color: "#126fd6", opacity: interpolate(selection, [0, 1], [0.3, 1], clamp) }}>{phrase}</div>

        <div
          style={{
            position: "absolute",
            left: 520,
            top: 150,
            width: 386,
            height: 112,
            borderRadius: 22,
            background: "rgba(255,255,255,0.84)",
            border: "1px solid rgba(83,147,218,0.24)",
            boxShadow: "0 22px 60px rgba(67,118,175,0.20)",
            backdropFilter: "blur(18px)",
            opacity: popover,
            transform: `translateY(${interpolate(popover, [0, 1], [24, 0], clamp)}px) scale(${interpolate(popover, [0, 1], [0.92, 1], clamp)})`,
          }}
        >
          <div style={{ position: "absolute", left: 24, top: 20, fontSize: 16, fontWeight: 840, color: "#172033" }}>Grammar</div>
          <div style={{ position: "absolute", left: 24, top: 48, width: 188, height: 12, borderRadius: 999, background: "rgba(39,94,150,0.12)" }} />
          {actions.map((action, index) => {
            const active = action === "Search";
            return (
              <div
                key={action}
                style={{
                  position: "absolute",
                  left: 24 + index * 112,
                  bottom: 18,
                  width: 88,
                  height: 30,
                  borderRadius: 999,
                  background: active ? "#177ee8" : "#f2f7ff",
                  color: active ? "#fff" : "#51647c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 790,
                }}
              >
                {action}
              </div>
            );
          })}
        </div>

        {ribbons.map((copy, index) => {
          const p = ease(frame, 48 + index * 4, 70 + index * 4);
          return (
            <div
              key={copy}
              style={{
                position: "absolute",
                left: 650 + index * 14,
                top: 256 + index * 16,
                width: 230,
                height: 40,
                borderRadius: 999,
                background: index === 0 ? "#1598ff" : `rgba(39,171,255,${0.84 - index * 0.12})`,
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 820,
                display: "flex",
                alignItems: "center",
                paddingLeft: 24,
                opacity: p,
                boxShadow: "0 16px 36px rgba(23,126,232,0.26)",
                transformOrigin: "10% 50%",
                transform: `translateY(${interpolate(p, [0, 1], [30, 0], clamp)}px) rotate(${interpolate(p, [0, 1], [22, -18 - index * 8], clamp)}deg) scale(${interpolate(p, [0, 1], [0.82, 1], clamp)})`,
              }}
            >
              {copy}
            </div>
          );
        })}
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(cursor, [0, 1], [1030, 824], clamp),
          top: interpolate(cursor, [0, 1], [168, 244], clamp),
          width: 0,
          height: 0,
          opacity: cursor,
          borderLeft: "26px solid #1397ff",
          borderTop: "16px solid transparent",
          borderBottom: "16px solid transparent",
          transform: `rotate(${interpolate(cursor, [0, 1], [-24, -12], clamp)}deg)`,
          filter: "drop-shadow(0 12px 18px rgba(19,151,255,0.34))",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 86,
          bottom: 56,
          opacity: labelIn,
          transform: `translateY(${interpolate(labelIn, [0, 1], [18, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 42, lineHeight: 1.02, fontWeight: 860, letterSpacing: 0 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

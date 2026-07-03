import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_115_DURATION_FRAMES = 78;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  selectedText?: string;
  label?: string;
};

const options = [
  "available am",
  "will be available",
  "available on",
  "make myself available",
  "can discuss",
  "ready to schedule",
  "open to meet",
];

export const Shot115ThemeSwitchDocumentCardsChoreography: React.FC<Props> = ({
  selectedText = "am available",
  label = "Choose the best rewrite",
}) => {
  const frame = useCurrentFrame();
  const orbit = ease(frame, 0, 30);
  const spread = ease(frame, 12, 46);
  const cursor = ease(frame, 24, 54);
  const doc = ease(frame, 46, 70);
  const resolve = ease(frame, 58, 78);
  const labelIn = ease(frame, 64, 78);

  return (
    <AbsoluteFill
      style={{
        background: "#f7fbff",
        overflow: "hidden",
        color: "#172033",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 52% 28%, rgba(70,196,255,0.22), transparent 24%), linear-gradient(135deg, #ffffff 0%, #eef8ff 60%, #f8f5ff 100%)",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 260,
          top: 70,
          width: 730,
          height: 420,
          opacity: interpolate(doc, [0, 1], [1, 0.18], clamp),
          transform: `translateY(${interpolate(doc, [0, 1], [0, 50], clamp)}px) scale(${interpolate(doc, [0, 1], [1, 0.88], clamp)})`,
        }}
      >
        {options.map((copy, index) => {
          const p = ease(frame, index * 3, 30 + index * 3);
          const depth = interpolate(spread, [0, 1], [0, index * 14], clamp);
          const rotate = interpolate(orbit, [0, 1], [28, -34 + index * 10], clamp);
          return (
            <div
              key={copy}
              style={{
                position: "absolute",
                left: 240 + depth,
                top: 54 + index * 28,
                width: 312,
                height: 44,
                borderRadius: 999,
                background:
                  index < 4
                    ? `rgba(${30 + index * 12}, ${154 + index * 10}, 255, ${0.92 - index * 0.06})`
                    : `rgba(214, ${130 + index * 12}, 235, ${0.82 - index * 0.05})`,
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 820,
                display: "flex",
                alignItems: "center",
                paddingLeft: 28,
                opacity: p,
                transformOrigin: "18% 50%",
                transform: `perspective(800px) rotateX(${interpolate(spread, [0, 1], [6, 24], clamp)}deg) rotateZ(${rotate}deg) translateY(${interpolate(p, [0, 1], [42, 0], clamp)}px) scale(${interpolate(p, [0, 1], [0.82, 1], clamp)})`,
                boxShadow: "0 18px 44px rgba(34,132,220,0.22)",
              }}
            >
              {copy}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 92,
          top: 250,
          width: 1110,
          height: 300,
          borderRadius: 30,
          background: "rgba(255,255,255,0.86)",
          border: "1px solid rgba(125,155,190,0.18)",
          boxShadow: "0 36px 90px rgba(79,122,170,0.16)",
          opacity: doc,
          transform: `perspective(980px) rotateX(34deg) rotateZ(-6deg) translateY(${interpolate(doc, [0, 1], [70, 0], clamp)}px) scale(${interpolate(doc, [0, 1], [1.08, 1], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 82, top: 84, fontSize: 28, fontWeight: 630, color: "#28364a", whiteSpace: "nowrap" }}>
          I am interested in exploring the workspace and I am available on Wednesday.
        </div>
        <div style={{ position: "absolute", left: 616, top: 76, width: interpolate(resolve, [0, 1], [0, 176], clamp), height: 50, borderRadius: 14, background: "rgba(38,157,255,0.24)", boxShadow: "0 0 24px rgba(38,157,255,0.28)" }} />
        <div style={{ position: "absolute", left: 636, top: 87, fontSize: 28, fontWeight: 820, color: "#126fd6", opacity: resolve }}>{selectedText}</div>
        <div style={{ position: "absolute", left: 82, top: 150, width: 740, height: 12, borderRadius: 999, background: "rgba(39,94,150,0.10)" }} />
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(cursor, [0, 1], [990, 760], clamp),
          top: interpolate(cursor, [0, 1], [168, 270], clamp),
          width: 0,
          height: 0,
          opacity: cursor,
          borderLeft: "28px solid #1397ff",
          borderTop: "17px solid transparent",
          borderBottom: "17px solid transparent",
          transform: `rotate(${interpolate(cursor, [0, 1], [-28, -8], clamp)}deg)`,
          filter: "drop-shadow(0 12px 20px rgba(19,151,255,0.34))",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 82,
          bottom: 54,
          opacity: labelIn,
          transform: `translateY(${interpolate(labelIn, [0, 1], [18, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 40, lineHeight: 1.04, fontWeight: 860, letterSpacing: 0 }}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

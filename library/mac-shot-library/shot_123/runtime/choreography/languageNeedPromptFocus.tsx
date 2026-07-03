import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_123_DURATION_FRAMES = 66;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  headline?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  prompt?: string;
};

export const Shot123LanguageNeedPromptFocusChoreography: React.FC<Props> = ({
  headline = "Need to communicate clearly?",
  sourceLanguage = "Source",
  targetLanguage = "English",
  prompt = "Ask for a natural translation",
}) => {
  const frame = useCurrentFrame();
  const stage = ease(frame, 0, 18);
  const phone = ease(frame, 6, 34);
  const headlineIn = ease(frame, 12, 36);
  const toggle = ease(frame, 24, 48);
  const input = ease(frame, 34, 58);
  const settle = ease(frame, 52, 66);

  return (
    <AbsoluteFill
      style={{
        background: "#fbfcff",
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
            "linear-gradient(180deg, #ffffff 0%, #f5fbff 100%), radial-gradient(circle at 52% 68%, rgba(72, 167, 255, 0.14), transparent 24%)",
          opacity: stage,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 122,
          top: 82,
          width: 560,
          opacity: headlineIn,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [22, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 52, lineHeight: 1.04, fontWeight: 860, letterSpacing: 0 }}>
          {headline}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 492,
          top: 176,
          width: 316,
          height: 470,
          borderRadius: 42,
          background: "#111827",
          border: "8px solid #232936",
          boxShadow: "0 46px 100px rgba(59, 82, 112, 0.24)",
          opacity: phone,
          transformOrigin: "50% 100%",
          transform: `translateY(${interpolate(phone, [0, 1], [160, 0], clamp)}px) scale(${interpolate(phone, [0, 1], [0.9, 1], clamp)}) rotate(${interpolate(settle, [0, 1], [-1, 0], clamp)}deg)`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 14, borderRadius: 30, background: "#f8fbff" }}>
          <div style={{ position: "absolute", left: 28, top: 34, width: 210, height: 16, borderRadius: 999, background: "rgba(17,24,39,0.14)" }} />
          <div style={{ position: "absolute", left: 28, top: 72, width: 238, height: 62, borderRadius: 22, background: "#ffffff", boxShadow: "0 16px 36px rgba(31,42,68,0.10)" }}>
            <div style={{ position: "absolute", left: 18, top: 17, fontSize: 22, fontWeight: 760, color: "#111827", opacity: input }}>
              {prompt}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 26,
              top: 168,
              width: 244,
              height: 72,
              borderRadius: 26,
              background: "#edf6ff",
              border: "1px solid rgba(42, 126, 255, 0.16)",
              opacity: toggle,
              transform: `translateY(${interpolate(toggle, [0, 1], [24, 0], clamp)}px)`,
            }}
          >
            {[sourceLanguage, targetLanguage].map((label, index) => (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: 14 + index * 116,
                  top: 14,
                  width: 100,
                  height: 44,
                  borderRadius: 999,
                  background: index === 1 ? "#2f6bff" : "#ffffff",
                  color: index === 1 ? "#ffffff" : "#111827",
                  fontSize: 18,
                  fontWeight: 760,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: index === 1 ? "0 12px 26px rgba(47,107,255,0.28)" : "0 8px 18px rgba(31,42,68,0.08)",
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 26,
              top: 282,
              width: 244,
              height: 86,
              borderRadius: 28,
              background: "#ffffff",
              opacity: input,
              boxShadow: "0 22px 44px rgba(31,42,68,0.12)",
              transform: `scale(${interpolate(input, [0, 1], [0.96, 1], clamp)})`,
            }}
          >
            <div style={{ position: "absolute", left: 22, top: 20, width: 152, height: 14, borderRadius: 999, background: "rgba(17,24,39,0.18)" }} />
            <div style={{ position: "absolute", left: 22, top: 50, width: 96, height: 12, borderRadius: 999, background: "rgba(47,107,255,0.24)" }} />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 122,
          top: 214,
          width: 276,
          height: 138,
          borderRadius: 34,
          background: "#ffffff",
          boxShadow: "0 30px 70px rgba(34, 64, 104, 0.14)",
          opacity: input,
          transform: `translateX(${interpolate(input, [0, 1], [34, 0], clamp)}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 28, top: 28, width: 148, height: 15, borderRadius: 999, background: "#111827", opacity: 0.76 }} />
        <div style={{ position: "absolute", left: 28, top: 64, width: 210, height: 12, borderRadius: 999, background: "rgba(17,24,39,0.12)" }} />
        <div style={{ position: "absolute", left: 28, top: 92, width: 122, height: 12, borderRadius: 999, background: "rgba(47,107,255,0.22)" }} />
      </div>
    </AbsoluteFill>
  );
};

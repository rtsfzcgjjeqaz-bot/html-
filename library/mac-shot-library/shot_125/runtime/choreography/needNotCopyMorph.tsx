import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_125_DURATION_FRAMES = 63;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  headlineLead?: string;
  headlineAccent?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  message?: string;
};

export const Shot125NeedNotCopyMorphChoreography: React.FC<Props> = ({
  headlineLead = "AI can do",
  headlineAccent = "that",
  sourceLanguage = "Hindi",
  targetLanguage = "English",
  message = "Translate this naturally",
}) => {
  const frame = useCurrentFrame();
  const phone = ease(frame, 0, 20);
  const band = ease(frame, 10, 38);
  const bubble = ease(frame, 18, 46);
  const copy = ease(frame, 24, 52);
  const accent = ease(frame, 40, 60);
  const hold = ease(frame, 54, 63);

  return (
    <AbsoluteFill
      style={{
        background: "#f6fbf7",
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
            "linear-gradient(180deg, #fbfffc 0%, #eff8f2 100%), radial-gradient(circle at 76% 62%, rgba(132, 104, 255, 0.12), transparent 22%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(band, [0, 1], [-360, 0], clamp),
          top: 308,
          width: 1280,
          height: 92,
          background:
            "linear-gradient(90deg, rgba(137,184,238,0.58), rgba(226,205,232,0.66), rgba(141,187,242,0.36))",
          opacity: band * 0.9,
          transform: `translateX(${interpolate(hold, [0, 1], [0, 10], clamp)}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 354,
          top: -42,
          width: 572,
          height: 628,
          borderRadius: 68,
          background: "#0f1720",
          border: "10px solid #202833",
          boxShadow: "0 48px 110px rgba(37, 55, 75, 0.22)",
          opacity: phone,
          transform: `translateY(${interpolate(phone, [0, 1], [-120, 0], clamp)}px) scale(${interpolate(phone, [0, 1], [0.96, 1], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 16, borderRadius: 52, background: "#fbfcff" }}>
          <div style={{ position: "absolute", left: 36, top: 20, fontSize: 18, fontWeight: 760 }}>9:30</div>
          <div style={{ position: "absolute", right: 42, top: 20, fontSize: 16, fontWeight: 780 }}>5G</div>
          <div
            style={{
              position: "absolute",
              left: 154,
              top: 76,
              width: 262,
              height: 54,
              borderRadius: 999,
              background: "#f1edf9",
              boxShadow: "0 16px 30px rgba(88, 73, 135, 0.12)",
              opacity: phone,
            }}
          >
            <div style={{ position: "absolute", left: 24, top: 15, fontSize: 17, fontWeight: 720, color: "#4b5563" }}>
              {sourceLanguage}
            </div>
            <div
              style={{
                position: "absolute",
                right: 12,
                top: 8,
                width: 112,
                height: 38,
                borderRadius: 999,
                background: "#6451a8",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                fontWeight: 820,
              }}
            >
              {targetLanguage}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 124,
              top: 306,
              opacity: copy,
              transform: `translateY(${interpolate(copy, [0, 1], [18, 0], clamp)}px)`,
            }}
          >
            <div style={{ fontSize: 44, lineHeight: 1, fontWeight: 840, letterSpacing: 0 }}>
              {headlineLead}{" "}
              <span style={{ color: `rgba(100, 81, 168, ${interpolate(accent, [0, 1], [0.45, 1], clamp)})` }}>
                {headlineAccent}
              </span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 92,
              top: 386,
              width: 386,
              height: 72,
              opacity: bubble,
              transform: `translateY(${interpolate(bubble, [0, 1], [34, 0], clamp)}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 10,
                width: 52,
                height: 52,
                borderRadius: 999,
                background: "linear-gradient(135deg, #f2b36d, #9b5bda)",
                boxShadow: "0 12px 28px rgba(85, 65, 115, 0.18)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 72,
                top: 6,
                width: 298,
                height: 58,
                borderRadius: 24,
                background: "#ffffff",
                boxShadow: "0 18px 40px rgba(58, 70, 96, 0.14)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 26,
                fontSize: 18,
                fontWeight: 720,
                color: "#303846",
              }}
            >
              {message}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 116,
          bottom: 84,
          opacity: interpolate(copy, [0, 1], [1, 0], clamp),
          transform: `translateY(${interpolate(copy, [0, 1], [0, 26], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 42, lineHeight: 1.05, fontWeight: 820, letterSpacing: 0 }}>
          Need
        </div>
      </div>
    </AbsoluteFill>
  );
};

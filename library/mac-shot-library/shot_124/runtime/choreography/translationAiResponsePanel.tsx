import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_124_DURATION_FRAMES = 74;

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
  responseTitle?: string;
  responseLines?: string[];
};

export const Shot124TranslationAiResponsePanelChoreography: React.FC<Props> = ({
  headline = "Need to communicate... in Hindi?",
  sourceLanguage = "Hindi",
  targetLanguage = "English",
  responseTitle = "Suggested response",
  responseLines = ["Clear translation", "Natural tone", "Ready to send"],
}) => {
  const frame = useCurrentFrame();
  const phone = ease(frame, 0, 22);
  const headlineIn = ease(frame, 8, 34);
  const selector = ease(frame, 18, 44);
  const panel = ease(frame, 32, 58);
  const lines = ease(frame, 44, 70);
  const hold = ease(frame, 64, 74);

  return (
    <AbsoluteFill
      style={{
        background: "#f7fbf9",
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
            "radial-gradient(circle at 52% 72%, rgba(106, 91, 255, 0.12), transparent 22%), linear-gradient(180deg, #fbfffd 0%, #eef7f2 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 120,
          width: 620,
          opacity: headlineIn,
          transform: `translateY(${interpolate(headlineIn, [0, 1], [-18, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 42, lineHeight: 1.08, fontWeight: 840, letterSpacing: 0 }}>
          {headline}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 360,
          top: 214,
          width: 560,
          height: 590,
          borderRadius: 68,
          background: "#0f1720",
          border: "10px solid #202833",
          boxShadow: "0 48px 110px rgba(37, 55, 75, 0.22)",
          opacity: phone,
          transform: `translateY(${interpolate(phone, [0, 1], [140, 0], clamp)}px) scale(${interpolate(phone, [0, 1], [0.94, 1], clamp)})`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 16, borderRadius: 52, background: "#fbfcff" }}>
          <div style={{ position: "absolute", left: 36, top: 20, fontSize: 18, fontWeight: 760 }}>9:30</div>
          <div style={{ position: "absolute", right: 42, top: 20, fontSize: 16, fontWeight: 780 }}>5G</div>
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 82,
              width: 260,
              height: 54,
              borderRadius: 999,
              background: "#f1edf9",
              boxShadow: "0 16px 30px rgba(88, 73, 135, 0.12)",
              opacity: selector,
              transform: `translateY(${interpolate(selector, [0, 1], [18, 0], clamp)}px)`,
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
                boxShadow: "0 12px 24px rgba(100, 81, 168, 0.3)",
              }}
            >
              {targetLanguage}
            </div>
          </div>
          <div style={{ position: "absolute", left: 92, top: 166, width: 376, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.12)", opacity: selector }} />
          <div style={{ position: "absolute", left: 142, top: 194, width: 280, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.08)", opacity: selector }} />
          <div
            style={{
              position: "absolute",
              left: 74,
              top: 246,
              width: 412,
              height: 190,
              borderRadius: 34,
              background: "#ffffff",
              boxShadow: "0 30px 70px rgba(47, 64, 94, 0.16)",
              opacity: panel,
              transform: `translateY(${interpolate(panel, [0, 1], [44, 0], clamp)}) scale(${interpolate(panel, [0, 1], [0.97, 1], clamp)})`,
            }}
          >
            <div style={{ position: "absolute", left: 30, top: 26, fontSize: 24, fontWeight: 840, opacity: lines }}>
              {responseTitle}
            </div>
            {responseLines.slice(0, 3).map((line, index) => {
              const lineIn = ease(frame, 46 + index * 5, 62 + index * 5);
              return (
                <div
                  key={line}
                  style={{
                    position: "absolute",
                    left: 30,
                    top: 76 + index * 34,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    opacity: lineIn,
                    transform: `translateX(${interpolate(lineIn, [0, 1], [18, 0], clamp)}px)`,
                  }}
                >
                  <div style={{ width: 11, height: 11, borderRadius: 999, background: "#6451a8" }} />
                  <div style={{ fontSize: 20, fontWeight: 720, color: "#374151" }}>{line}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 154,
          width: 250,
          height: 96,
          borderRadius: 28,
          background: "#ffffff",
          boxShadow: "0 24px 60px rgba(48, 65, 93, 0.12)",
          opacity: panel,
          transform: `translateX(${interpolate(panel, [0, 1], [30, interpolate(hold, [0, 1], [0, -3], clamp)], clamp)}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 26, top: 26, width: 138, height: 12, borderRadius: 999, background: "rgba(17,24,39,0.18)" }} />
        <div style={{ position: "absolute", left: 26, top: 56, width: 184, height: 10, borderRadius: 999, background: "rgba(100,81,168,0.20)" }} />
      </div>
    </AbsoluteFill>
  );
};

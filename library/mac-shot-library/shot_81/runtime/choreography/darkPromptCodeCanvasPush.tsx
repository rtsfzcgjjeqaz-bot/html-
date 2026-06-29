import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_81_DURATION_FRAMES = 62;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const codeRows = [
  { indent: 0, width: 0.54, color: "#8bd3ff" },
  { indent: 24, width: 0.44, color: "#d7e3ff" },
  { indent: 48, width: 0.62, color: "#ffd6a3" },
  { indent: 48, width: 0.36, color: "#a8ffcb" },
  { indent: 24, width: 0.7, color: "#d7e3ff" },
  { indent: 48, width: 0.42, color: "#9d7dff" },
  { indent: 48, width: 0.58, color: "#d7e3ff" },
  { indent: 24, width: 0.48, color: "#ffd6a3" },
  { indent: 0, width: 0.34, color: "#8bd3ff" },
];

export const Shot81DarkPromptCodeCanvasPushChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const ambient = ease(frame, 0, 14);
  const headline = ease(frame, 6, 28);
  const canvas = ease(frame, 10, 36);
  const selection = ease(frame, 28, 50);
  const settle = ease(frame, 48, SHOT_81_DURATION_FRAMES);

  const cameraScale = interpolate(frame, [0, SHOT_81_DURATION_FRAMES], [0.982, 1.035], clamp);
  const editorScale = interpolate(canvas, [0, 1], [0.9, 1], clamp) * interpolate(settle, [0, 1], [1.018, 1], clamp);
  const editorX = interpolate(canvas, [0, 1], [-42, 0], clamp);
  const editorY = interpolate(canvas, [0, 1], [38, 0], clamp);
  const glowOpacity = ambient * interpolate(settle, [0, 1], [1, 0.76], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#01030a",
        color: "#f8fbff",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: ambient,
          transform: `scale(${cameraScale})`,
          background:
            "radial-gradient(circle at 50% 22%, rgba(105,119,255,0.42), transparent 25%), radial-gradient(circle at 28% 42%, rgba(50,102,226,0.28), transparent 34%), linear-gradient(180deg, #01030a 0%, #060b16 42%, #01030a 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width * 0.2,
          right: width * 0.2,
          top: 145,
          height: 110,
          opacity: glowOpacity,
          background: "linear-gradient(90deg, transparent, rgba(92,112,255,0.5), transparent)",
          filter: "blur(34px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 104,
          left: 0,
          width,
          textAlign: "center",
          opacity: headline,
          transform: `translateY(${interpolate(headline, [0, 1], [-8, 0], clamp)}px)`,
          fontSize: 21,
          fontWeight: 760,
          letterSpacing: 0,
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.96)" }}>into </span>
        <span
          style={{
            color: "#7d8cff",
            textShadow: "0 0 22px rgba(124,140,255,0.72)",
          }}
        >
          code
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 - 502 + editorX,
          top: height / 2 - 132 + editorY,
          width: 560,
          height: 372,
          opacity: canvas,
          transform: `perspective(900px) rotateX(12deg) rotateY(-18deg) rotateZ(-6deg) scale(${editorScale})`,
          transformOrigin: "45% 48%",
          borderRadius: 18,
          background: "linear-gradient(180deg, rgba(13,17,28,0.98), rgba(3,5,12,0.98))",
          border: "1px solid rgba(128,164,255,0.22)",
          boxShadow:
            "0 32px 100px rgba(0,0,0,0.7), 0 0 44px rgba(83,112,255,0.28), inset 0 1px 0 rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 36,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            paddingLeft: 18,
          }}
        >
          {["#ff6b7a", "#ffd166", "#45d483"].map((color) => (
            <div key={color} style={{ width: 9, height: 9, borderRadius: 99, background: color }} />
          ))}
          <div style={{ marginLeft: 18, color: "rgba(226,233,255,0.54)", fontSize: 10, fontWeight: 720 }}>
            app/page.tsx
          </div>
        </div>

        <div style={{ display: "flex", height: 336 }}>
          <div
            style={{
              width: 48,
              paddingTop: 23,
              color: "rgba(185,198,230,0.32)",
              fontSize: 10,
              fontWeight: 680,
              textAlign: "right",
              paddingRight: 12,
              borderRight: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} style={{ height: 20 }}>
                {index + 21}
              </div>
            ))}
          </div>

          <div style={{ position: "relative", flex: 1, padding: "24px 24px" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 58,
                top: 62,
                width: interpolate(selection, [0, 1], [120, 286], clamp),
                height: 66,
                opacity: selection,
                borderRadius: 7,
                background: "rgba(78, 113, 255, 0.46)",
                boxShadow: "0 0 28px rgba(78,113,255,0.52)",
              }}
            />
            {codeRows.map((row, index) => {
              const rowProgress = ease(frame, 18 + index * 2, 32 + index * 2);
              return (
                <div
                  key={`${row.indent}-${row.width}-${index}`}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    marginLeft: row.indent,
                    marginBottom: 15,
                    width: 420 * row.width,
                    height: 5,
                    borderRadius: 99,
                    opacity: rowProgress,
                    transform: `scaleX(${interpolate(rowProgress, [0, 1], [0.35, 1], clamp)})`,
                    transformOrigin: "left center",
                    background: row.color,
                    boxShadow: `0 0 14px ${row.color}44`,
                  }}
                />
              );
            })}

            <div
              style={{
                position: "absolute",
                left: 72,
                top: 112,
                opacity: selection,
                transform: `translateX(${interpolate(selection, [0, 1], [-14, 0], clamp)}px)`,
                color: "#eef3ff",
                fontSize: 11,
                fontWeight: 820,
              }}
            >
              const app = generate()
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width / 2 - 410,
          top: height / 2 + 214,
          width: 420,
          height: 70,
          opacity: canvas * 0.56,
          transform: "rotateZ(-5deg)",
          background: "rgba(73,99,255,0.38)",
          filter: "blur(34px)",
        }}
      />
    </AbsoluteFill>
  );
};

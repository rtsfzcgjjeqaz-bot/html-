import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_82_DURATION_FRAMES = 67;

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
  { top: 86, indent: 0, width: 178, color: "#8bd3ff" },
  { top: 111, indent: 18, width: 224, color: "#d7e3ff" },
  { top: 136, indent: 36, width: 154, color: "#ffd6a3" },
  { top: 161, indent: 36, width: 208, color: "#b69cff" },
  { top: 186, indent: 18, width: 190, color: "#d7e3ff" },
  { top: 211, indent: 0, width: 138, color: "#a8ffcb" },
];

const ToolbarToggle: React.FC<{ active: number; scale?: number }> = ({ active, scale = 1 }) => {
  const codeOpacity = interpolate(active, [0, 1], [1, 0.42], clamp);
  const previewFill = interpolate(active, [0, 1], [0.2, 1], clamp);

  return (
    <div
      style={{
        width: 214,
        height: 47,
        borderRadius: 24,
        padding: 4,
        background: "rgba(7,10,18,0.92)",
        border: "1px solid rgba(176,198,255,0.22)",
        boxShadow: `0 0 ${interpolate(active, [0, 1], [18, 42], clamp)}px rgba(95,122,255,${interpolate(active, [0, 1], [0.2, 0.62], clamp)})`,
        display: "flex",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          flex: 1,
          borderRadius: 20,
          display: "grid",
          placeItems: "center",
          color: `rgba(238,243,255,${codeOpacity})`,
          fontSize: 16,
          fontWeight: 760,
          background: `rgba(74,105,255,${interpolate(active, [0, 1], [0.72, 0.08], clamp)})`,
        }}
      >
        Code
      </div>
      <div
        style={{
          flex: 1.08,
          borderRadius: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          color: "#f7faff",
          fontSize: 16,
          fontWeight: 820,
          background: `linear-gradient(90deg, rgba(67,121,255,${0.24 + previewFill * 0.58}), rgba(153,93,255,${0.24 + previewFill * 0.6}))`,
        }}
      >
        <span style={{ opacity: active, fontSize: 18, lineHeight: 1 }}>✓</span>
        Preview
      </div>
    </div>
  );
};

export const Shot82CodePreviewToggleFocusChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const context = ease(frame, 0, 16);
  const toggle = ease(frame, 8, 24);
  const cursor = ease(frame, 18, 36);
  const active = ease(frame, 32, 46);
  const lens = ease(frame, 38, 58);
  const settle = ease(frame, 54, SHOT_82_DURATION_FRAMES);

  const cameraScale = interpolate(frame, [0, SHOT_82_DURATION_FRAMES], [1, 1.045], clamp);
  const cursorX = width / 2 + interpolate(cursor, [0, 1], [-24, 94], clamp);
  const cursorY = height / 2 + interpolate(cursor, [0, 1], [26, -52], clamp);
  const toggleScale = interpolate(active, [0, 1], [1, 1.04], clamp) * interpolate(settle, [0, 1], [1.025, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#01030a",
        overflow: "hidden",
        color: "#f8fbff",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: context,
          transform: `scale(${cameraScale})`,
          background:
            "radial-gradient(circle at 44% 70%, rgba(82,97,255,0.34), transparent 26%), radial-gradient(circle at 68% 34%, rgba(90,117,255,0.18), transparent 28%), linear-gradient(180deg, #02040a 0%, #050914 54%, #01030a 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - 612,
          top: height / 2 - 276,
          width: 930,
          height: 410,
          opacity: context,
          filter: `blur(${interpolate(context, [0, 1], [10, 0], clamp)}px)`,
          transform: `translateY(${interpolate(context, [0, 1], [10, 0], clamp)}px) perspective(1100px) rotateX(8deg) rotateY(-10deg) rotateZ(-2deg)`,
          borderRadius: 18,
          background: "linear-gradient(180deg, rgba(8,12,20,0.98), rgba(2,4,10,0.98))",
          border: "1px solid rgba(142,166,226,0.14)",
          boxShadow: "0 42px 120px rgba(0,0,0,0.72), 0 0 54px rgba(73,108,255,0.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 54,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 21,
            paddingRight: 40,
          }}
        >
          <div style={{ opacity: toggle, transform: `scale(${interpolate(toggle, [0, 1], [0.94, 1], clamp)})` }}>
            <ToolbarToggle active={active} scale={toggleScale} />
          </div>
          {["↻", "⤴", "×"].map((icon) => (
            <div key={icon} style={{ color: "rgba(235,240,255,0.58)", fontSize: 22, fontWeight: 760 }}>
              {icon}
            </div>
          ))}
        </div>

        <div style={{ position: "relative", height: 356 }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 78,
              height: "100%",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(185,198,230,0.26)",
              fontSize: 12,
              fontWeight: 680,
              textAlign: "right",
              paddingTop: 68,
              paddingRight: 18,
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} style={{ height: 25 }}>
                {index + 23}
              </div>
            ))}
          </div>
          {codeRows.map((row, index) => {
            const rowIn = ease(frame, 6 + index * 2, 18 + index * 2);
            return (
              <div
                key={`${row.top}-${row.width}`}
                style={{
                  position: "absolute",
                  left: 112 + row.indent,
                  top: row.top,
                  width: row.width,
                  height: 6,
                  borderRadius: 99,
                  opacity: rowIn * interpolate(active, [0, 1], [1, 0.42], clamp),
                  transform: `scaleX(${interpolate(rowIn, [0, 1], [0.32, 1], clamp)})`,
                  transformOrigin: "left center",
                  background: row.color,
                  boxShadow: `0 0 14px ${row.color}44`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width / 2 - 42,
          top: height / 2 - 136,
          width: 380,
          height: 380,
          opacity: lens,
          transform: `scale(${interpolate(lens, [0, 1], [0.72, 1], clamp)})`,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(89,116,255,0.18), rgba(111,84,255,0.13) 38%, transparent 68%)",
          boxShadow: "0 0 70px rgba(84,112,255,0.38)",
          border: "1px solid rgba(124,151,255,0.16)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 + 28,
          top: height / 2 - 14,
          opacity: lens,
          transform: `scale(${interpolate(lens, [0, 1], [0.82, 1], clamp)})`,
        }}
      >
        <ToolbarToggle active={active} scale={1.32} />
      </div>

      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          opacity: cursor,
          transform: `rotate(-9deg) scale(${interpolate(active, [0, 1], [1, 0.92], clamp)})`,
          color: "#f9fbff",
          fontSize: 52,
          lineHeight: 1,
          textShadow: "0 3px 12px rgba(0,0,0,0.7), 0 0 18px rgba(112,138,255,0.54)",
        }}
      >
        ▸
      </div>
    </AbsoluteFill>
  );
};

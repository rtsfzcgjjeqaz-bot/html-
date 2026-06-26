import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_46_DURATION_FRAMES = 67;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const nodes = [
  { x: -275, y: -92, delay: 28 },
  { x: -212, y: 92, delay: 33 },
  { x: 238, y: -88, delay: 38 },
  { x: 306, y: 94, delay: 43 },
  { x: 0, y: -148, delay: 48 },
];

const rails = [
  { x: -245, y: -66, width: 210, rotate: -9, delay: 18 },
  { x: -230, y: 74, width: 196, rotate: 8, delay: 22 },
  { x: 84, y: -58, width: 218, rotate: 8, delay: 26 },
  { x: 96, y: 70, width: 230, rotate: -7, delay: 30 },
];

export const Shot46DarkProductEngineCoverChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const stage = interpolate(frame, [0, 18], [0, 1], clamp);
  const core = interpolate(frame, [8, 34], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const camera = interpolate(frame, [0, SHOT_46_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#060913",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: stage,
          background:
            "radial-gradient(circle at 50% 52%, rgba(88,91,255,0.25), transparent 28%), radial-gradient(circle at 42% 36%, rgba(20,184,166,0.14), transparent 26%), linear-gradient(180deg, #090d18, #03040a)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2,
          top: height / 2 + 18,
          width: 0,
          height: 0,
          transform: `translateY(${interpolate(camera, [0, 1], [8, 0], clamp)}px) scale(${interpolate(camera, [0, 1], [0.96, 1.02], clamp)})`,
          transformOrigin: "center",
        }}
      >
        {rails.map((rail) => {
          const reveal = interpolate(frame, [rail.delay, rail.delay + 22], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={`${rail.x}-${rail.y}`}
              style={{
                position: "absolute",
                left: rail.x,
                top: rail.y,
                width: rail.width,
                height: 12,
                opacity: interpolate(reveal, [0, 1], [0, 0.82], clamp),
                transform: `rotate(${rail.rotate}deg) scaleX(${reveal})`,
                transformOrigin: rail.x < 0 ? "right center" : "left center",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, rgba(120,132,255,0), rgba(120,132,255,0.62), rgba(62,220,196,0.28))",
                boxShadow: "0 0 24px rgba(100,111,255,0.2)",
              }}
            />
          );
        })}

        {nodes.map((node) => {
          const reveal = interpolate(frame, [node.delay, node.delay + 20], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          });
          return (
            <div
              key={`${node.x}-${node.y}`}
              style={{
                position: "absolute",
                left: node.x - 55,
                top: node.y - 22,
                width: 110,
                height: 44,
                opacity: interpolate(reveal, [0, 1], [0.18, 1], clamp),
                transform: `scale(${interpolate(reveal, [0, 1], [0.86, 1], clamp)})`,
                borderRadius: 18,
                background: "linear-gradient(180deg, rgba(23,28,48,0.94), rgba(10,14,28,0.94))",
                border: "1px solid rgba(160,170,255,0.14)",
                boxShadow: "0 16px 42px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  top: 14,
                  width: 58,
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.2)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 15,
                  top: 13,
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#62dcc4",
                  boxShadow: "0 0 18px rgba(98,220,196,0.56)",
                }}
              />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: -132,
            top: -47,
            width: 264,
            height: 94,
            opacity: core,
            transform: `translateY(${interpolate(core, [0, 1], [18, 0], clamp)}px) scale(${interpolate(core, [0, 1], [0.9, 1], clamp)})`,
            borderRadius: 42,
            background:
              "linear-gradient(135deg, rgba(136,147,255,0.96), rgba(91,109,245,0.88) 48%, rgba(64,230,202,0.82))",
            boxShadow: `0 28px 100px rgba(91,109,245,${interpolate(core, [0, 1], [0.08, 0.44], clamp)}), inset 0 1px 0 rgba(255,255,255,0.36)`,
            border: "1px solid rgba(255,255,255,0.24)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 22,
              width: 112,
              height: 12,
              borderRadius: 999,
              background: "rgba(255,255,255,0.44)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 46,
              width: 178,
              height: 18,
              borderRadius: 999,
              background: "rgba(255,255,255,0.24)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 28,
              top: 28,
              width: 34,
              height: 34,
              borderRadius: 12,
              background: "rgba(255,255,255,0.26)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

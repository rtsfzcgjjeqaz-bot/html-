import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_146_DURATION_FRAMES = 132;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const modulePositions = [
  { x: -344, y: -172, rotate: -8, scale: 0.92, accent: "#4dd5ff", title: "Discovery" },
  { x: 310, y: -182, rotate: 8, scale: 0.88, accent: "#ff6b5e", title: "Flow" },
  { x: -308, y: 158, rotate: 7, scale: 0.9, accent: "#7b8cff", title: "Signals" },
  { x: 276, y: 152, rotate: -7, scale: 0.9, accent: "#70f0b1", title: "Interface" },
];

type Props = {
  heroWord?: string;
  eyebrow?: string;
  modules?: string[];
};

export const Shot146DarkWordmarkOrbitHeroChoreography: React.FC<Props> = ({
  heroWord = "Atlas",
  eyebrow = "PREMIUM PRODUCT SYSTEM",
  modules = ["Discovery", "Flow", "Signals", "Interface"],
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const stageIn = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 110, mass: 0.95 },
  });
  const cameraPush = interpolate(frame, [0, SHOT_146_DURATION_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const wordIn = interpolate(frame, [12, 58], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cursorSweep = interpolate(frame, [48, 96], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.2, 0.9, 0.2, 1),
  });
  const hold = interpolate(frame, [96, SHOT_146_DURATION_FRAMES], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 44%, rgba(33,102,255,0.18), transparent 20%), radial-gradient(circle at 82% 18%, rgba(34,197,94,0.10), transparent 18%), radial-gradient(circle at 20% 74%, rgba(99,102,241,0.16), transparent 24%), linear-gradient(180deg, #061018 0%, #050a12 42%, #091321 100%)",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
        color: "#f8fbff",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          opacity: 0.3,
          transform: `scale(${1.03 + cameraPush * 0.03})`,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width * 0.18,
          top: height * 0.16,
          width: width * 0.24,
          height: height * 0.24,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(77,213,255,0.22), transparent 70%)",
          filter: "blur(18px)",
          transform: `translate3d(${interpolate(cameraPush, [0, 1], [-24, 12], clamp)}px, 0, 0)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: width * 0.12,
          bottom: height * 0.18,
          width: width * 0.28,
          height: height * 0.28,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(104,99,255,0.18), transparent 70%)",
          filter: "blur(18px)",
          transform: `translate3d(${interpolate(cameraPush, [0, 1], [18, -18], clamp)}px, 0, 0)`,
        }}
      />

      {modulePositions.map((modulePosition, index) => {
        const moduleIn = interpolate(frame, [index * 8, 44 + index * 8], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });
        const parallaxX = interpolate(cameraPush, [0, 1], [modulePosition.x * 0.06, modulePosition.x * -0.04], clamp);
        const parallaxY = interpolate(cameraPush, [0, 1], [modulePosition.y * 0.05, modulePosition.y * -0.03], clamp);
        const label = modules[index] ?? modulePosition.title;

        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: width / 2 - 124,
              top: height / 2 - 78,
              width: 248,
              height: 156,
              borderRadius: 26,
              background: "rgba(7,16,28,0.82)",
              border: `1px solid ${modulePosition.accent}44`,
              boxShadow: `0 32px 90px rgba(0,0,0,0.34), 0 0 36px ${modulePosition.accent}18`,
              opacity: 0.16 + moduleIn * 0.84,
              transform: `translate(${interpolate(moduleIn, [0, 1], [modulePosition.x * 0.35, modulePosition.x + parallaxX], clamp)}px, ${interpolate(moduleIn, [0, 1], [modulePosition.y * 0.32, modulePosition.y + parallaxY], clamp)}px) rotate(${interpolate(moduleIn, [0, 1], [0, modulePosition.rotate], clamp)}deg) scale(${interpolate(moduleIn, [0, 1], [0.72, modulePosition.scale], clamp)})`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 18% 20%, ${modulePosition.accent}22, transparent 42%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 18,
                top: 18,
                width: 46,
                height: 46,
                borderRadius: 16,
                background: `${modulePosition.accent}22`,
                border: `1px solid ${modulePosition.accent}55`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 82,
                top: 24,
                fontSize: 18,
                fontWeight: 850,
                color: "#f8fbff",
              }}
            >
              {label}
            </div>
            <div
              style={{
                position: "absolute",
                left: 82,
                top: 56,
                width: 96,
                height: 9,
                borderRadius: 999,
                background: "rgba(248,251,255,0.12)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                bottom: 22,
                height: 12,
                borderRadius: 999,
                background: `linear-gradient(90deg, ${modulePosition.accent}cc, rgba(248,251,255,0.12))`,
                opacity: 0.5 + hold * 0.16,
              }}
            />
          </div>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: width / 2 - 280,
          top: height / 2 - 92,
          width: 560,
          textAlign: "center",
          transform: `translateY(${interpolate(wordIn, [0, 1], [26, 0], clamp)}px) scale(${interpolate(wordIn, [0, 1], [0.94, 1], clamp)})`,
          opacity: 0.08 + wordIn * 0.92,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#8ab9ff",
            marginBottom: 14,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 72,
            lineHeight: 0.98,
            fontWeight: 900,
            letterSpacing: 0,
            textShadow: "0 8px 34px rgba(10,18,34,0.45)",
          }}
        >
          {heroWord}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 + interpolate(cursorSweep, [0, 1], [-34, 248], clamp),
          top: height / 2 + interpolate(cursorSweep, [0, 1], [34, -112], clamp),
          width: 26,
          height: 34,
          opacity: cursorSweep < 0.02 ? 0 : 1,
          transform: `scale(${0.92 + cursorSweep * 0.08}) rotate(${interpolate(cursorSweep, [0, 1], [8, -3], clamp)}deg)`,
          filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.4))",
        }}
      >
        <svg viewBox="0 0 26 34" width="26" height="34" fill="none">
          <path d="M3 2L23 17L14 18.6L18.2 30.5L12.8 32L8.7 20L3 25V2Z" fill="#f8fbff" />
          <path d="M3 2L23 17L14 18.6L18.2 30.5L12.8 32L8.7 20L3 25V2Z" stroke="#0f172a" strokeWidth="1.2" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: width * 0.34,
          right: width * 0.34,
          bottom: 92,
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(77,213,255,0), rgba(77,213,255,0.66), rgba(123,140,255,0.62), rgba(77,213,255,0))",
          opacity: 0.3 + stageIn * 0.4,
          transform: `scaleX(${0.78 + hold * 0.12})`,
        }}
      />
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_95_DURATION_FRAMES = 70;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type BrandFinalCtaProps = {
  brandName?: string;
  tagline?: string;
  website?: string;
  bottomCopy?: string;
  secondaryCopy?: string;
};

const LogoMark: React.FC<{ progress: number }> = ({ progress }) => {
  const blue = "#2379ff";
  const darkBlue = "#1a4fd0";

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: 64,
        height: 64,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [14, 0], clamp)}px) scale(${interpolate(progress, [0, 1], [0.92, 1], clamp)})`,
      }}
    >
      {[0, 1, 2].map((row) => (
        <React.Fragment key={row}>
          <div
            style={{
              position: "absolute",
              left: 4,
              top: 8 + row * 16,
              width: 24,
              height: 10,
              background: row === 1 ? blue : darkBlue,
              transform: "skewY(32deg)",
              boxShadow: row === 1 ? "0 0 16px rgba(35,121,255,0.45)" : undefined,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 8 + row * 16,
              width: 24,
              height: 10,
              background: blue,
              transform: "skewY(-32deg)",
              boxShadow: "0 0 18px rgba(35,121,255,0.34)",
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export const Shot95KitaabhBrandFinalCtaChoreography: React.FC<BrandFinalCtaProps> = ({
  brandName = "Kitaabh",
  tagline = "Turning your thoughts into effortless accounting",
  website = "Kitaabh.com",
  bottomCopy = "Kitaabh AI turning your thoughts into effortless accounting",
  secondaryCopy = "Kitaabh AI helps you transform ideas into structured work.",
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const bg = ease(frame, 0, 16);
  const logo = ease(frame, 4, 24);
  const pill = ease(frame, 14, 36);
  const glint = ease(frame, 22, 44);
  const web = ease(frame, 30, 48);
  const bottom = ease(frame, 36, 56);
  const settle = ease(frame, 56, 70);

  const groupX = width / 2 - 300;
  const groupY = 158;
  const pillWidth = 430;
  const glintX = interpolate(glint, [0, 1], [-30, pillWidth + 28], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#05090f",
        color: "#f7fbff",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(bg, [0, 1], [0.35, 1], clamp),
          background:
            "radial-gradient(circle at 68% 46%, rgba(31,95,230,0.72), transparent 33%), radial-gradient(circle at 54% 18%, rgba(20,53,125,0.38), transparent 30%), linear-gradient(120deg, #06090d 0%, #07132b 48%, #0a2b73 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width / 2 - 350,
          top: 110,
          width: 700,
          height: 230,
          opacity: interpolate(bg, [0, 1], [0, 0.75], clamp),
          background: "linear-gradient(90deg, transparent, rgba(29,92,230,0.14), transparent)",
          filter: "blur(16px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: groupX,
          top: groupY,
          display: "flex",
          alignItems: "center",
          gap: 18,
          transform: `translateY(${interpolate(logo, [0, 1], [22, 0], clamp)}px) scale(${interpolate(settle, [0, 1], [1.012, 1], clamp)})`,
          opacity: logo,
        }}
      >
        <LogoMark progress={logo} />
        <div
          style={{
            fontSize: 58,
            lineHeight: 1,
            fontWeight: 820,
            letterSpacing: 0,
            color: "#f8fbff",
            textShadow: "0 0 28px rgba(67,126,255,0.36)",
          }}
        >
          {brandName}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: groupX + 6,
          top: groupY + 90,
          width: pillWidth,
          height: 30,
          borderRadius: 999,
          opacity: pill,
          overflow: "hidden",
          transform: `translateY(${interpolate(pill, [0, 1], [10, 0], clamp)}px)`,
          clipPath: `inset(0 ${interpolate(pill, [0, 1], [100, 0], clamp)}% 0 0 round 999px)`,
          background: "rgba(2,10,26,0.58)",
          border: "1px solid rgba(127,166,255,0.24)",
          boxShadow: "inset 0 0 18px rgba(74,123,255,0.22), 0 0 24px rgba(41,104,255,0.22)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "0 18px",
            display: "flex",
            alignItems: "center",
            fontSize: 13,
            fontWeight: 680,
            color: "rgba(239,246,255,0.82)",
            whiteSpace: "nowrap",
          }}
        >
          {tagline}
        </div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: glintX,
            top: -6,
            width: 34,
            height: 42,
            opacity: interpolate(glint, [0, 0.15, 0.85, 1], [0, 1, 1, 0], clamp),
            background: "linear-gradient(90deg, transparent, rgba(218,246,255,0.92), transparent)",
            filter: "blur(1px)",
            transform: "skewX(-18deg)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: groupX + pillWidth - 76,
          top: groupY + 132,
          opacity: web,
          transform: `translateY(${interpolate(web, [0, 1], [6, 0], clamp)}px)`,
          fontSize: 11,
          fontWeight: 700,
          color: "rgba(167,194,255,0.74)",
        }}
      >
        {website}
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: groupX + pillWidth + 48,
          top: groupY + 83,
          width: 48,
          height: 48,
          opacity: interpolate(glint, [0, 0.35, 0.75, 1], [0, 1, 0.72, 0], clamp),
          color: "#bff4ff",
          fontSize: 44,
          lineHeight: "48px",
          textAlign: "center",
          textShadow: "0 0 24px rgba(136,231,255,0.85)",
          transform: `scale(${interpolate(glint, [0, 0.4, 1], [0.7, 1.08, 0.9], clamp)}) rotate(45deg)`,
        }}
      >
        +
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 505,
          width: "100%",
          textAlign: "center",
          opacity: bottom,
          transform: `translateY(${interpolate(bottom, [0, 1], [12, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 720,
            color: "rgba(245,249,255,0.88)",
            letterSpacing: 0,
          }}
        >
          {bottomCopy}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 11,
            fontWeight: 560,
            color: "rgba(216,229,255,0.58)",
            letterSpacing: 0,
          }}
        >
          {secondaryCopy}
        </div>
      </div>
    </AbsoluteFill>
  );
};

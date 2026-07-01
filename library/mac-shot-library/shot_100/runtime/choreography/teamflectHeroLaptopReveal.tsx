import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_100_DURATION_FRAMES = 99;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  brandName?: string;
  tagline?: string;
  accent?: string;
};

const Tile: React.FC<{ left: number; top: number; color: string; label: string; delay: number }> = ({
  left,
  top,
  color,
  label,
  delay,
}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, 8 + delay, 42 + delay);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 96,
        height: 82,
        borderRadius: 20,
        background: "#fff",
        boxShadow: "0 22px 42px rgba(88,64,126,0.16)",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-32, 0], clamp)}px) rotate(${interpolate(p, [0, 1], [-10, -5], clamp)}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 28,
          top: 20,
          width: 40,
          height: 40,
          borderRadius: 10,
          background: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 860,
          fontSize: 18,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Shot100TeamflectHeroLaptopRevealChoreography: React.FC<Props> = ({
  brandName = "teamflect",
  tagline = "An All-in-One Performance Management Solution",
  accent = "+",
}) => {
  const frame = useCurrentFrame();
  const field = ease(frame, 0, 18);
  const brand = ease(frame, 38, 68);
  const laptop = ease(frame, 48, 86);
  const settle = ease(frame, 74, 99);

  return (
    <AbsoluteFill
      style={{
        background: "#f8f6fb",
        overflow: "hidden",
        color: "#202027",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: field,
          background:
            "radial-gradient(circle at 58% 74%, rgba(238,211,245,0.92), transparent 30%), radial-gradient(circle at 82% 24%, rgba(218,214,248,0.74), transparent 24%), linear-gradient(180deg, #ffffff 0%, #f5f0fb 100%)",
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            left: 710 + i * 92,
            top: 116 + i * 46,
            width: 120,
            height: 86,
            borderRadius: 26,
            background: "rgba(215,205,246,0.46)",
            opacity: field * 0.7,
          }}
        />
      ))}

      <Tile left={654} top={86} color="#5c64d8" label="T" delay={0} />
      <Tile left={548} top={184} color="#2f83d9" label="O" delay={8} />
      <Tile left={674} top={206} color="#d71b65" label="M" delay={14} />

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 268,
          opacity: brand,
          transform: `translateX(${interpolate(brand, [0, 1], [-34, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 50,
            fontWeight: 870,
            letterSpacing: 0,
          }}
        >
          <span>{brandName}</span>
          <span style={{ color: "#db1d67", fontSize: 42, lineHeight: 1 }}>{accent}</span>
        </div>
        <div
          style={{
            marginTop: 14,
            width: 310,
            fontSize: 17,
            lineHeight: 1.24,
            fontWeight: 650,
            color: "rgba(32,32,39,0.68)",
          }}
        >
          {tagline}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 102,
          top: 190,
          width: 570,
          height: 348,
          opacity: laptop,
          transform: `translateX(${interpolate(laptop, [0, 1], [64, 0], clamp)}px) translateY(${interpolate(laptop, [0, 1], [22, 0], clamp)}px) scale(${interpolate(settle, [0, 1], [1.015, 1], clamp)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            background: "#11131b",
            boxShadow: "0 38px 70px rgba(45,37,68,0.24)",
            padding: 14,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 14,
              background: "#fbfbff",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 90, background: "#f0eef8" }} />
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                style={{
                  position: "absolute",
                  left: 118,
                  top: 46 + row * 52,
                  width: 258,
                  height: 34,
                  borderRadius: 9,
                  background: row % 2 ? "#f1f2f8" : "#ffffff",
                  border: "1px solid #e5e4ef",
                }}
              />
            ))}
            <div style={{ position: "absolute", right: 28, top: 44, width: 124, height: 90, borderRadius: 14, background: "#f6d5e9" }} />
            <div style={{ position: "absolute", right: 28, bottom: 40, width: 160, height: 78, borderRadius: 14, background: "#f2f0fb", border: "1px solid #e1ddef" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_130_DURATION_FRAMES = 84;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  label?: string;
  eyebrow?: string;
  resultCards?: string[];
};

const confetti = [
  { x: 522, y: 198, tx: -72, ty: -54, rotate: -32, color: "#2d9bdc", w: 34, h: 8 },
  { x: 586, y: 152, tx: -30, ty: -66, rotate: 24, color: "#7357ff", w: 10, h: 34 },
  { x: 672, y: 158, tx: 32, ty: -62, rotate: -16, color: "#36c5e8", w: 38, h: 8 },
  { x: 736, y: 202, tx: 78, ty: -34, rotate: 34, color: "#226eea", w: 12, h: 34 },
  { x: 542, y: 302, tx: -74, ty: 32, rotate: 28, color: "#7357ff", w: 12, h: 30 },
  { x: 718, y: 306, tx: 72, ty: 30, rotate: -28, color: "#2d9bdc", w: 32, h: 8 },
  { x: 618, y: 122, tx: -8, ty: -72, rotate: 42, color: "#36c5e8", w: 9, h: 28 },
  { x: 666, y: 126, tx: 10, ty: -76, rotate: -42, color: "#7357ff", w: 9, h: 28 },
];

const cardOffsets = [
  { x: -258, y: 34, rotate: -7 },
  { x: 0, y: 0, rotate: 0 },
  { x: 258, y: 34, rotate: 7 },
];

export const Shot130CompletionCheckConfettiRevealChoreography: React.FC<Props> = ({
  label = "Done",
  eyebrow = "AI output ready",
  resultCards = ["Translated", "Dubbed", "Distributed"],
}) => {
  const frame = useCurrentFrame();
  const halo = ease(frame, 0, 22);
  const check = ease(frame, 2, 24);
  const burst = ease(frame, 12, 38);
  const done = ease(frame, 22, 48);
  const cards = ease(frame, 34, 72);
  const hold = ease(frame, 70, 84);

  const checkScale = interpolate(check, [0, 0.72, 1], [0.54, 1.08, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#f9f9ff",
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
            "radial-gradient(circle at 50% 40%, rgba(54, 197, 232, 0.14), transparent 24%), radial-gradient(circle at 50% 72%, rgba(115, 87, 255, 0.10), transparent 28%), linear-gradient(180deg, #ffffff 0%, #f5f7ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 470,
          top: 110,
          width: 340,
          height: 340,
          borderRadius: 999,
          background: "rgba(54,197,232,0.10)",
          border: "2px solid rgba(45,155,220,0.15)",
          opacity: 0.18 + halo * 0.82,
          transform: `scale(${interpolate(halo, [0, 1], [0.72, 1.12], clamp)})`,
          boxShadow: "0 46px 120px rgba(45, 155, 220, 0.12)",
        }}
      />
      {confetti.map((piece, index) => {
        const fly = ease(frame, 16 + index * 1.2, 40 + index * 1.2);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: piece.x,
              top: piece.y,
              width: piece.w,
              height: piece.h,
              borderRadius: 999,
              background: piece.color,
              opacity: interpolate(fly, [0, 0.72, 1], [0, 0.92, 0.38], clamp),
              transform: `translate(${interpolate(fly, [0, 1], [0, piece.tx], clamp)}px, ${interpolate(fly, [0, 1], [0, piece.ty], clamp)}px) rotate(${interpolate(fly, [0, 1], [0, piece.rotate], clamp)}deg) scale(${interpolate(fly, [0, 0.4, 1], [0.5, 1, 0.86], clamp)})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 562,
          top: 168,
          width: 156,
          height: 156,
          borderRadius: 999,
          background: "linear-gradient(180deg, #4aa9ff 0%, #226eea 100%)",
          boxShadow: "0 34px 82px rgba(43, 121, 232, 0.28)",
          opacity: interpolate(check, [0, 1], [0.18, 1], clamp),
          transform: `scale(${checkScale}) translateY(${interpolate(hold, [0, 1], [0, 4], clamp)}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 53,
            top: 45,
            width: 52,
            height: 28,
            borderLeft: "10px solid #ffffff",
            borderBottom: "10px solid #ffffff",
            borderRadius: 4,
            transform: "rotate(-45deg)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 348,
          textAlign: "center",
          opacity: done,
          transform: `translateY(${interpolate(done, [0, 1], [20, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 44, lineHeight: 1, fontWeight: 860, letterSpacing: 0 }}>{label}</div>
        <div style={{ marginTop: 12, fontSize: 18, fontWeight: 740, color: "#2d9bdc", letterSpacing: 0 }}>
          {eyebrow}
        </div>
      </div>
      {cardOffsets.map((offset, index) => {
        const cardIn = ease(frame, 34 + index * 5, 66 + index * 5);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 516,
              top: 486,
              width: 248,
              height: 116,
              borderRadius: 24,
              background: "#ffffff",
              border: "1px solid rgba(45, 155, 220, 0.16)",
              boxShadow: "0 26px 70px rgba(27, 58, 96, 0.10)",
              opacity: cardIn,
              transform: `translate(${interpolate(cardIn, [0, 1], [0, offset.x], clamp)}px, ${interpolate(cardIn, [0, 1], [70, offset.y], clamp)}px) rotate(${interpolate(cardIn, [0, 1], [0, offset.rotate], clamp)}deg) scale(${interpolate(cardIn, [0, 1], [0.84, 1], clamp)})`,
            }}
          >
            <div style={{ position: "absolute", left: 22, top: 22, width: 44, height: 44, borderRadius: 14, background: index === 1 ? "#226eea" : "#e6f2ff" }} />
            <div style={{ position: "absolute", left: 82, top: 24, width: 116, height: 12, borderRadius: 999, background: "rgba(17,24,39,0.16)" }} />
            <div style={{ position: "absolute", left: 82, top: 48, width: 82, height: 10, borderRadius: 999, background: "rgba(45,155,220,0.18)" }} />
            <div style={{ position: "absolute", left: 22, bottom: 18, fontSize: 18, fontWeight: 820, color: "#111827" }}>
              {resultCards[index] ?? `Result ${index + 1}`}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 444,
          bottom: 58,
          width: 392,
          height: 8,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(45,155,220,0), rgba(45,155,220,0.35), rgba(115,87,255,0))",
          opacity: cards * interpolate(hold, [0, 1], [0.72, 0.52], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

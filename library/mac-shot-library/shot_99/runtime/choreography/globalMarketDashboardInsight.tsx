import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_99_DURATION_FRAMES = 175;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  headline?: string;
  metric?: string;
  regionLabel?: string;
};

const candles = [
  0.44, 0.6, 0.53, 0.72, 0.66, 0.82, 0.58, 0.42, 0.5, 0.36, 0.31, 0.45, 0.4, 0.52, 0.61, 0.56,
];

export const Shot99GlobalMarketDashboardInsightChoreography: React.FC<Props> = ({
  headline = "Global markets signal a mixed turn",
  metric = "Volume +18% across tracked pairs",
  regionLabel = "Global FX dashboard",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const globe = ease(frame, 0, 34);
  const volume = ease(frame, 18, 78);
  const chart = ease(frame, 28, 116);
  const line = ease(frame, 46, 128);
  const copy = ease(frame, 90, 150);
  const settle = ease(frame, 150, 175);
  const drift = interpolate(frame, [0, SHOT_99_DURATION_FRAMES], [-24, 18], clamp);

  return (
    <AbsoluteFill
      style={{
        background: "#031018",
        overflow: "hidden",
        color: "#f7fbff",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 44%, rgba(25,172,230,0.58), transparent 34%), radial-gradient(circle at 72% 55%, rgba(10,46,80,0.46), transparent 42%), linear-gradient(110deg, #06253f 0%, #061420 42%, #02070a 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: -130 + drift,
          top: 62,
          width: 520,
          height: 520,
          borderRadius: "50%",
          opacity: globe,
          border: "2px solid rgba(72,219,255,0.32)",
          boxShadow: "0 0 70px rgba(35,177,229,0.38), inset 0 0 54px rgba(45,210,255,0.22)",
          background:
            "radial-gradient(circle at 38% 42%, rgba(73,226,255,0.22), transparent 44%), repeating-linear-gradient(90deg, rgba(104,233,255,0.15) 0 1px, transparent 1px 22px), repeating-linear-gradient(0deg, rgba(104,233,255,0.10) 0 1px, transparent 1px 24px)",
          transform: `scale(${interpolate(settle, [0, 1], [1.02, 1], clamp)})`,
        }}
      />
      {[0, 1, 2, 3].map((arc) => (
        <div
          key={arc}
          aria-hidden
          style={{
            position: "absolute",
            left: -95 + drift + arc * 34,
            top: 132 + arc * 42,
            width: 410 - arc * 28,
            height: 120,
            borderTop: "1px solid rgba(111,232,255,0.24)",
            borderRadius: "50%",
            opacity: globe * (0.7 - arc * 0.12),
            transform: `rotate(${arc * 9 - 12}deg)`,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: 345,
          top: 126,
          width: 820,
          height: 470,
          opacity: chart,
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            backgroundImage:
              "linear-gradient(rgba(74,218,244,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(74,218,244,0.09) 1px, transparent 1px)",
            backgroundSize: "60px 48px",
          }}
        />
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 120 + row * 86,
              height: 1,
              background: "rgba(136,232,255,0.18)",
            }}
          />
        ))}
        {candles.map((value, index) => {
          const p = ease(frame, 28 + index * 5, 54 + index * 5);
          const up = index % 3 !== 1;
          const x = 24 + index * 46;
          const y = 260 - value * 155 + Math.sin(index * 1.7) * 34;
          const body = 42 + Math.abs(Math.sin(index)) * 32;
          return (
            <React.Fragment key={index}>
              <div
                style={{
                  position: "absolute",
                  left: x + 8,
                  top: y - 26,
                  width: 2,
                  height: (body + 52) * p,
                  opacity: p,
                  background: up ? "#5df27a" : "#ff4f62",
                  boxShadow: up ? "0 0 12px rgba(93,242,122,0.45)" : "0 0 12px rgba(255,79,98,0.45)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: up ? y : y + 18,
                  width: 18,
                  height: body * p,
                  opacity: p,
                  borderRadius: 3,
                  background: up ? "#58f075" : "#ff4d61",
                }}
              />
            </React.Fragment>
          );
        })}
        {[0, 1, 2].map((series) => (
          <div
            key={series}
            aria-hidden
            style={{
              position: "absolute",
              left: 18,
              top: 228 + series * 38,
              width: 715 * line,
              height: 2,
              opacity: line * (0.7 - series * 0.12),
              borderRadius: 999,
              background: series === 0 ? "#5fe2ff" : series === 1 ? "#f54d78" : "#d8b94b",
              transform: `rotate(${series === 0 ? -7 : series === 1 ? 6 : -2}deg)`,
              transformOrigin: "0 50%",
              boxShadow: "0 0 16px rgba(95,226,255,0.24)",
            }}
          />
        ))}
        {candles.slice(0, 14).map((_, index) => (
          <div
            key={`volume-${index}`}
            aria-hidden
            style={{
              position: "absolute",
              left: 18 + index * 52,
              bottom: 0,
              width: 28,
              height: interpolate(volume, [0, 1], [6, 44 + Math.abs(Math.sin(index * 0.9)) * 86], clamp),
              opacity: volume * 0.58,
              background: "rgba(54,142,225,0.72)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          right: 70,
          top: 80,
          width: 390,
          opacity: copy,
          transform: `translateY(${interpolate(copy, [0, 1], [16, 0], clamp)}px)`,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 780,
            color: "#66e6ff",
            textTransform: "uppercase",
            letterSpacing: 0,
          }}
        >
          {regionLabel}
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 36,
            lineHeight: 1.04,
            fontWeight: 840,
            letterSpacing: 0,
            color: "#f7fbff",
            textShadow: "0 0 24px rgba(80,218,255,0.25)",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: 15,
            display: "inline-flex",
            padding: "9px 13px",
            borderRadius: 999,
            background: "rgba(3,23,34,0.72)",
            border: "1px solid rgba(105,226,255,0.24)",
            color: "rgba(232,250,255,0.86)",
            fontSize: 12,
            fontWeight: 760,
          }}
        >
          {metric}
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: height * 0.18,
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.54))",
        }}
      />
    </AbsoluteFill>
  );
};

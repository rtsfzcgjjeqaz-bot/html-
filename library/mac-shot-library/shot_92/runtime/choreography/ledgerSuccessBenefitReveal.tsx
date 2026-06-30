import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_92_DURATION_FRAMES = 63;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const CheckMark: React.FC = () => (
  <div
    style={{
      width: 42,
      height: 23,
      borderLeft: "8px solid #061d13",
      borderBottom: "8px solid #061d13",
      transform: "rotate(-45deg) translate(2px, -3px)",
      borderRadius: 4,
    }}
  />
);

export const Shot92LedgerSuccessBenefitRevealChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const card = ease(frame, 0, 18);
  const mark = ease(frame, 8, 24);
  const buttons = ease(frame, 16, 34);
  const recede = ease(frame, 28, 46);
  const headline = ease(frame, 36, 56);
  const hold = ease(frame, 54, 63);

  return (
    <AbsoluteFill
      style={{
        background: "#030715",
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
          background:
            "radial-gradient(circle at 45% 20%, rgba(66,104,255,0.38), transparent 28%), radial-gradient(circle at 28% 92%, rgba(52,97,190,0.34), transparent 38%), linear-gradient(180deg, #07143a 0%, #030715 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - 442,
          top: 104,
          width: 650,
          height: 282,
          opacity: card * interpolate(recede, [0, 1], [1, 0.12], clamp),
          transform: `translate(${interpolate(card, [0, 1], [-76, 0], clamp)}px, ${interpolate(card, [0, 1], [80, 0], clamp)}px) perspective(900px) rotateY(-8deg) rotateZ(-4deg) scale(${interpolate(recede, [0, 1], [1, 0.76], clamp)})`,
          borderRadius: 30,
          background: "rgba(7,13,27,0.92)",
          border: "1px solid rgba(126,158,255,0.28)",
          boxShadow: "0 0 54px rgba(58,106,255,0.38), 0 28px 96px rgba(0,0,0,0.58)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 44,
            width: 104,
            height: 104,
            marginLeft: -52,
            borderRadius: "50%",
            background: "#34e99a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${interpolate(mark, [0, 0.52, 1], [0.76, 1.14, 1], clamp)})`,
            boxShadow: "0 0 40px rgba(52,233,154,0.45)",
          }}
        >
          <CheckMark />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 166,
            textAlign: "center",
            opacity: mark,
            fontSize: 19,
            fontWeight: 740,
            color: "rgba(218,246,238,0.86)",
          }}
        >
          Ledger created successfully !
        </div>
        <div
          style={{
            position: "absolute",
            left: 74,
            right: 74,
            bottom: 42,
            display: "flex",
            justifyContent: "center",
            gap: 24,
            opacity: buttons,
            transform: `translateY(${interpolate(buttons, [0, 1], [12, 0], clamp)}px)`,
          }}
        >
          {["Create Another Ledger", "Go To Ledger List"].map((label) => (
            <div
              key={label}
              style={{
                height: 38,
                padding: "0 22px",
                borderRadius: 999,
                background: "rgba(58,97,255,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width / 2 - 420,
          top: 365,
          width: 840,
          height: 240,
          opacity: headline,
          borderRadius: "50%",
          borderTop: "2px solid rgba(76,109,255,0.24)",
          transform: `scale(${interpolate(headline, [0, 1], [0.92, 1], clamp)})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 282,
          width: "100%",
          textAlign: "center",
          opacity: headline,
          transform: `translateY(${interpolate(headline, [0, 1], [16, 0], clamp)}) scale(${interpolate(hold, [0, 1], [1.01, 1], clamp)})`,
          fontSize: 36,
          fontWeight: 860,
          letterSpacing: 0,
          color: "#edf4ff",
          textShadow: "0 0 28px rgba(98,126,255,0.42)",
        }}
      >
        No more time-consuming forms
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 390,
          width: "100%",
          textAlign: "center",
          opacity: interpolate(headline, [0, 1], [0, 0.72], clamp),
          fontSize: 15,
          fontWeight: 660,
          color: "rgba(235,242,255,0.66)",
        }}
      >
        It is ready with less manual typing
      </div>
    </AbsoluteFill>
  );
};

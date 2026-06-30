import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_89_DURATION_FRAMES = 54;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const promptCopy = "Paid 50,000 to Kavya, 25000 to Ashok.";

const typedPrompt = (frame: number) => {
  const count = Math.round(interpolate(frame, [8, 34], [0, promptCopy.length], clamp));
  return promptCopy.slice(0, count);
};

export const Shot89PaymentPromptToFormRevealChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const rail = ease(frame, 0, 12);
  const search = ease(frame, 28, 42);
  const subtitle = ease(frame, 24, 42);
  const form = ease(frame, 34, 54);
  const settle = ease(frame, 46, 54);

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
            "radial-gradient(circle at 55% 28%, rgba(65,100,255,0.42), transparent 30%), radial-gradient(circle at 24% 68%, rgba(31,81,198,0.3), transparent 34%), linear-gradient(180deg, #07143a 0%, #030715 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - 442,
          top: 118,
          opacity: rail,
          transform: `translateY(${interpolate(rail, [0, 1], [18, 0], clamp)}px)`,
          width: 214,
          height: 32,
          borderRadius: 999,
          border: "1px solid rgba(161,186,255,0.3)",
          background: "rgba(3,8,22,0.84)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
          fontSize: 14,
          fontWeight: 760,
          color: "rgba(242,247,255,0.82)",
          boxShadow: "0 0 18px rgba(67,107,255,0.2)",
        }}
      >
        <span>Write a prompt.</span>
        <span style={{ marginLeft: "auto", opacity: 0.7 }}>⌕</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 - 440,
          top: 166,
          width: 880,
          height: 74,
          opacity: rail,
          transform: `translateX(${interpolate(rail, [0, 1], [-34, 0], clamp)}px) scale(${interpolate(settle, [0, 1], [1.012, 1], clamp)})`,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(58,105,255,0.98), rgba(51,91,226,0.9))",
          border: "1px solid rgba(190,210,255,0.38)",
          boxShadow: "0 0 38px rgba(72,115,255,0.55), 0 26px 80px rgba(0,0,0,0.34)",
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
        }}
      >
        <div
          style={{
            fontSize: 25,
            fontWeight: 760,
            letterSpacing: 0,
            color: "#f9fbff",
            whiteSpace: "nowrap",
            maxWidth: 690,
            overflow: "hidden",
          }}
        >
          {typedPrompt(frame)}
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: 132,
            height: 48,
            borderRadius: 999,
            background: search > 0.45 ? "rgba(3,7,18,0.96)" : "rgba(3,7,18,0.72)",
            border: "1px solid rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontSize: 15,
            fontWeight: 820,
            transform: `scale(${interpolate(search, [0, 0.5, 1], [1, 1.06, 1], clamp)})`,
            boxShadow: `0 0 ${interpolate(search, [0, 1], [8, 26], clamp)}px rgba(180,203,255,0.38)`,
          }}
        >
          <span>⌕</span>
          <span>Search</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 312,
          width: "100%",
          textAlign: "center",
          opacity: subtitle,
          transform: `translateY(${interpolate(subtitle, [0, 1], [12, 0], clamp)}px)`,
          color: "rgba(236,242,255,0.78)",
          fontSize: 17,
          fontWeight: 650,
        }}
      >
        simply type it away and it is recorded
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 - 514,
          top: 392,
          width: 760,
          height: 252,
          opacity: form,
          transform: `translate(${interpolate(form, [0, 1], [-44, 0], clamp)}px, ${interpolate(form, [0, 1], [140, 0], clamp)}px) perspective(900px) rotateY(-8deg) rotateZ(-2deg)`,
          borderRadius: 28,
          background: "rgba(236,244,255,0.94)",
          border: "1px solid rgba(255,255,255,0.72)",
          boxShadow: "0 0 34px rgba(68,235,226,0.5), 0 26px 86px rgba(0,0,0,0.52)",
          color: "#23304d",
          padding: 28,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 840, marginBottom: 22 }}>Create Payment</div>
        {["Payment Mode: From", "Payment Paid to", "Payment Paid via"].map((label, index) => (
          <div
            key={label}
            style={{
              position: "absolute",
              left: 248 + index * 170,
              top: 34,
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(77,99,150,0.1)",
              fontSize: 12,
              fontWeight: 760,
              color: "rgba(50,62,98,0.62)",
            }}
          >
            {label}
          </div>
        ))}
        {[
          ["Kavya", "50,000", "Dr"],
          ["Ashok", "25,000", "Dr"],
        ].map((row, index) => (
          <div
            key={row[0]}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 150px 100px 1fr",
              alignItems: "center",
              height: 52,
              borderTop: "1px solid rgba(66,82,128,0.12)",
              fontSize: 15,
              fontWeight: 740,
            }}
          >
            <span>{row[0]}</span>
            <span>{row[1]}</span>
            <span>{row[2]}</span>
            <span
              style={{
                justifySelf: "end",
                padding: "8px 16px",
                borderRadius: 12,
                background: "rgba(64,105,255,0.9)",
                color: "#fff",
              }}
            >
              Add
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

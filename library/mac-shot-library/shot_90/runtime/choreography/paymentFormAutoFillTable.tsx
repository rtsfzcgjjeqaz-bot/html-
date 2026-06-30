import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_90_DURATION_FRAMES = 71;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

export const Shot90PaymentFormAutoFillTableChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const form = ease(frame, 0, 28);
  const chips = ease(frame, 16, 36);
  const rows = ease(frame, 24, 52);
  const buttons = ease(frame, 38, 58);
  const status = ease(frame, 48, 71);
  const settle = ease(frame, 58, 71);

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
            "radial-gradient(circle at 58% 28%, rgba(65,100,255,0.34), transparent 30%), radial-gradient(circle at 20% 75%, rgba(53,232,218,0.26), transparent 35%), linear-gradient(180deg, #07133a 0%, #030715 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width / 2 - 424,
          top: 76,
          width: 210,
          height: 30,
          borderRadius: 999,
          background: "rgba(2,7,19,0.88)",
          border: "1px solid rgba(162,186,255,0.28)",
          display: "flex",
          alignItems: "center",
          padding: "0 13px",
          fontSize: 13,
          fontWeight: 760,
          color: "rgba(241,246,255,0.82)",
          boxShadow: "0 0 16px rgba(77,117,255,0.18)",
        }}
      >
        Write a prompt.
      </div>

      <div
        style={{
          position: "absolute",
          left: width / 2 - 526,
          top: 142,
          width: 872,
          height: 392,
          opacity: form,
          transform: `translate(${interpolate(form, [0, 1], [-96, 0], clamp)}px, ${interpolate(form, [0, 1], [84, 0], clamp)}px) perspective(900px) rotateY(${interpolate(form, [0, 1], [-13, -7], clamp)}deg) rotateZ(${interpolate(form, [0, 1], [-3, -1.3], clamp)}deg) scale(${interpolate(form, [0, 1], [1.2, 1], clamp) * interpolate(settle, [0, 1], [1.01, 1], clamp)})`,
          borderRadius: 30,
          background: "rgba(239,246,255,0.96)",
          border: "1px solid rgba(255,255,255,0.78)",
          boxShadow: "0 0 42px rgba(66,235,226,0.48), 0 30px 94px rgba(0,0,0,0.5)",
          color: "#21304d",
          padding: "32px 38px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
          <div style={{ fontSize: 24, fontWeight: 860 }}>Create Payment</div>
          {["NEFT / IMPS", "Payment Paid to", "Payment Paid via"].map((chip, index) => (
            <div
              key={chip}
              style={{
                opacity: chips,
                transform: `translateY(${interpolate(chips, [0, 1], [10 + index * 3, 0], clamp)}px)`,
                padding: "7px 13px",
                borderRadius: 999,
                background: "rgba(75,92,135,0.1)",
                color: "rgba(48,61,98,0.62)",
                fontSize: 13,
                fontWeight: 780,
              }}
            >
              {chip}
            </div>
          ))}
          <div
            style={{
              marginLeft: "auto",
              opacity: chips,
              padding: "7px 17px",
              borderRadius: 999,
              background: "#3f6fff",
              color: "#fff",
              fontSize: 13,
              fontWeight: 820,
            }}
          >
            Save
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "210px 150px 100px 1fr",
            color: "rgba(50,62,98,0.58)",
            fontSize: 13,
            fontWeight: 820,
            paddingBottom: 10,
            borderBottom: "1px solid rgba(65,82,128,0.14)",
          }}
        >
          <span>Ledger Name</span>
          <span>Amount</span>
          <span>Dr/Cr</span>
          <span style={{ textAlign: "right" }}>Ledger Details</span>
        </div>

        {[
          ["Kavya", "50,000", "Dr"],
          ["Ashok", "25,000", "Dr"],
        ].map((row, index) => {
          const rowIn = ease(frame, 24 + index * 8, 42 + index * 8);
          return (
            <div
              key={row[0]}
              style={{
                display: "grid",
                gridTemplateColumns: "210px 150px 100px 1fr",
                alignItems: "center",
                height: 66,
                opacity: rows * rowIn,
                transform: `translateY(${interpolate(rowIn, [0, 1], [16, 0], clamp)}px)`,
                borderBottom: "1px solid rgba(65,82,128,0.1)",
                fontSize: 18,
                fontWeight: 760,
              }}
            >
              <span>{row[0]}</span>
              <span>{row[1]}</span>
              <span>{row[2]}</span>
              <span
                style={{
                  justifySelf: "end",
                  opacity: buttons,
                  transform: `scale(${interpolate(buttons, [0, 0.45, 1], [0.8, 1.08, 1], clamp)})`,
                  padding: "10px 20px",
                  borderRadius: 12,
                  background: "#3f6fff",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 840,
                }}
              >
                Add
              </span>
            </div>
          );
        })}

        <div style={{ marginTop: 18, color: "rgba(58,70,108,0.6)", fontSize: 16, fontWeight: 720 }}>
          Add Ledger +
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: width / 2 - 466,
          bottom: 126,
          opacity: status,
          transform: `translateY(${interpolate(status, [0, 1], [16, 0], clamp)}) scale(${interpolate(status, [0, 0.5, 1], [0.86, 1.08, 1], clamp)})`,
          padding: "10px 18px",
          borderRadius: 999,
          background: "rgba(10,23,24,0.86)",
          border: "1px solid rgba(82,236,161,0.42)",
          boxShadow: "0 0 28px rgba(68,238,168,0.38)",
          color: "#ccffe6",
          fontSize: 14,
          fontWeight: 820,
        }}
      >
        Automation details
        <span style={{ marginLeft: 10, color: "#52eea8" }}>●</span>
      </div>
    </AbsoluteFill>
  );
};

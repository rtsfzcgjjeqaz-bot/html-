import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const SHOT_113_DURATION_FRAMES = 93;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type Props = {
  headline?: string;
  filename?: string;
};

const inboxRows = ["New onboarding packet", "Sales call recap", "Vendor renewal"];
const extractedFields = [
  ["Type", "Invoice"],
  ["Owner", "Finance"],
  ["Due", "Friday"],
];

export const Shot113AttachmentCaptureFocusChoreography: React.FC<Props> = ({
  headline = "Capture context from any attachment",
  filename = "vendor-invoice.pdf",
}) => {
  const frame = useCurrentFrame();
  const surface = ease(frame, 0, 30);
  const attachment = ease(frame, 18, 54);
  const cursor = ease(frame, 34, 66);
  const underline = ease(frame, 48, 78);
  const panel = ease(frame, 62, 93);
  const tap = ease(frame, 56, 66);

  return (
    <AbsoluteFill
      style={{
        background: "#f7fbff",
        overflow: "hidden",
        color: "#172033",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #ffffff 0%, #eef8ff 64%, #eaf2ff 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 80,
          top: 44,
          width: 1140,
          height: 620,
          borderRadius: 34,
          background: "rgba(255,255,255,0.78)",
          border: "1px solid rgba(104,148,198,0.18)",
          boxShadow: "0 38px 96px rgba(74,127,178,0.18)",
          opacity: interpolate(surface, [0, 1], [0.45, 1], clamp),
          transform: `perspective(1200px) rotateX(${interpolate(surface, [0, 1], [8, 0], clamp)}deg) translateY(${interpolate(surface, [0, 1], [46, 0], clamp)}px) scale(${interpolate(surface, [0, 1], [0.98, 1], clamp)})`,
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 76, borderBottom: "1px solid rgba(104,148,198,0.16)", background: "rgba(255,255,255,0.88)", borderRadius: "34px 34px 0 0" }} />
        <div style={{ position: "absolute", left: 36, top: 24, width: 134, height: 28, borderRadius: 999, background: "#edf5ff" }} />
        <div style={{ position: "absolute", left: 204, top: 24, width: 420, height: 28, borderRadius: 999, background: "#f5f8fc", border: "1px solid rgba(104,148,198,0.16)" }}>
          <div style={{ position: "absolute", left: 20, top: 7, width: 188, height: 12, borderRadius: 999, background: "rgba(39,94,150,0.16)" }} />
        </div>

        <div style={{ position: "absolute", left: 44, top: 112, width: 348, height: 420, borderRadius: 24, background: "#f6faff", border: "1px solid rgba(104,148,198,0.14)" }}>
          {inboxRows.map((row, index) => {
            const rowIn = ease(frame, 10 + index * 6, 34 + index * 6);
            return (
              <div
                key={row}
                style={{
                  position: "absolute",
                  left: 24,
                  top: 28 + index * 92,
                  width: 300,
                  height: 68,
                  borderRadius: 18,
                  background: "#ffffff",
                  border: "1px solid rgba(104,148,198,0.13)",
                  opacity: rowIn,
                  transform: `translateX(${interpolate(rowIn, [0, 1], [-24, 0], clamp)}px)`,
                  boxShadow: "0 10px 26px rgba(73,121,170,0.08)",
                }}
              >
                <div style={{ position: "absolute", left: 18, top: 18, width: 28, height: 28, borderRadius: 10, background: index === 0 ? "#177ee8" : "#e8f1fb" }} />
                <div style={{ position: "absolute", left: 60, top: 18, fontSize: 13, fontWeight: 760, color: "#26344a" }}>{row}</div>
                <div style={{ position: "absolute", left: 60, top: 42, width: 136, height: 8, borderRadius: 999, background: "rgba(39,94,150,0.11)" }} />
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 452,
            top: 154,
            width: 416,
            height: 228,
            borderRadius: 28,
            background: "linear-gradient(135deg, #ffffff, #f2f9ff)",
            border: "1px solid rgba(29,128,232,0.24)",
            boxShadow: `0 ${interpolate(attachment, [0, 1], [18, 34], clamp)}px 54px rgba(33,112,190,${interpolate(attachment, [0, 1], [0.1, 0.22], clamp)})`,
            opacity: ease(frame, 16, 38),
            transform: `translateY(${interpolate(attachment, [0, 1], [24, -10], clamp)}px) scale(${interpolate(attachment, [0, 1], [0.96, 1.02], clamp)})`,
          }}
        >
          <div style={{ position: "absolute", left: 30, top: 30, width: 58, height: 70, borderRadius: 14, background: "#e6f3ff", border: "1px solid rgba(29,128,232,0.22)" }}>
            <div style={{ position: "absolute", right: 0, top: 0, width: 22, height: 22, borderRadius: "0 14px 0 12px", background: "#b9ddff" }} />
          </div>
          <div style={{ position: "absolute", left: 110, top: 42, fontSize: 21, fontWeight: 820, color: "#172033" }}>{filename}</div>
          <div style={{ position: "absolute", left: 110, top: 76, width: 180, height: 10, borderRadius: 999, background: "rgba(39,94,150,0.12)" }} />
          <div style={{ position: "absolute", left: 110, top: 103, width: 242, height: 12, borderRadius: 999, background: "rgba(39,94,150,0.10)" }} />
          <div style={{ position: "absolute", left: 30, bottom: 30, right: 30, height: 48, borderRadius: 16, background: "#f7fbff", border: "1px solid rgba(104,148,198,0.14)" }}>
            <div style={{ position: "absolute", left: 18, top: 15, width: 190, height: 12, borderRadius: 999, background: "rgba(39,94,150,0.14)" }} />
            <div style={{ position: "absolute", right: 16, top: 10, width: 78, height: 28, borderRadius: 999, background: "#177ee8", color: "#fff", fontSize: 11, fontWeight: 820, display: "flex", alignItems: "center", justifyContent: "center" }}>Capture</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 68,
              width: interpolate(underline, [0, 1], [0, 194], clamp),
              height: 4,
              borderRadius: 999,
              background: "#177ee8",
              boxShadow: "0 0 22px rgba(23,126,232,0.42)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            right: 54,
            top: 136,
            width: 248,
            height: 292,
            borderRadius: 26,
            background: "#172033",
            color: "#fff",
            opacity: panel,
            transform: `translateX(${interpolate(panel, [0, 1], [48, 0], clamp)}px) scale(${interpolate(panel, [0, 1], [0.94, 1], clamp)})`,
            boxShadow: "0 26px 60px rgba(23,32,51,0.22)",
          }}
        >
          <div style={{ position: "absolute", left: 24, top: 24, fontSize: 15, fontWeight: 820 }}>AI extracted</div>
          <div style={{ position: "absolute", left: 24, top: 56, width: 132, height: 8, borderRadius: 999, background: "rgba(255,255,255,0.20)" }} />
          {extractedFields.map(([label, value], index) => {
            const item = ease(frame, 68 + index * 6, 88 + index * 6);
            return (
              <div
                key={label}
                style={{
                  position: "absolute",
                  left: 20,
                  right: 20,
                  top: 94 + index * 56,
                  height: 42,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.08)",
                  opacity: item,
                  transform: `translateY(${interpolate(item, [0, 1], [14, 0], clamp)}px)`,
                }}
              >
                <div style={{ position: "absolute", left: 14, top: 13, fontSize: 11, color: "rgba(255,255,255,0.58)", fontWeight: 720 }}>{label}</div>
                <div style={{ position: "absolute", right: 14, top: 12, fontSize: 13, color: "#ffffff", fontWeight: 820 }}>{value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: interpolate(cursor, [0, 1], [942, 762], clamp),
          top: interpolate(cursor, [0, 1], [308, 448], clamp),
          width: 0,
          height: 0,
          opacity: cursor,
          borderLeft: "24px solid #117ee8",
          borderTop: "15px solid transparent",
          borderBottom: "15px solid transparent",
          transform: `rotate(${interpolate(cursor, [0, 1], [-18, -8], clamp)}deg) scale(${interpolate(tap, [0, 1], [1, 0.92], clamp)})`,
          filter: "drop-shadow(0 12px 20px rgba(17,126,232,0.32))",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 720,
          top: 402,
          width: interpolate(tap, [0, 1], [0, 84], clamp),
          height: interpolate(tap, [0, 1], [0, 84], clamp),
          borderRadius: 999,
          border: "2px solid rgba(23,126,232,0.38)",
          opacity: interpolate(tap, [0, 1], [0.7, 0], clamp),
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 82,
          bottom: 54,
          width: 560,
          opacity: ease(frame, 60, 93),
          transform: `translateY(${interpolate(ease(frame, 60, 93), [0, 1], [20, 0], clamp)}px)`,
        }}
      >
        <div style={{ fontSize: 40, lineHeight: 1.05, fontWeight: 860, letterSpacing: 0 }}>{headline}</div>
      </div>
    </AbsoluteFill>
  );
};

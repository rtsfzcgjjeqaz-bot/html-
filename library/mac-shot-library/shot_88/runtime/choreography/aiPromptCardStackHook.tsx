import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SHOT_88_DURATION_FRAMES = 114;

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

type TaskCardProps = {
  label: string;
  index: number;
  progress: number;
  left: number;
  top: number;
  width: number;
  depth: number;
  active?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({
  label,
  index,
  progress,
  left,
  top,
  width,
  depth,
  active = false,
}) => {
  const y = interpolate(progress, [0, 1], [82 + index * 10, 0], clamp);
  const x = interpolate(progress, [0, 1], [index % 2 === 0 ? -24 : 24, 0], clamp);
  const scale = interpolate(progress, [0, 1], [0.84, 1 - depth * 0.025], clamp);
  const opacity = interpolate(progress, [0, 1], [0, active ? 1 : 0.9 - depth * 0.08], clamp);
  const rotate = interpolate(progress, [0, 1], [index % 2 === 0 ? -2.8 : 2.8, 0], clamp);

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height: active ? 76 : 68,
        opacity,
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
        borderRadius: 14,
        background: active
          ? "linear-gradient(100deg, rgba(62,112,255,0.98), rgba(42,88,224,0.95))"
          : "rgba(238,245,255,0.94)",
        border: active
          ? "1px solid rgba(193,211,255,0.36)"
          : "1px solid rgba(255,255,255,0.62)",
        boxShadow: active
          ? "0 0 42px rgba(66,108,255,0.46), 0 26px 62px rgba(0,0,0,0.36)"
          : "0 18px 44px rgba(0,0,0,0.26)",
        color: active ? "#f8fbff" : "#25314d",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 14,
          width: 22,
          height: 22,
          borderRadius: 999,
          background: active ? "rgba(255,255,255,0.22)" : "rgba(70,104,226,0.12)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 16,
          fontSize: active ? 20 : 18,
          fontWeight: 780,
          letterSpacing: 0,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          right: 16,
          top: 18,
          width: 18,
          height: 18,
          borderRadius: 999,
          border: active ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(50,65,105,0.22)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 48,
          right: 62,
          bottom: 16,
          height: 5,
          borderRadius: 99,
          background: active ? "rgba(255,255,255,0.22)" : "rgba(74,86,122,0.12)",
        }}
      />
    </div>
  );
};

export const Shot88AiPromptCardStackHookChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const glow = ease(frame, 0, 24);
  const title = ease(frame, 8, 34);
  const stackFlow = ease(frame, 16, 74);
  const prompt = ease(frame, 62, 96);
  const settle = ease(frame, 86, SHOT_88_DURATION_FRAMES);

  const stageScale = interpolate(settle, [0, 1], [1.012, 1], clamp);
  const cardCenterX = width / 2 - 280;
  const taskCards = [
    { label: "Generate Audit Report", left: cardCenterX + 74, top: 204, width: 420, depth: 5 },
    { label: "Reconcile Vendor Bills", left: cardCenterX + 42, top: 244, width: 470, depth: 4 },
    { label: "Create Purchase", left: cardCenterX + 10, top: 286, width: 522, depth: 3 },
    { label: "Send Reminder", left: cardCenterX - 24, top: 328, width: 576, depth: 2 },
    { label: "File GSTR-1", left: cardCenterX - 58, top: 370, width: 632, depth: 1 },
    { label: "Approve Ledger Entry", left: cardCenterX - 88, top: 414, width: 692, depth: 0, active: true },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#030715",
        color: "#f7faff",
        overflow: "hidden",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 24%, rgba(70,104,255,0.48), transparent 28%), radial-gradient(circle at 72% 58%, rgba(40,83,214,0.24), transparent 32%), linear-gradient(180deg, #071437 0%, #030715 100%)",
          opacity: interpolate(glow, [0, 1], [0.52, 1], clamp),
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width / 2 - 460,
          top: height / 2 - 230,
          width: 920,
          height: 460,
          opacity: 0.36,
          transform: `scale(${interpolate(glow, [0, 1], [1.18, 1], clamp)})`,
          background:
            "radial-gradient(ellipse at center, rgba(71,111,255,0.42), rgba(31,66,184,0.12) 45%, transparent 72%)",
          filter: "blur(24px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 78,
          width: "100%",
          textAlign: "center",
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [18, 0], clamp)}px)`,
          fontSize: 42,
          fontWeight: 860,
          letterSpacing: 0,
        }}
      >
        Kitaabh's <span style={{ color: "#8db0ff" }}>Ai Prompt</span>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: width / 2 + 166,
          top: 78,
          opacity: title,
          transform: `scale(${interpolate(title, [0, 1], [0.7, 1], clamp)}) rotate(18deg)`,
          color: "#dce8ff",
          fontSize: 28,
          fontWeight: 900,
          textShadow: "0 0 24px rgba(167,192,255,0.9)",
        }}
      >
        +
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          transform: `scale(${stageScale})`,
          transformOrigin: "50% 58%",
        }}
      >
        {taskCards.map((card, index) => {
          const cardProgress = ease(frame, 18 + index * 7, 52 + index * 8);
          const flowLift = interpolate(stackFlow, [0, 1], [10 - index * 2, 0], clamp);

          return (
            <div
              key={card.label}
              style={{
                position: "absolute",
                transform: `translateY(${flowLift}px)`,
                zIndex: index + 1,
              }}
            >
              <TaskCard
                label={card.label}
                index={index}
                progress={cardProgress}
                left={card.left}
                top={card.top}
                width={card.width}
                depth={card.depth}
                active={card.active}
              />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: width / 2 - 302,
            top: 548,
            width: 604,
            height: 42,
            opacity: prompt,
            transform: `translateY(${interpolate(prompt, [0, 1], [16, 0], clamp)})`,
            borderRadius: 999,
            background: "rgba(3,8,22,0.92)",
            border: "1px solid rgba(155,180,255,0.34)",
            boxShadow: "0 0 28px rgba(70,110,255,0.34)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
            color: "rgba(238,244,255,0.86)",
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#a9beff" }}>Write a prompt.</span>
          <span style={{ opacity: 0.58 }}>Your words into actions</span>
          <span
            style={{
              marginLeft: "auto",
              width: 54,
              height: 24,
              borderRadius: 99,
              background: "rgba(68,111,255,0.88)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#f9fbff",
            }}
          >
            Run
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 46,
          width: "100%",
          textAlign: "center",
          opacity: interpolate(prompt, [0, 1], [0, 0.72], clamp),
          fontSize: 15,
          fontWeight: 650,
          color: "rgba(235,241,255,0.72)",
        }}
      >
        AI prompts turn workflow intent into ready-to-run business actions
      </div>
    </AbsoluteFill>
  );
};

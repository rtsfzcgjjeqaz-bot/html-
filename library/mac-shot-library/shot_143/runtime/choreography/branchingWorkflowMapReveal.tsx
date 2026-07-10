import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { shot143Ease } from "../shot_143/shot143-atomic-motions";

export const SHOT_143_DURATION_FRAMES = 114;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  parent?: string;
  active?: boolean;
};

const nodes: Node[] = [
  { id: "start", label: "Input", x: 154, y: 220, active: true },
  { id: "parse", label: "Parse", x: 356, y: 132, parent: "start", active: true },
  { id: "policy", label: "Policy", x: 356, y: 308, parent: "start" },
  { id: "route", label: "Route", x: 590, y: 132, parent: "parse", active: true },
  { id: "score", label: "Score", x: 590, y: 252, parent: "policy" },
  { id: "review", label: "Review", x: 814, y: 92, parent: "route", active: true },
  { id: "tool", label: "Tool", x: 814, y: 212, parent: "route" },
  { id: "notify", label: "Notify", x: 814, y: 332, parent: "score" },
  { id: "done", label: "Done", x: 1036, y: 212, parent: "tool", active: true },
];

export const Shot143BranchingWorkflowMapRevealChoreography: React.FC = () => {
  const frame = useCurrentFrame();
  const shell = shot143Ease({ frame, startFrame: 0, endFrame: 22 });
  const lines = shot143Ease({ frame, startFrame: 10, endFrame: 56 });
  const nodesIn = shot143Ease({ frame, startFrame: 18, endFrame: 78 });
  const active = shot143Ease({ frame, startFrame: 26, endFrame: 72 });
  const hold = shot143Ease({ frame, startFrame: 90, endFrame: 114 });
  const drift = interpolate(hold, [0, 1], [0, -10], clamp);

  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));

  return (
    <AbsoluteFill
      style={{
        background: "#f7fbff",
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
            "radial-gradient(circle at 22% 30%, rgba(34,110,234,0.12), transparent 28%), radial-gradient(circle at 78% 38%, rgba(54,197,232,0.10), transparent 24%), linear-gradient(180deg,#ffffff 0%,#eef7ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80 + drift,
          top: 92,
          width: 1120,
          height: 520,
          borderRadius: 34,
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(34,110,234,0.10)",
          boxShadow: "0 34px 110px rgba(39,74,124,0.11)",
          opacity: shell,
          transform: `translateY(${interpolate(shell, [0, 1], [28, 0], clamp)}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 34, top: 28, fontSize: 28, fontWeight: 900 }}>
          Workflow Map
        </div>
        <div style={{ position: "absolute", left: 34, top: 72, width: 220, height: 10, borderRadius: 999, background: "rgba(17,24,39,0.10)" }} />

        <svg
          width="1120"
          height="520"
          viewBox="0 0 1120 520"
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {nodes
            .filter((node) => node.parent)
            .map((node, index) => {
              const parent = byId[node.parent!];
              const reveal = shot143Ease({ frame, startFrame: 12 + index * 4, endFrame: 34 + index * 5 });
              const midX = (parent.x + node.x) / 2;
              const path = `M ${parent.x} ${parent.y} C ${midX} ${parent.y}, ${midX} ${node.y}, ${node.x} ${node.y}`;
              return (
                <path
                  key={`${node.parent}-${node.id}`}
                  d={path}
                  fill="none"
                  stroke={node.active ? "#226eea" : "rgba(34,110,234,0.22)"}
                  strokeWidth={node.active ? 5 : 3}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - lines * reveal}
                />
              );
            })}
        </svg>

        {nodes.map((node, index) => {
          const reveal = shot143Ease({ frame, startFrame: 20 + index * 4, endFrame: 42 + index * 5 });
          const pulseScale = node.active
            ? interpolate(active, [0, 0.6, 1], [1, 1.08, 1.02], clamp)
            : 1;
          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: node.x - 64,
                top: node.y - 28,
                width: 128,
                height: 56,
                borderRadius: 999,
                background: node.active ? "#226eea" : "#ffffff",
                color: node.active ? "#ffffff" : "#1f2937",
                border: node.active ? "1px solid rgba(34,110,234,0.50)" : "1px solid rgba(17,24,39,0.08)",
                boxShadow: node.active ? "0 18px 48px rgba(34,110,234,0.22)" : "0 14px 34px rgba(39,74,124,0.08)",
                opacity: nodesIn * reveal,
                transform: `translateY(${interpolate(reveal, [0, 1], [14, 0], clamp)}px) scale(${pulseScale})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 820,
              }}
            >
              {node.label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};


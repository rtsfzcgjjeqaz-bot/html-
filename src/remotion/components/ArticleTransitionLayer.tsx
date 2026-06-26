import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { ArticleTransitionPlanBoundary } from "../articleTransitionContract";

export const ArticleTransitionLayer: React.FC<{ boundaries: ArticleTransitionPlanBoundary[] }> = ({ boundaries }) => {
  const frame = useCurrentFrame();
  const active = boundaries.find(
    (boundary) => frame >= boundary.transitionStartFrame && frame <= boundary.transitionEndFrame,
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 74% 26%, rgba(37,99,235,.12), transparent 32%), radial-gradient(circle at 18% 78%, rgba(20,184,166,.08), transparent 30%)",
          opacity: 0.5,
        }}
      />
      {active ? <TransitionBridge boundary={active} frame={frame} /> : null}
    </AbsoluteFill>
  );
};

const TransitionBridge: React.FC<{ boundary: ArticleTransitionPlanBoundary; frame: number }> = ({ boundary, frame }) => {
  const progress = interpolate(frame, [boundary.transitionStartFrame, boundary.transitionEndFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = boundary.direction === "right_panel_handoff" ? 840 : 720;
  const y = boundary.direction === "right_panel_handoff" ? 500 : 580;
  const width = interpolate(progress, [0, 1], [180, 520]);
  const opacity = interpolate(progress, [0, 0.18, 0.82, 1], [0, 0.78, 0.78, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: 10,
        borderRadius: 999,
        opacity,
        background:
          boundary.transitionId === "evidence_to_rail_bridge"
            ? "linear-gradient(90deg, rgba(251,191,36,.92), rgba(79,70,229,.74), rgba(20,184,166,.74))"
            : "linear-gradient(90deg, rgba(79,70,229,.80), rgba(47,128,237,.82), rgba(34,160,107,.78))",
        boxShadow: "0 18px 54px rgba(37,99,235,.18)",
        transform: `translateX(${interpolate(progress, [0, 1], [-80, 120])}px)`,
      }}
    />
  );
};

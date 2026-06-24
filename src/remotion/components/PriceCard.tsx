import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, layout } from "../../design/tokens";
import { SafeText } from "./SafeText";

type PriceCardProps = {
  label: string;
  accent?: string;
  index: number;
  variant?: number;
};

const compact = (value: string) => (value.length > 28 ? value.slice(0, 28).trim() : value);

export const PriceCard: React.FC<PriceCardProps> = ({ label, accent = colors.accentBlue, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - index * 6, fps, config: { damping: 18, stiffness: 125 } });
  const bar = interpolate(enter, [0, 1], [8, 82 - index * 12]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: 104,
        boxSizing: "border-box",
        borderRadius: layout.radiusMd,
        padding: "18px 20px",
        background: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: layout.subtleShadow,
        transform: `translate3d(0, ${(1 - enter) * 30}px, 260px)`,
        opacity: enter,
      }}
    >
      <SafeText role="caption" tone="tertiary" maxLines={1} maxWidth={230}>Price signal</SafeText>
      <div style={{ marginTop: 8 }}><SafeText role="body" tone="primary" maxLines={1} maxWidth={230}>{compact(label)}</SafeText></div>
      <div style={{ height: 8, marginTop: 14, borderRadius: 999, background: "rgba(17,24,39,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${bar}%`, height: "100%", borderRadius: 999, background: accent }} />
      </div>
    </div>
  );
};

import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, layout } from "../../design/tokens";
import { SafeText } from "./SafeText";

type DataCardProps = {
  label: string;
  index: number;
  accent?: string;
};

const compact = (value: string) => (value.length > 34 ? value.slice(0, 34).trim() : value);

export const DataCard: React.FC<DataCardProps> = ({ label, index, accent = colors.accentBlue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - index * 5, fps, config: { damping: 20, stiffness: 120 } });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 104,
        boxSizing: "border-box",
        borderRadius: layout.radiusMd,
        padding: "16px 20px",
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderTop: `3px solid ${accent}`,
        boxShadow: layout.subtleShadow,
        transform: `translate3d(0, ${(1 - enter) * 32}px, 0)`,
        opacity: enter,
      }}
    >
      <SafeText role="micro" tone="accent" maxLines={1} maxWidth={280} style={{ textTransform: "uppercase", letterSpacing: 1.2 }}>
        Signal {index + 1}
      </SafeText>
      <div style={{ marginTop: 10 }}>
        <SafeText role="body" tone="primary" maxLines={1} maxWidth={280}>{compact(label)}</SafeText>
      </div>
    </div>
  );
};

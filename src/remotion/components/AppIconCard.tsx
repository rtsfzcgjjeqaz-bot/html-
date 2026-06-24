import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, layout } from "../../design/tokens";
import { SafeText } from "./SafeText";

type AppIconCardProps = {
  label: string;
  accent?: string;
  index: number;
  iconSrc?: string;
};

const compact = (value: string) => (value.length > 18 ? value.slice(0, 18).trim() : value);

const toBrowserSrc = (value?: string) => {
  if (!value) return undefined;
  if (/^(https?:|file:|data:)/.test(value)) return value;
  if (value.startsWith("generated/")) return staticFile(value);
  return value;
};

export const AppIconCard: React.FC<AppIconCardProps> = ({ label, accent = colors.accentBlue, index, iconSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - index * 5, fps, config: { damping: 18, stiffness: 125 } });
  const initial = label.trim().charAt(0).toUpperCase() || "A";
  const resolvedIconSrc = toBrowserSrc(iconSrc);

  return (
    <div
      style={{
        width: 170,
        height: 170,
        borderRadius: layout.radiusLg,
        background: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: layout.subtleShadow,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: enter,
        transform: `translate3d(0, ${(1 - enter) * 50}px, ${220 + index * 22}px)`,
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          background: `linear-gradient(135deg, ${accent}, ${colors.accentCyan})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {resolvedIconSrc ? (
          <Img src={resolvedIconSrc} style={{ width: 58, height: 58, borderRadius: 18, objectFit: "cover" }} />
        ) : (
          <SafeText role="subtitle" tone="primary" maxLines={1} maxWidth={40}>{initial}</SafeText>
        )}
      </div>
      <SafeText role="caption" tone="primary" maxLines={2} maxWidth={132} style={{ textAlign: "center" }}>{compact(label)}</SafeText>
    </div>
  );
};

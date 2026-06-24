import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../../design/tokens";
import { SafeText } from "./SafeText";

type BarChartRaceProps = {
  items: string[];
  accent?: string;
  variant?: number;
};

const compact = (value: string) => (value.length > 22 ? value.slice(0, 22).trim() : value);

export const BarChartRace: React.FC<BarChartRaceProps> = ({ items, accent = colors.accentBlue, variant = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const safeItems = (items.length ? items : ["Country", "Service", "Price gap", "AI route"]).slice(0, 4);

  return (
    <div style={{ width: 620, display: "flex", flexDirection: "column", gap: 20 }}>
      {safeItems.map((item, index) => {
        const enter = spring({ frame: frame - index * 6, fps, config: { damping: 19, stiffness: 115 } });
        const target = 46 + ((index * 15 + variant * 11) % 38);
        const width = interpolate(enter, [0, 1], [10, target]);
        return (
          <div key={`${item}-${index}`} style={{ display: "grid", gridTemplateColumns: "150px 1fr 54px", alignItems: "center", gap: 18 }}>
            <SafeText role="caption" tone="primary" maxLines={1} maxWidth={150}>{compact(item)}</SafeText>
            <div style={{ height: 24, borderRadius: 999, background: "rgba(17,24,39,.08)", overflow: "hidden" }}>
              <div style={{ width: `${width}%`, height: "100%", borderRadius: 999, background: accent }} />
            </div>
            <SafeText role="caption" tone="tertiary" maxLines={1} maxWidth={54}>{Math.round(width)}%</SafeText>
          </div>
        );
      })}
    </div>
  );
};

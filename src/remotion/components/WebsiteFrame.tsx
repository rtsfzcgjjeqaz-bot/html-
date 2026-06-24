import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, layout } from "../../design/tokens";

type WebsiteFrameProps = {
  src?: string;
  accent?: string;
  variant?: number;
  width?: number;
  height?: number;
};

export const WebsiteFrame: React.FC<WebsiteFrameProps> = ({ src, accent = colors.accentBlue, variant = 0, width = 900, height = 560 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 3, fps, config: { damping: 20, stiffness: 110 } });
  const float = Math.sin(frame / 44 + variant) * 5;
  const rotateY = interpolate(enter, [0, 1], [variant % 2 ? -10 : 10, variant % 2 ? 3 : -3]);
  const rotateX = interpolate(enter, [0, 1], [5, 1]);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: layout.radiusLg,
        overflow: "hidden",
        background: "#F8FAFC",
        border: `1px solid ${colors.line}`,
        boxShadow: layout.shadow,
        transformStyle: "preserve-3d",
        transform: `translate3d(${(1 - enter) * 46}px, ${float}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      <div
        style={{
          height: 42,
          background: "linear-gradient(180deg, #ffffff, #EEF2F7)",
          borderBottom: `1px solid ${colors.line}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingLeft: 18,
        }}
      >
        {[0, 1, 2].map((dot) => (
          <span key={dot} style={{ width: 10, height: 10, borderRadius: 10, background: dot === 0 ? accent : "rgba(17,24,39,.18)" }} />
        ))}
        <div style={{ width: 300, height: 14, borderRadius: 20, background: "rgba(17,24,39,.08)", marginLeft: 12 }} />
      </div>
      {src ? (
        <Img src={src} style={{ width: "100%", height: height - 42, objectFit: "cover", filter: "saturate(.94) contrast(.98)" }} />
      ) : (
        <div style={{ width: "100%", height: height - 42, background: `linear-gradient(135deg, ${accent}20, #ffffff)` }} />
      )}
    </div>
  );
};

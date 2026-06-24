import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, isRegionInsideSafeArea, isSemanticRole, layout, type Region, type SemanticRole } from "../../design/designTokens";

type SemanticShapeProps = {
  semanticRole?: SemanticRole;
  targetRegion?: Region;
  accent?: string;
  delay?: number;
};

const roleStyles: Record<SemanticRole, React.CSSProperties> = {
  connector: { borderTopWidth: 3, borderTopStyle: "solid" },
  focusMarker: { borderWidth: 3, borderStyle: "solid" },
  highlightBox: { borderWidth: 2, borderStyle: "solid", background: "rgba(255,255,255,0.14)" },
  stepLine: { borderLeftWidth: 4, borderLeftStyle: "solid" },
  chartGuide: { borderTopWidth: 2, borderTopStyle: "dashed" },
  priceDeltaArrow: { borderTopWidth: 5, borderTopStyle: "solid" },
};

export const SemanticShape: React.FC<SemanticShapeProps> = ({ semanticRole, targetRegion, accent = colors.accentBlue, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!semanticRole || !targetRegion) return null;
  if (!isSemanticRole(semanticRole)) return null;
  if (!isRegionInsideSafeArea(targetRegion)) return null;

  const enter = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 120 } });
  const opacity = interpolate(enter, [0, 1], [0, 0.72]);
  const roleStyle = roleStyles[semanticRole];

  if (semanticRole === "priceDeltaArrow") {
    return (
      <div
        data-semantic-shape="true"
        data-semantic-role={semanticRole}
        style={{
          position: "absolute",
          left: targetRegion.x,
          top: targetRegion.y + targetRegion.height / 2,
          width: targetRegion.width,
          height: 0,
          borderColor: accent,
          opacity,
          transform: `scaleX(${enter})`,
          transformOrigin: "left center",
          ...roleStyle,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -2,
            top: -10,
            width: 18,
            height: 18,
            borderRight: `5px solid ${accent}`,
            borderTop: `5px solid ${accent}`,
            transform: "rotate(45deg)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      data-semantic-shape="true"
      data-semantic-role={semanticRole}
      style={{
        position: "absolute",
        left: targetRegion.x,
        top: targetRegion.y,
        width: targetRegion.width,
        height: targetRegion.height,
        borderColor: accent,
        borderRadius: semanticRole === "focusMarker" ? 999 : layout.radiusMd,
        opacity,
        transform: `scale(${0.96 + enter * 0.04})`,
        transformOrigin: "center",
        pointerEvents: "none",
        ...roleStyle,
      }}
    />
  );
};

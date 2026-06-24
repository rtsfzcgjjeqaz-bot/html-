import React from "react";
import { colors } from "../../design/tokens";

type SceneBackgroundProps = {
  src?: string;
  accent?: string;
  variant?: number;
};

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ accent = colors.accentBlue, variant = 0 }) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            variant % 3 === 0
              ? `linear-gradient(135deg, ${colors.bgA}, ${colors.bgB} 58%, ${accent}14)`
              : variant % 3 === 1
                ? `linear-gradient(120deg, #FFF9F0, #F4F8FB 62%, ${accent}12)`
                : `linear-gradient(140deg, ${colors.bgC}, #EFF8FB 54%, ${accent}10)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 90,
          width: 1640,
          height: 900,
          borderRadius: 48,
          background: "linear-gradient(135deg, rgba(255,255,255,.68), rgba(255,255,255,.24))",
          border: `1px solid ${colors.border}`,
        }}
      />
    </>
  );
};

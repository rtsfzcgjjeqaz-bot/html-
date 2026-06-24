import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, safeArea } from "../../design/tokens";
import { SafeText } from "./SafeText";

type AnimatedTextProps = {
  lines: string[];
  accent?: string;
  variant?: number;
  mode?: "hero" | "title" | "compact";
};

const limitText = (value: string, max = 42) => {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trim() : clean;
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ lines, accent = colors.accentBlue, mode = "title" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const safeLines = lines.slice(0, 2).map((line, index) => limitText(line, index === 0 ? 36 : 48));
  const primaryRole = mode === "hero" ? "hero" : mode === "compact" ? "subtitle" : "title";
  const secondaryRole = mode === "hero" ? "subtitle" : "body";

  return (
    <div style={{ maxWidth: mode === "hero" ? safeArea.titleMaxWidth : 640 }}>
      {safeLines.map((line, index) => {
        const enter = spring({ frame: frame - index * 5, fps, config: { damping: 18, stiffness: 140 } });
        const y = interpolate(enter, [0, 1], [34, 0]);
        return (
          <div key={`${line}-${index}`} style={{ marginTop: index === 0 ? 0 : 18, opacity: enter, transform: `translate3d(0, ${y}px, 180px)` }}>
            {index === 0 ? (
              <SafeText role={primaryRole} tone="primary" maxLines={2} maxWidth={mode === "hero" ? safeArea.titleMaxWidth : 640}>
                {line}
              </SafeText>
            ) : (
              <div style={{ borderLeft: `5px solid ${accent}`, paddingLeft: 16 }}>
                <SafeText role={secondaryRole} tone="secondary" maxLines={2} maxWidth={mode === "hero" ? safeArea.bodyMaxWidth : 620}>
                  {line}
                </SafeText>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

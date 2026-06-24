import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { colors, safeArea } from "../../design/tokens";
import { CameraRig } from "./CameraRig";
import { DataCard } from "./DataCard";
import { DepthLayer } from "./DepthLayer";
import { SafeText } from "./SafeText";
import { SceneBackground } from "./SceneBackground";
import { SemanticShape } from "./SemanticShape";
import { WebsiteFrame } from "./WebsiteFrame";

type CoverProps = {
  title: string;
  subtitle?: string;
  imageSrc?: string;
};

const toBrowserSrc = (value?: string) => {
  if (!value) return undefined;
  if (/^(https?:|file:|data:)/.test(value)) return value;
  if (value.startsWith("generated/")) return staticFile(value);
  if (/^[A-Za-z]:\\/.test(value)) return `file:///${value.replace(/\\/g, "/")}`;
  return value;
};

export const Cover: React.FC<CoverProps> = ({ title, subtitle, imageSrc }) => {
  const accent = colors.accentBlue;
  const src = toBrowserSrc(imageSrc);
  const cards = [subtitle || "Price intelligence", "Global comparison", "AI decision"].slice(0, 3);

  return (
    <AbsoluteFill
      style={{
        color: colors.textPrimary,
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
        overflow: "hidden",
      }}
    >
      <SceneBackground accent={accent} variant={2} />
      <CameraRig variant={4} durationFrames={30}>
        <DepthLayer zDepth={-360} parallaxSpeed={0.35} style={{ left: 780, top: 164 }}>
          <WebsiteFrame src={src} accent={accent} variant={2} width={840} height={550} />
        </DepthLayer>
        <DepthLayer zDepth={280} parallaxSpeed={1.15} style={{ left: safeArea.left, top: 170, width: safeArea.titleMaxWidth }}>
          <SafeText role="hero" tone="primary" maxLines={2} maxWidth={safeArea.titleMaxWidth}>{title}</SafeText>
          {subtitle ? <div style={{ marginTop: 28 }}><SafeText role="subtitle" tone="accent" maxLines={2} maxWidth={safeArea.bodyMaxWidth}>{subtitle}</SafeText></div> : null}
        </DepthLayer>
        <DepthLayer zDepth={430} parallaxSpeed={1.55} style={{ left: safeArea.left, top: 650, display: "flex", gap: 18 }}>
          {cards.map((card, index) => (
            <DataCard key={`${card}-${index}`} label={card} index={index} accent={accent} />
          ))}
        </DepthLayer>
        <SemanticShape semanticRole="focusMarker" targetRegion={{ x: 1010, y: 250, width: 360, height: 260 }} accent={accent} />
      </CameraRig>
    </AbsoluteFill>
  );
};

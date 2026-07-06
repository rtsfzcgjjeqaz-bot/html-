import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { shot139Ease } from "../shot_139/shot139-atomic-motions";

export const SHOT_139_DURATION_FRAMES = 71;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

type ProviderNode = {
  label: string;
  x: number;
  y: number;
  featured?: boolean;
};

type Props = {
  hubLabel?: string;
  providers?: ProviderNode[];
};

export const Shot139AiProviderEcosystemOrbitChoreography: React.FC<Props> = ({
  hubLabel = "AI",
  providers = [
    { label: "Open Model", x: -252, y: -110 },
    { label: "Knowledge", x: -208, y: 112 },
    { label: "Tools", x: 212, y: -124, featured: true },
    { label: "Search", x: 264, y: 36 },
    { label: "Workflow", x: 24, y: 176 },
    { label: "Memory", x: 0, y: -188 },
  ],
}) => {
  const frame = useCurrentFrame();
  const bloom = shot139Ease({ frame, startFrame: 0, endFrame: 22 });
  const rails = shot139Ease({ frame, startFrame: 10, endFrame: 38 });
  const nodes = shot139Ease({ frame, startFrame: 20, endFrame: 56 });
  const pulse = shot139Ease({ frame, startFrame: 38, endFrame: 62 });
  const settle = shot139Ease({ frame, startFrame: 54, endFrame: 71 });

  return (
    <AbsoluteFill
      style={{
        background: "#f7fbff",
        overflow: "hidden",
        color: "#111827",
        fontFamily: "Inter, Avenir Next, SF Pro Display, Arial, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 44%, rgba(34,110,234,0.16), transparent 24%), radial-gradient(circle at 68% 30%, rgba(32,190,156,0.10), transparent 18%), linear-gradient(180deg,#ffffff 0%,#eef7ff 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 196,
          height: 196,
          marginLeft: -98,
          marginTop: -98,
          borderRadius: 999,
          background: "radial-gradient(circle at 30% 28%, #68d5ff 0%, #226eea 48%, #2148c8 100%)",
          boxShadow: `0 24px 88px rgba(34,110,234,${interpolate(bloom, [0, 1], [0.08, 0.28], clamp)})`,
          opacity: 0.16 + bloom * 0.84,
          transform: `scale(${interpolate(bloom, [0, 1], [0.72, 1], clamp)}) scale(${interpolate(settle, [0, 1], [1.02, 1], clamp)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 136,
            height: 136,
            borderRadius: 999,
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.24)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: 0,
          }}
        >
          {hubLabel}
        </div>
      </div>

      {providers.map((provider, index) => {
        const nodeIn = shot139Ease({
          frame,
          startFrame: 18 + index * 4,
          endFrame: 40 + index * 4,
        });
        const lineWidth = Math.sqrt(provider.x * provider.x + provider.y * provider.y) - 104;
        const angle = (Math.atan2(provider.y, provider.x) * 180) / Math.PI;
        const pulseScale = provider.featured
          ? interpolate(pulse, [0, 0.6, 1], [1, 1.08, 1.02], clamp)
          : 1;

        return (
          <React.Fragment key={provider.label}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: lineWidth,
                height: 2,
                marginLeft: 0,
                marginTop: -1,
                transformOrigin: "0 50%",
                transform: `rotate(${angle}deg) scaleX(${rails * nodeIn})`,
                background:
                  "linear-gradient(90deg, rgba(34,110,234,0.42), rgba(34,110,234,0.06))",
                opacity: 0.32 + nodeIn * 0.68,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `calc(50% + ${provider.x}px - 76px)`,
                top: `calc(50% + ${provider.y}px - 28px)`,
                width: 152,
                height: 56,
                borderRadius: 999,
                background: provider.featured ? "#226eea" : "rgba(255,255,255,0.88)",
                color: provider.featured ? "#ffffff" : "#1f2937",
                border: provider.featured
                  ? "1px solid rgba(34,110,234,0.62)"
                  : "1px solid rgba(34,110,234,0.12)",
                boxShadow: provider.featured
                  ? "0 18px 48px rgba(34,110,234,0.22)"
                  : "0 16px 40px rgba(42,73,128,0.10)",
                opacity: nodeIn,
                transform: `translateY(${interpolate(nodeIn, [0, 1], [18, 0], clamp)}px) scale(${pulseScale})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 820,
              }}
            >
              {provider.label}
            </div>
          </React.Fragment>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 430,
          right: 430,
          bottom: 88,
          height: 8,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, rgba(34,110,234,0), rgba(34,110,234,0.30), rgba(32,190,156,0))",
          opacity: interpolate(settle, [0, 1], [0.46, 0.32], clamp),
        }}
      />
    </AbsoluteFill>
  );
};


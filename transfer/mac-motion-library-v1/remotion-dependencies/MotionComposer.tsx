import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { resolveChoreography } from "../../motion/choreographyRegistry";
import { HighlightBoxReveal, resolveMotionPreset } from "../../motion/presets";
import { colors, fontFamily, layout } from "../styles/tokens";
import type { DirectorScene } from "./SceneRenderer";

type MotionComposerProps = {
  choreographyId: string;
  scene: DirectorScene;
};

const defaultFeatures = ["Clear hierarchy", "Reusable motion", "Safe layout"];

export const MotionComposer: React.FC<MotionComposerProps> = ({ choreographyId, scene }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const choreography = resolveChoreography(choreographyId);

  if (!choreography) {
    return (
      <div style={{ color: colors.textPrimary, fontFamily, fontSize: 32 }}>
        Unknown choreography: {choreographyId}
      </div>
    );
  }

  if (choreography.Component) {
    const ChoreographyComponent = choreography.Component;
    return <ChoreographyComponent scene={scene} />;
  }

  const missingPreset = choreography.animationTracks?.find((track) => !resolveMotionPreset(track.motionId));
  if (missingPreset) {
    return (
      <div style={{ color: colors.redAccent, fontFamily, fontSize: 32 }}>
        Missing motion preset: {missingPreset.motionId}
      </div>
    );
  }

  const totalFrames = Math.max(1, Math.round((scene.duration || 4) * fps));
  const safeArea = { left: layout.safeX, right: layout.safeX, top: layout.safeY, bottom: layout.safeY };
  const highlightBounds = {
    x: width * 0.48,
    y: height * 0.47,
    width: width * 0.22,
    height: height * 0.13,
  };
  if (!choreography.compose) {
    return (
      <div style={{ color: colors.redAccent, fontFamily, fontSize: 32 }}>
        Missing choreography implementation: {choreographyId}
      </div>
    );
  }

  const motion = choreography.compose({
    frame,
    fps,
    startFrame: 0,
    endFrame: totalFrames,
    totalFrames,
    safeArea,
    highlightBounds,
  }) as any;
  const featureItems = (scene.components?.length ? scene.components : defaultFeatures).slice(0, 3);
  const subtitle = scene.purpose || scene.visual_behavior || "Reusable website hero motion";
  const screenRows = (scene.data_points?.length ? scene.data_points : [
    { label: "Hero", value: "Landing page" },
    { label: "Focus", value: "Feature highlight" },
    { label: "CTA", value: "Ready for review" },
  ]).slice(0, 4);
  const progress = interpolate(frame, [0, totalFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "linear-gradient(135deg, #fbfdff 0%, #eef5ff 54%, #f7fffb 100%)",
        fontFamily,
        perspective: 1400,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          ...motion.background,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: width * 0.08,
            top: height * 0.1,
            width: width * 0.42,
            height: height * 0.42,
            background: "radial-gradient(circle, rgba(47,128,237,0.16), transparent 68%)",
            filter: "blur(8px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: width * 0.08,
            bottom: height * 0.1,
            width: width * 0.36,
            height: height * 0.36,
            background: "radial-gradient(circle, rgba(34,160,107,0.12), transparent 68%)",
            filter: "blur(8px)",
          }}
        />
      </div>

      <div style={{ position: "absolute", inset: 0, ...motion.camera }}>
        <div
          style={{
            position: "absolute",
            left: safeArea.left,
            top: safeArea.top,
            width: width * 0.38,
            maxWidth: width - safeArea.left - safeArea.right,
            ...motion.title,
          }}
        >
          <div
            style={{
              color: colors.blueAccent,
              fontSize: 18,
              fontWeight: 900,
              letterSpacing: 0,
              marginBottom: 12,
            }}
          >
            MOTION CATALOG
          </div>
          <div
            style={{
              color: colors.textPrimary,
              fontSize: 42,
              fontWeight: 900,
              lineHeight: 1.06,
              letterSpacing: 0,
            }}
          >
            {scene.text}
          </div>
          <div
            style={{
              color: colors.textSecondary,
              fontSize: 20,
              fontWeight: 650,
              lineHeight: 1.24,
              marginTop: 18,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: safeArea.right,
            top: height * 0.22,
            width: width * 0.52,
            height: height * 0.52,
            ...motion.website,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 30,
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(23,32,42,0.08)",
              boxShadow: "0 40px 110px rgba(20,32,48,0.16)",
              overflow: "hidden",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                height: 46,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 22px",
                background: "linear-gradient(180deg,#ffffff,#eef5f8)",
                borderBottom: "1px solid rgba(23,32,42,0.08)",
              }}
            >
              {["#E05A47", "#F59E42", "#22A06B"].map((color) => (
                <div key={color} style={{ width: 12, height: 12, borderRadius: 12, background: color }} />
              ))}
              <div style={{ marginLeft: 18, width: 230, height: 20, borderRadius: 999, background: "#e8eef8" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", height: "calc(100% - 46px)" }}>
              <div style={{ padding: 18, borderRight: "1px solid rgba(23,32,42,0.07)", background: "#fbfdff" }}>
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    style={{
                      height: 28,
                      marginBottom: 12,
                      borderRadius: 8,
                      background: item === 1 ? "#dce8ff" : "#eef3f8",
                    }}
                  />
                ))}
              </div>
              <div style={{ padding: 22, position: "relative" }}>
                {screenRows.map((row, index) => (
                  <div
                    key={`${row.label}-${index}`}
                    style={{
                      height: 44,
                      display: "grid",
                      gridTemplateColumns: "1fr 0.7fr",
                      alignItems: "center",
                      borderBottom: "1px solid rgba(23,32,42,0.07)",
                      color: colors.textPrimary,
                      fontSize: 14,
                      fontWeight: 700,
                      opacity: 0.62 + index * 0.08,
                    }}
                  >
                    <span>{row.label}</span>
                    <span style={{ color: colors.blueAccent }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <HighlightBoxReveal
          frame={frame}
          fps={fps}
          startFrame={Math.round(totalFrames * 0.4)}
          endFrame={Math.round(totalFrames * 0.62)}
          bounds={highlightBounds}
          safeArea={safeArea}
        />

        <div
          style={{
            position: "absolute",
            right: safeArea.right + 16,
            bottom: safeArea.bottom,
            display: "flex",
            gap: 14,
            ...motion.settle,
          }}
        >
          {featureItems.map((item, index) => (
            <div
              key={`${item}-${index}`}
              style={{
                width: 174,
                minHeight: 92,
                borderRadius: 18,
                padding: 18,
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(23,32,42,0.08)",
                boxShadow: "0 22px 58px rgba(20,32,48,0.12)",
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: 800,
                lineHeight: 1.18,
                ...motion.featureCard(index),
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "absolute",
          left: safeArea.left,
          right: safeArea.right,
          bottom: 42,
          height: 5,
          borderRadius: 999,
          background: "rgba(47,128,237,0.12)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 999,
            background: `linear-gradient(90deg, ${colors.blueAccent}, ${colors.greenAccent})`,
          }}
        />
      </div>
    </div>
  );
};

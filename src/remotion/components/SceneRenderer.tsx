import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { getChoreographyEntry, materializeAnimationTracks } from "../../motion/choreographyRegistry";
import type { ChoreographyAnimationTrack } from "../../motion/choreographyTypes";
import { colors } from "../../design/tokens";
import { MotionComposer, validateAnimationTracks } from "./MotionComposer";
import { SafeText } from "./SafeText";
import type { ArticleSceneComponentProps } from "../../article/types";
import { containsArticlePlaceholder, visibleCopyHasEllipsis } from "../../article/articleVisibleCopyPlan";
import { getArticleLayoutContract } from "../articleLayoutContract";
import { getArticleMotionContract } from "../articleMotionContract";
import {
  EmailDraftGenerationDemoAdapter,
  WebsiteHeroAngledProductSurfaceAdapter,
} from "./MacSourceShotAdapters";

type SceneRendererProps = {
  scene: {
    id?: number;
    sceneType?: string;
    choreographyId?: string;
    animationTracks?: ChoreographyAnimationTrack[];
    textOverlay?: string[];
    visualIntent?: string;
    dataFocus?: string[];
    assets?: { image?: string[] };
    screenshot?: { publicPath?: string; src?: string };
    componentProps?: Record<string, unknown>;
    selectedShotId?: string;
  };
  sceneIndex: number;
};

const toBrowserSrc = (value?: string) => {
  if (!value) return undefined;
  if (/^(https?:|file:|data:)/.test(value)) return value;
  if (value.startsWith("generated/")) return staticFile(value);
  if (/^[A-Za-z]:\\/.test(value)) return `file:///${value.replace(/\\/g, "/")}`;
  return value;
};

const cleanLine = (value = "", max = 48) => {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1).trim() : clean;
};

const ease = (frame: number, input: [number, number], output: [number, number]) =>
  interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const enterStyle = (frame: number, start: number, distance = 14) => ({
  opacity: ease(frame, [start, start + 8], [0, 1]),
  transform: `translateY(${ease(frame, [start, start + 10], [distance, 0])}px) scale(${ease(frame, [start, start + 10], [0.985, 1])})`,
});

const slideInStyle = (frame: number, start: number, distance = 28) => ({
  opacity: ease(frame, [start, start + 10], [0, 1]),
  transform: `translateX(${ease(frame, [start, start + 12], [distance, 0])}px) scale(${ease(frame, [start, start + 12], [0.985, 1])})`,
});

const emphasis = (frame: number, start: number, amount = 1.03) =>
  interpolate(frame, [start, start + 8, start + 18], [1, amount, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const fallbackRows = ["Hero message", "Feature proof", "Conversion point", "Customer signal"];

type ArticleSceneBoundProps = ArticleSceneComponentProps & {
  selectedEvidence?: Array<{ evidenceId: string; evidenceText: string }>;
};

function articleContent(scene: SceneRendererProps["scene"]): ArticleSceneBoundProps | undefined {
  const candidate = scene.componentProps?.articleContent;
  if (!candidate || typeof candidate !== "object") return undefined;
  return candidate as ArticleSceneBoundProps;
}

function isStrictArticleScene(scene: SceneRendererProps["scene"]) {
  const bound = articleContent(scene);
  return bound?.contentSource === "article" && bound.articleBindingMode === "strict" && bound.articleBindingRequired === true;
}

function assertArticleCopy(scene: SceneRendererProps["scene"], field: string, value: string | undefined) {
  if (!isStrictArticleScene(scene)) {
    return value;
  }
  if (!value || !value.trim()) {
    throw new Error(`ARTICLE_SCENE_REQUIRED_COPY_MISSING:${scene.selectedShotId ?? scene.sceneType ?? "scene"}:${field}`);
  }
  if (containsArticlePlaceholder(value)) {
    throw new Error(`ARTICLE_SCENE_PLACEHOLDER_COPY_BLOCKED:${scene.selectedShotId ?? scene.sceneType ?? "scene"}:${field}`);
  }
  if (visibleCopyHasEllipsis(value)) {
    throw new Error(`ARTICLE_SCENE_ELLIPSIS_BLOCKED:${scene.selectedShotId ?? scene.sceneType ?? "scene"}:${field}`);
  }
  return value;
}

function articleTitle(scene: SceneRendererProps["scene"], fallback: string) {
  const bound = articleContent(scene);
  if (bound?.headline) return assertArticleCopy(scene, "headline", bound.headline);
  if (isStrictArticleScene(scene)) {
    return assertArticleCopy(scene, "headline", undefined);
  }
  return cleanLine(fallback, 72);
}

function articleSupport(scene: SceneRendererProps["scene"], fallback: string) {
  const bound = articleContent(scene);
  if (bound?.supportingText) return assertArticleCopy(scene, "supportingText", bound.supportingText);
  if (isStrictArticleScene(scene)) {
    return undefined;
  }
  return cleanLine(fallback, 96);
}

function articleShortLabel(scene: SceneRendererProps["scene"], fallback: string) {
  const bound = articleContent(scene);
  if (bound?.shortLabel) return assertArticleCopy(scene, "shortLabel", bound.shortLabel);
  if (isStrictArticleScene(scene)) {
    return undefined;
  }
  return cleanLine(fallback, 20);
}

function articleRecommendationItems(scene: SceneRendererProps["scene"]): string[] {
  const bound = articleContent(scene);
  const items = bound?.recommendationItems?.length ? bound.recommendationItems : undefined;
  if (items?.length) {
    return items.map((item: string, index: number) => assertArticleCopy(scene, `recommendationItems[${index}]`, item) ?? "").slice(0, 3);
  }
  if (isStrictArticleScene(scene)) {
    throw new Error(`ARTICLE_SCENE_REQUIRED_COPY_MISSING:${scene.selectedShotId ?? scene.sceneType ?? "scene"}:recommendationItems`);
  }
  return aiRecommendationRows(scene).map((item) => cleanLine(item, 34)).slice(0, 3);
}

function articleStepItems(scene: SceneRendererProps["scene"]): string[] {
  const bound = articleContent(scene);
  const items = bound?.stepItems?.length ? bound.stepItems : undefined;
  if (items?.length) {
    return items.map((item: string, index: number) => assertArticleCopy(scene, `stepItems[${index}]`, item) ?? "").slice(0, 3);
  }
  if (isStrictArticleScene(scene)) {
    throw new Error(`ARTICLE_SCENE_REQUIRED_COPY_MISSING:${scene.selectedShotId ?? scene.sceneType ?? "scene"}:stepItems`);
  }
  return [];
}

function articleEvidenceCaption(scene: SceneRendererProps["scene"], fallback: string) {
  const bound = articleContent(scene);
  if (bound?.evidenceText) return assertArticleCopy(scene, "evidenceText", bound.evidenceText);
  if (isStrictArticleScene(scene)) {
    return undefined;
  }
  return cleanLine(fallback, 42);
}

function articleEvidenceAt(scene: SceneRendererProps["scene"], index: number) {
  const bound = articleContent(scene);
  const selectedEvidence = bound?.selectedEvidence?.length ? bound.selectedEvidence : undefined;
  if (!selectedEvidence) return undefined;
  return selectedEvidence[index % selectedEvidence.length];
}


function sceneLines(scene: SceneRendererProps["scene"]): string[] {
  if (isStrictArticleScene(scene)) {
    const bound = articleContent(scene);
    const lines = [bound?.headline, bound?.supportingText].filter(Boolean).map((line, index) => assertArticleCopy(scene, index === 0 ? "headline" : "supportingText", line));
    return lines.filter(Boolean) as string[];
  }
  const raw = scene.textOverlay?.length ? scene.textOverlay : [scene.visualIntent ?? "Show the page. Reveal the value."];
  return raw.map((line, index) => cleanLine(line, index === 0 ? 42 : 64)).filter(Boolean).slice(0, 2);
}

function sceneCards(scene: SceneRendererProps["scene"]): string[] {
  if (isStrictArticleScene(scene)) {
    const bound = articleContent(scene);
    const cards = bound?.recommendationItems?.length ? bound.recommendationItems : bound?.stepItems?.length ? bound.stepItems : [];
    if (cards.length) {
      return cards.map((item, index) => assertArticleCopy(scene, `cards[${index}]`, item) ?? "").slice(0, 3);
    }
    return [];
  }
  const raw = scene.dataFocus?.length ? scene.dataFocus : ["Fast setup", "Clear proof", "Ready CTA"];
  return raw.map((item) => cleanLine(item, 22)).filter(Boolean).slice(0, 3);
}

function aiRecommendationRows(scene: SceneRendererProps["scene"]): string[] {
  if (isStrictArticleScene(scene)) {
    return articleRecommendationItems(scene);
  }
  const secondaryLines = scene.textOverlay?.slice(1) ?? [];
  const raw = scene.dataFocus?.length
    ? scene.dataFocus
    : secondaryLines.length
      ? secondaryLines
      : ["Evidence-driven signal", "Cursor-led trigger", "Readable decision panel"];
  return raw.map((item) => cleanLine(item, 34)).filter(Boolean).slice(0, 3);
}

const BrowserSurface: React.FC<{ src?: string }> = ({ src }) => (
  <div
    style={{
      width: 940,
      height: 620,
      borderRadius: 32,
      background: "rgba(255,255,255,0.94)",
      border: "1px solid rgba(15,23,42,0.10)",
      boxShadow: "0 42px 118px rgba(30,41,59,0.18)",
      overflow: "hidden",
      transformStyle: "preserve-3d",
    }}
  >
    <div
      style={{
        height: 58,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 24px",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
        background: "linear-gradient(180deg,#fff,#F8FAFC)",
      }}
    >
      {[0, 1, 2].map((dot) => (
        <span key={dot} style={{ width: 11, height: 11, borderRadius: 99, background: ["#F97316", "#FACC15", "#22C55E"][dot] }} />
      ))}
      <span style={{ marginLeft: 14, width: 330, height: 22, borderRadius: 99, background: "#EEF2F7" }} />
    </div>
    {src ? (
      <Img src={src} style={{ width: "100%", height: 562, objectFit: "cover", filter: "saturate(.95) contrast(.98)" }} />
    ) : (
      <div style={{ height: 562, padding: 38, display: "grid", gridTemplateColumns: "1fr 0.9fr", gap: 28 }}>
        <div style={{ borderRadius: 26, padding: 30, background: "linear-gradient(135deg,#EFF6FF,#F8FAFC 62%,#ECFDF5)", border: "1px solid rgba(37,99,235,0.10)" }}>
          <div style={{ width: 122, height: 24, borderRadius: 99, background: "#DBEAFE", marginBottom: 30 }} />
          <div style={{ width: 380, height: 42, borderRadius: 14, background: "#111827", marginBottom: 14 }} />
          <div style={{ width: 300, height: 42, borderRadius: 14, background: "#334155", marginBottom: 28 }} />
          <div style={{ width: 410, height: 13, borderRadius: 99, background: "#CBD5E1", marginBottom: 12 }} />
          <div style={{ width: 330, height: 13, borderRadius: 99, background: "#CBD5E1", marginBottom: 36 }} />
          <div style={{ width: 150, height: 52, borderRadius: 16, background: "#2563EB" }} />
        </div>
        <div>
          {fallbackRows.map((row, index) => (
            <div key={row} style={{ height: 82, borderRadius: 20, background: "#fff", border: "1px solid rgba(15,23,42,.08)", boxShadow: "0 16px 38px rgba(30,41,59,.07)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", marginBottom: 16 }}>
              <strong style={{ color: "#0F172A", fontSize: 18 }}>{row}</strong>
              <span style={{ width: 76 + index * 12, height: 10, borderRadius: 99, background: "#CBD5E1" }} />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const WebsiteHeroAngledPushInScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  sceneIndex,
  animationTracks,
  choreographyId,
}) => {
  const lines = sceneLines(scene);
  const cards = sceneCards(scene);
  const src = toBrowserSrc(scene.assets?.image?.[0] ?? scene.screenshot?.publicPath ?? scene.screenshot?.src);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 76% 20%, rgba(37,99,235,0.20), transparent 30%), radial-gradient(circle at 18% 82%, rgba(20,184,166,0.14), transparent 30%), linear-gradient(135deg,#F8FAFC,#EEF6FF 52%,#F8F4EA)",
        color: colors.textPrimary,
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["ambientDepthGrid"]} style={{ position: "absolute", inset: -160 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            backgroundImage:
              "linear-gradient(rgba(15,23,42,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.16) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            transform: "rotateX(58deg) scale(1.24)",
          }}
        />
      </MotionComposer>

      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["cameraRig", "fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["heroTitle"]} style={{ position: "absolute", left: 130, top: 238, width: 640 }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={280} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            Website Hero / {String(scene.id ?? sceneIndex + 1).padStart(2, "0")}
          </SafeText>
          <div style={{ height: 26 }} />
          <SafeText role="hero" tone="primary" maxLines={2} maxWidth={590}>
            {lines[0]}
          </SafeText>
          {lines[1] ? (
            <div style={{ marginTop: 24 }}>
              <SafeText role="body" tone="secondary" maxLines={2} maxWidth={520}>
                {lines[1]}
              </SafeText>
            </div>
          ) : null}
        </MotionComposer>

        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["websiteFrame"]} style={{ position: "absolute", right: 126, top: 198, transformStyle: "preserve-3d" }}>
          <BrowserSurface src={src} />
        </MotionComposer>

        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["primaryHighlightBox"]} style={{ position: "absolute", right: 770, top: 420 }}>
          <div style={{ width: 250, height: 108, borderRadius: 22, border: "3px solid rgba(37,99,235,.82)", boxShadow: "0 0 0 10px rgba(37,99,235,.10)" }} />
        </MotionComposer>

        {cards.map((card, index) => (
          <MotionComposer
            key={card}
            choreographyId={choreographyId}
            animationTracks={animationTracks}
            targetIds={["valueCards"]}
            featureIndex={index}
            style={{ position: "absolute", left: 1050 + index * 178, top: 800 - index * 24 }}
          >
            <div style={{ width: 158, height: 112, borderRadius: 24, background: "rgba(255,255,255,.90)", border: "1px solid rgba(15,23,42,.10)", boxShadow: "0 24px 64px rgba(30,41,59,.14)", padding: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 14, background: ["#2563EB", "#0F766E", "#B45309"][index] }} />
              <strong style={{ display: "block", marginTop: 13, color: "#0F172A", fontSize: 18 }}>{card}</strong>
            </div>
          </MotionComposer>
        ))}
      </MotionComposer>
    </AbsoluteFill>
  );
};

const AIRecommendationCursorPanelRevealScene: React.FC<
  SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }
> = ({ scene, sceneIndex, animationTracks, choreographyId }) => {
  const frame = useCurrentFrame();
  const lines = sceneLines(scene);
  const bound = articleContent(scene);
  const rows = articleRecommendationItems(scene);
  const title = articleTitle(scene, lines[0] ?? "Turn context into a structured recommendation.");
  const subtitle = articleSupport(scene, lines[1] ?? "The cursor lands first, then the panel and evidence rows arrive.");
  const panelTitle = isStrictArticleScene(scene)
    ? assertArticleCopy(scene, "recommendationTitle", bound?.recommendationTitle ?? title)
    : cleanLine(bound?.recommendationTitle ?? title, 26);
  const evidenceCaption = articleEvidenceCaption(scene, "Readable evidence row");
  const traceLabel = String(scene.selectedShotId ?? "shot_51");

  if (isStrictArticleScene(scene)) {
    const contract = getArticleLayoutContract("recommendation");
    const motion = getArticleMotionContract("recommendation");
    const panelAccent = emphasis(frame, motion.emphasisPhase.startFrame + 8, 1.025);
    return (
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 74% 24%, rgba(47,128,237,0.24), transparent 28%), radial-gradient(circle at 22% 78%, rgba(34,160,107,0.12), transparent 30%), linear-gradient(135deg, #F8FBFF 0%, #EEF4FF 52%, #F7F1E8 100%)",
          color: colors.textPrimary,
          overflow: "hidden",
          fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
        }}
      >
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["aiBackdrop"]} style={{ position: "absolute", inset: -140 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.13,
              backgroundImage:
                "linear-gradient(rgba(15,23,42,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.12) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              transform: "rotateX(62deg) scale(1.2)",
            }}
          />
        </MotionComposer>
        <div style={{ position: "absolute", ...contract.layoutZones.primary, display: "flex", flexDirection: "column", justifyContent: "center", ...enterStyle(frame, motion.introPhase.startFrame + 1, 10) }}>
          <div style={{ color: colors.accentBlue, fontSize: contract.label.fontSize, lineHeight: contract.label.lineHeight, fontWeight: 950, textTransform: "uppercase", letterSpacing: 1 }}>
            {articleShortLabel(scene, "选择建议")}
          </div>
          <div style={{ height: contract.label.headlineGap }} />
          <SafeText role="hero" tone="primary" maxLines={contract.headline.maxLines} maxWidth={contract.headline.maxWidth} preserveContent>
            {title}
          </SafeText>
        </div>
        <div style={{ position: "absolute", ...contract.layoutZones.secondary, ...slideInStyle(frame, motion.visibleByFrame.secondary, 26), transform: `${slideInStyle(frame, motion.visibleByFrame.secondary, 26).transform} scale(${panelAccent})` }}>
          <div
            style={{
              width: contract.panel.box.width,
              minHeight: contract.panel.box.height,
              borderRadius: 38,
              padding: contract.panel.textPadding,
              background: "rgba(255,255,255,0.96)",
              border: "1px solid rgba(15,23,42,0.09)",
              boxShadow: "0 42px 110px rgba(20,32,48,0.18)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, paddingBottom: 24, borderBottom: "1px solid rgba(15,23,42,0.08)" }}>
              <div>
                <div style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 1.2, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.1 }}>
                  Recommendation
                </div>
                <div style={{ marginTop: 8, color: colors.textPrimary, fontSize: 30, lineHeight: 1.18, fontWeight: 950, maxWidth: 460, overflowWrap: "break-word" }}>{panelTitle}</div>
              </div>
              <div style={{ width: 150, height: 78, borderRadius: 24, background: "linear-gradient(135deg, rgba(47,128,237,0.12), rgba(34,160,107,0.10))", border: "1px solid rgba(15,23,42,0.06)" }} />
            </div>
            <div style={{ marginTop: 30, display: "grid", gap: 18 }}>
              {rows.map((row, index) => (
                <div
                  key={`${row}-${index}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "28px 1fr",
                    gap: 16,
                    alignItems: "center",
                    padding: "20px 22px",
                    borderRadius: 24,
                    background: index === 0 ? "rgba(47,128,237,0.10)" : "rgba(15,23,42,0.04)",
                    border: frame >= motion.emphasisPhase.startFrame + 8 && index === 0 ? "2px solid rgba(47,128,237,0.34)" : "1px solid rgba(15,23,42,0.08)",
                    ...enterStyle(frame, (motion.visibleByFrame.firstItem ?? 20) + index * 8, 14),
                  }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: 999, background: index === 0 ? colors.accentBlue : "rgba(15,23,42,0.22)" }} />
                  <div style={{ color: colors.textPrimary, fontSize: contract.panel.fontSize + 2, lineHeight: contract.panel.lineHeight, fontWeight: 900, overflowWrap: "break-word" }}>{row}</div>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: contract.panel.textPadding, right: contract.panel.textPadding, bottom: 30, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, color: colors.textSecondary, fontSize: 14, lineHeight: 1.25, fontWeight: 750 }}>
              <span>{evidenceCaption}</span>
              <span>{traceLabel}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 74% 24%, rgba(47,128,237,0.24), transparent 28%), radial-gradient(circle at 22% 78%, rgba(34,160,107,0.12), transparent 30%), linear-gradient(135deg, #F8FBFF 0%, #EEF4FF 52%, #F7F1E8 100%)",
        color: colors.textPrimary,
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["aiBackdrop"]} style={{ position: "absolute", inset: -140 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            backgroundImage:
              "linear-gradient(rgba(15,23,42,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.12) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            transform: "rotateX(62deg) scale(1.2)",
          }}
        />
      </MotionComposer>

      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 120, top: 110, width: 710 }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={360} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            AI Recommendation / {String(scene.id ?? sceneIndex + 1).padStart(2, "0")}
          </SafeText>
          <div style={{ height: 18 }} />
          <SafeText role="hero" tone="primary" maxLines={2} maxWidth={630} preserveContent={isStrictArticleScene(scene)}>
            {title}
          </SafeText>
          <div style={{ marginTop: 18 }}>
            <SafeText role="body" tone="secondary" maxLines={2} maxWidth={560} preserveContent={isStrictArticleScene(scene)}>
              {subtitle}
            </SafeText>
          </div>
        </div>

        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["recommendationCursor"]} style={{ position: "absolute", left: 930, top: 330 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: "linear-gradient(180deg, #2F80ED, #1D4ED8)",
              boxShadow: "0 14px 36px rgba(47,128,237,0.28), 0 0 0 10px rgba(47,128,237,0.10)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -10,
                bottom: -10,
                width: 18,
                height: 18,
                borderRadius: 999,
                border: "3px solid rgba(255,255,255,0.95)",
                background: "rgba(255,255,255,0.18)",
              }}
            />
          </div>
        </MotionComposer>

        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["aiPill"]} style={{ position: "absolute", right: 320, top: 238 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 18px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(47,128,237,0.16)",
              boxShadow: "0 18px 42px rgba(20,32,48,0.10)",
              color: colors.accentBlue,
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 0.2,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 999, background: colors.accentBlue }} />
            {articleShortLabel(scene, "AI decision")}
          </div>
        </MotionComposer>

        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["recommendationPanel"]} style={{ position: "absolute", right: 122, top: 168 }}>
          <div
            style={{
              width: 640,
              minHeight: 560,
              borderRadius: 34,
              padding: 34,
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(15,23,42,0.09)",
              boxShadow: "0 38px 100px rgba(20,32,48,0.18)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 18,
                paddingBottom: 20,
                borderBottom: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <div>
                <div style={{ color: colors.textSecondary, fontSize: 15, fontWeight: 850, textTransform: "uppercase", letterSpacing: 1.2 }}>
                  {articleShortLabel(scene, "Recommendation panel")}
                </div>
                <div style={{ marginTop: 8, color: colors.textPrimary, fontSize: 26, fontWeight: 900, maxWidth: 420, overflowWrap: "break-word" }}>{panelTitle}</div>
              </div>
              <div
                style={{
                  width: 140,
                  height: 72,
                  borderRadius: 22,
                  background: "linear-gradient(135deg, rgba(47,128,237,0.12), rgba(34,160,107,0.10))",
                  border: "1px solid rgba(15,23,42,0.06)",
                }}
              />
            </div>
            <div style={{ marginTop: 24 }}>
              <SafeText role="title" tone="primary" maxLines={2} maxWidth={520} preserveContent={isStrictArticleScene(scene)}>
                {title}
              </SafeText>
              <div style={{ marginTop: 14 }}>
                <SafeText role="body" tone="secondary" maxLines={2} maxWidth={500} preserveContent={isStrictArticleScene(scene)}>
                  {subtitle}
                </SafeText>
              </div>
            </div>
            <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
              {rows.map((row, index) => (
                <MotionComposer
                  key={`${row}-${index}`}
                  choreographyId={choreographyId}
                  animationTracks={animationTracks}
                  targetIds={["recommendationRows"]}
                  featureIndex={index}
                >
                  {(() => {
                    const evidence = articleEvidenceAt(scene, index);
                    const rowCaption = cleanLine(evidence?.evidenceText ?? evidenceCaption, 48);
                    return (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "20px 1fr",
                      gap: 14,
                      alignItems: "center",
                      padding: "16px 18px",
                      borderRadius: 22,
                      background: index === 0 ? "rgba(47,128,237,0.10)" : "rgba(15,23,42,0.04)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        background: index === 0 ? colors.accentBlue : "rgba(15,23,42,0.22)",
                      }}
                    />
                    <div>
                      <div style={{ color: colors.textPrimary, fontSize: 17, fontWeight: 850, overflowWrap: "break-word" }}>{row}</div>
                      <div style={{ marginTop: 4, color: colors.textSecondary, fontSize: 14, fontWeight: 650, overflowWrap: "break-word" }}>
                        {rowCaption}
                      </div>
                    </div>
                  </div>
                    );
                  })()}
                </MotionComposer>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                left: 34,
                right: 34,
                bottom: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 18,
                color: colors.textSecondary,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <span>{bound?.evidenceId ? `Evidence ${bound.evidenceId}` : "Cursor-led panel landing"}</span>
              <span>{traceLabel}</span>
            </div>
          </div>
        </MotionComposer>
      </MotionComposer>
    </AbsoluteFill>
  );
};

const searchRows = ["Best matching page", "Pricing insight", "Setup guide", "Customer proof"];

const SearchTypingThenRowsScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  animationTracks,
  choreographyId,
}) => {
  const lines = sceneLines(scene);
  const query = cleanLine(lines[0] ?? "find a better workflow", 30).toLowerCase();

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 68% 28%, rgba(37,99,235,0.28), transparent 34%), radial-gradient(circle at 28% 78%, rgba(20,184,166,0.18), transparent 32%), linear-gradient(135deg, #EEF4FF 0%, #F8FAFC 52%, #F7F1E8 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["searchBackdrop"]} style={{ position: "absolute", inset: -160 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </MotionComposer>
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 170, top: 190, width: 720 }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={280} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            Search Demo
          </SafeText>
          <div style={{ height: 22 }} />
          <SafeText role="title" tone="primary" maxLines={2} maxWidth={620}>
            Search starts the product story.
          </SafeText>
        </div>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["searchBar"]} style={{ position: "absolute", left: 320, top: 420 }}>
          <div
            style={{
              width: 1120,
              height: 112,
              borderRadius: 999,
              background: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(15,23,42,0.10)",
              boxShadow: "0 34px 96px rgba(30,41,59,0.16)",
              display: "flex",
              alignItems: "center",
              padding: "0 36px",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 99, border: "4px solid #2563EB", marginRight: 28 }} />
            <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["queryText"]}>
              <strong style={{ color: "#0F172A", fontSize: 34 }}>{query}</strong>
            </MotionComposer>
            <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["submitButton"]} style={{ marginLeft: "auto" }}>
              <div style={{ width: 164, height: 68, borderRadius: 999, background: "#2563EB", color: "white", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 20 }}>
                SEARCH
              </div>
            </MotionComposer>
          </div>
        </MotionComposer>
        <div style={{ position: "absolute", left: 430, top: 570, width: 850 }}>
          {searchRows.map((row, index) => (
            <MotionComposer
              key={row}
              choreographyId={choreographyId}
              animationTracks={animationTracks}
              targetIds={["resultRows"]}
              featureIndex={index}
              style={{ marginBottom: 18 }}
            >
              <div style={{ height: 78, borderRadius: 22, background: "rgba(255,255,255,.88)", border: "1px solid rgba(15,23,42,.08)", boxShadow: "0 16px 40px rgba(30,41,59,.10)", display: "grid", gridTemplateColumns: "58px 1fr 140px", alignItems: "center", padding: "0 24px" }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: ["#2563EB", "#0F766E", "#B45309", "#7C3AED"][index] }} />
                <strong style={{ color: "#0F172A", fontSize: 22 }}>{row}</strong>
                <span style={{ height: 10, borderRadius: 99, background: "#CBD5E1" }} />
              </div>
            </MotionComposer>
          ))}
        </div>
      </MotionComposer>
    </AbsoluteFill>
  );
};

const ComparePanel: React.FC<{ title: string; tone: "muted" | "win" }> = ({ title, tone }) => {
  const color = tone === "win" ? "#0F766E" : "#64748B";
  return (
    <div
      style={{
        width: 610,
        height: 430,
        borderRadius: 34,
        background: "rgba(255,255,255,.92)",
        border: `1px solid ${tone === "win" ? "rgba(15,118,110,.28)" : "rgba(15,23,42,.10)"}`,
        boxShadow: tone === "win" ? "0 34px 88px rgba(15,118,110,.18)" : "0 30px 78px rgba(30,41,59,.12)",
        padding: 38,
      }}
    >
      <div style={{ color, fontSize: 18, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ height: 38 }} />
      {["Match", "Setup", "Signal"].map((label, index) => (
        <div key={label} style={{ display: "grid", gridTemplateColumns: "1fr 110px", alignItems: "center", height: 58 }}>
          <span style={{ color: "#64748B", fontSize: 22, fontWeight: 700 }}>{label}</span>
          <strong style={{ color, fontSize: 22, textAlign: "right" }}>
            {tone === "win" ? ["94%", "Fast", "Clear"][index] : ["61%", "Manual", "Noisy"][index]}
          </strong>
        </div>
      ))}
      <div style={{ marginTop: 30, height: 78, borderRadius: 22, background: tone === "win" ? "rgba(15,118,110,.10)" : "rgba(100,116,139,.10)" }} />
    </div>
  );
};

const SplitCompareCardsScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  sceneIndex,
  animationTracks,
  choreographyId,
}) => {
  const lines = sceneLines(scene);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 76% 24%, rgba(15,118,110,0.20), transparent 30%), radial-gradient(circle at 20% 78%, rgba(37,99,235,0.18), transparent 32%), linear-gradient(135deg, #F8FAFC 0%, #EEF6FF 52%, #F8F4EA 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["comparisonBackdrop"]} style={{ position: "absolute", inset: -160 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </MotionComposer>
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 130, top: 118 }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={320} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            Result Comparison / {String(scene.id ?? sceneIndex + 1).padStart(2, "0")}
          </SafeText>
          <div style={{ height: 24 }} />
          <SafeText role="title" tone="primary" maxLines={2} maxWidth={760}>
            {lines[0] ?? "Compare options. Make the result obvious."}
          </SafeText>
        </div>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["splitPanels"]} style={{ position: "absolute", left: 210, top: 392, display: "flex", gap: 160 }}>
          <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["leftResult"]}>
            <ComparePanel title="Before" tone="muted" />
          </MotionComposer>
          <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["rightResult"]}>
            <ComparePanel title="After" tone="win" />
          </MotionComposer>
        </MotionComposer>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["comparisonDivider"]} style={{ position: "absolute", left: 958, top: 432 }}>
          <div style={{ width: 5, height: 340, borderRadius: 99, background: "linear-gradient(180deg, transparent, #2563EB, transparent)", transformOrigin: "center" }} />
        </MotionComposer>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["winnerCard"]} style={{ position: "absolute", right: 230, bottom: 92 }}>
          <div style={{ width: 350, height: 112, borderRadius: 30, background: "rgba(15,118,110,.94)", color: "white", boxShadow: "0 30px 86px rgba(15,118,110,.22)", display: "grid", placeItems: "center", fontSize: 28, fontWeight: 900 }}>
            Recommended path
          </div>
        </MotionComposer>
      </MotionComposer>
    </AbsoluteFill>
  );
};

const DashboardGridOrbitScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  sceneIndex,
  animationTracks,
  choreographyId,
}) => {
  const lines = sceneLines(scene);
  const steps = articleStepItems(scene);
  const columns = steps.length ? steps : ["Intake", "Plan", "Build", "Review"];
  const callouts = steps.length ? steps : ["Workflow", "Risk", "Owner"];

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 74% 24%, rgba(37,99,235,0.22), transparent 32%), radial-gradient(circle at 18% 76%, rgba(20,184,166,0.16), transparent 30%), linear-gradient(135deg, #F8FAFC 0%, #EEF6FF 52%, #F7F1E8 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["gridBackdrop"]} style={{ position: "absolute", inset: -160 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </MotionComposer>
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 130, top: 116 }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={320} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            App Grid / {String(scene.id ?? sceneIndex + 1).padStart(2, "0")}
          </SafeText>
          <div style={{ height: 24 }} />
          <SafeText role="title" tone="primary" maxLines={2} maxWidth={760}>
            {lines[0] ?? "Scan a dashboard without losing the story."}
          </SafeText>
        </div>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["dashboardFrame"]} style={{ position: "absolute", left: 245, top: 320, transformStyle: "preserve-3d" }}>
          <div style={{ width: 1250, height: 540, borderRadius: 38, background: "rgba(255,255,255,.94)", border: "1px solid rgba(15,23,42,.10)", boxShadow: "0 40px 110px rgba(30,41,59,.16)", padding: 42 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 22 }}>
              {columns.map((column) => (
                <div key={column} style={{ color: "#1D4ED8", fontSize: 18, fontWeight: 900, textTransform: "uppercase" }}>{column}</div>
              ))}
            </div>
            <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["columnHighlight"]} style={{ position: "absolute", left: 352, top: 102 }}>
              <div style={{ width: 245, height: 360, borderRadius: 24, background: "rgba(37,99,235,.08)", border: "1px solid rgba(37,99,235,.20)" }} />
            </MotionComposer>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, position: "relative" }}>
              {Array.from({ length: 16 }).map((_, index) => (
                <MotionComposer key={index} choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["gridCells"]} featureIndex={index}>
                  {(() => {
                    const evidence = articleEvidenceAt(scene, index);
                    const cellTitle = cleanLine(columns[index % columns.length] ?? lines[0] ?? "Step", 18);
                    const cellCaption = cleanLine(evidence?.evidenceText ?? articleEvidenceCaption(scene, "Traceable evidence"), 28);
                    return (
                  <div style={{ height: 76, borderRadius: 20, background: index % 5 === 0 ? "rgba(15,118,110,.10)" : "rgba(248,250,252,.95)", border: "1px solid rgba(15,23,42,.08)", padding: "16px 18px" }}>
                    <div style={{ color: "#0F172A", fontSize: 15, fontWeight: 850, marginBottom: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cellTitle}</div>
                    <div style={{ color: index % 5 === 0 ? "#0F766E" : "#64748B", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cellCaption}</div>
                  </div>
                    );
                  })()}
                </MotionComposer>
              ))}
            </div>
          </div>
        </MotionComposer>
        {callouts.slice(0, 3).map((label, index) => (
          <MotionComposer
            key={label}
            choreographyId={choreographyId}
            animationTracks={animationTracks}
            targetIds={["calloutPins"]}
            featureIndex={index}
            style={{ position: "absolute", left: [1320, 1230, 1480][index], top: [390, 590, 730][index] }}
          >
            <div style={{ width: 150, height: 56, borderRadius: 999, background: "rgba(255,255,255,.92)", border: "1px solid rgba(37,99,235,.18)", boxShadow: "0 16px 38px rgba(30,41,59,.12)", display: "grid", placeItems: "center", color: "#2563EB", fontWeight: 900, fontSize: 18 }}>
              {label}
            </div>
          </MotionComposer>
        ))}
      </MotionComposer>
    </AbsoluteFill>
  );
};

const PriceInsightSnapScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  sceneIndex,
  animationTracks,
  choreographyId,
}) => {
  const lines = sceneLines(scene);
  const rows = scene.dataFocus?.length ? scene.dataFocus.slice(0, 3) : ["Plan", "Value", "Savings"];

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 24%, rgba(251,146,60,0.20), transparent 30%), radial-gradient(circle at 78% 30%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(135deg, #FFF8ED 0%, #F7FBFF 54%, #EEF7F1 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["commerceBackdrop"]} style={{ position: "absolute", inset: -160 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.10) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </MotionComposer>
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 130, top: 116 }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={330} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            Price Insight / {String(scene.id ?? sceneIndex + 1).padStart(2, "0")}
          </SafeText>
          <div style={{ height: 24 }} />
          <SafeText role="title" tone="primary" maxLines={2} maxWidth={760}>
            {lines[0] ?? "Make the value moment impossible to miss."}
          </SafeText>
        </div>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["productSurface"]} style={{ position: "absolute", left: 310, top: 345, transformStyle: "preserve-3d" }}>
          <div style={{ width: 1160, height: 500, borderRadius: 42, background: "rgba(255,255,255,.94)", border: "1px solid rgba(15,23,42,.12)", boxShadow: "0 40px 110px rgba(30,41,59,.17)", overflow: "hidden" }}>
            <div style={{ height: 64, borderBottom: "1px solid rgba(15,23,42,.08)", display: "flex", alignItems: "center", padding: "0 32px", gap: 10 }}>
              {["#FB7185", "#FDBA74", "#34D399"].map((color) => (
                <span key={color} style={{ width: 12, height: 12, borderRadius: 999, background: color }} />
              ))}
              <span style={{ marginLeft: 18, height: 14, width: 320, borderRadius: 999, background: "#E2E8F0" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 44, padding: 44 }}>
              <div>
                <div style={{ height: 28, width: 320, borderRadius: 999, background: "#0F172A", marginBottom: 24 }} />
                <div style={{ height: 14, width: 410, borderRadius: 999, background: "#CBD5E1", marginBottom: 14 }} />
                <div style={{ height: 14, width: 340, borderRadius: 999, background: "#E2E8F0", marginBottom: 46 }} />
                <div style={{ height: 152, borderRadius: 30, background: "linear-gradient(135deg, rgba(14,165,233,.10), rgba(34,197,94,.10))", border: "1px solid rgba(14,165,233,.16)" }} />
              </div>
              <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["insightPanel"]}>
                <div style={{ height: 288, borderRadius: 32, background: "#F8FAFC", border: "1px solid rgba(15,23,42,.08)", padding: 30 }}>
                  <div style={{ color: "#0369A1", fontSize: 16, fontWeight: 900, textTransform: "uppercase", marginBottom: 26 }}>Pricing Evidence</div>
                  {rows.map((row, index) => (
                    <MotionComposer key={row} choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["valueRows"]} featureIndex={index}>
                      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "center", gap: 20, marginBottom: 24, transformOrigin: "left" }}>
                        <strong style={{ color: "#334155", fontSize: 18 }}>{cleanLine(row, 16)}</strong>
                        <span style={{ height: 16, borderRadius: 999, background: index === 2 ? "#22C55E" : "#CBD5E1", width: `${74 + index * 8}%` }} />
                      </div>
                    </MotionComposer>
                  ))}
                </div>
              </MotionComposer>
            </div>
          </div>
        </MotionComposer>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["priceBadge"]} style={{ position: "absolute", left: 214, top: 568 }}>
          <div style={{ width: 210, height: 160, borderRadius: 34, background: "#FFF7ED", border: "2px solid rgba(234,88,12,.24)", boxShadow: "0 26px 70px rgba(234,88,12,.20)", display: "grid", placeItems: "center", color: "#9A3412" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>Save</div>
              <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["savingsHighlight"]}>
                <div style={{ fontSize: 56, lineHeight: 1, fontWeight: 950, letterSpacing: "-0.06em" }}>28%</div>
              </MotionComposer>
              <div style={{ fontSize: 16, fontWeight: 800 }}>this cycle</div>
            </div>
          </div>
        </MotionComposer>
      </MotionComposer>
    </AbsoluteFill>
  );
};

const StepFlowRailScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  sceneIndex,
  animationTracks,
  choreographyId,
}) => {
  const frame = useCurrentFrame();
  const lines = sceneLines(scene);
  const steps = isStrictArticleScene(scene)
    ? articleStepItems(scene)
    : scene.dataFocus?.length
      ? scene.dataFocus.slice(0, 4)
      : ["Request", "Plan", "Build", "Review"];
  const support = articleSupport(scene, "");
  const label = articleShortLabel(scene, "");

  if (isStrictArticleScene(scene)) {
    const contract = getArticleLayoutContract("step_flow");
    const motion = getArticleMotionContract("step_flow");
    const cardBoxes = contract.layoutZones.cards ?? [];
    const railScale = ease(frame, [motion.introPhase.startFrame + 4, motion.buildPhase.startFrame + 8], [0.08, 1]);
    return (
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(99,102,241,0.16), transparent 32%), radial-gradient(circle at 82% 78%, rgba(20,184,166,0.16), transparent 30%), linear-gradient(135deg, #F8FAFC 0%, #F4F7FF 52%, #F6F3EA 100%)",
          overflow: "hidden",
          fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
        }}
      >
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["stepBackdrop"]} style={{ position: "absolute", inset: -160 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.12,
              backgroundImage:
                "linear-gradient(rgba(15,23,42,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.10) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </MotionComposer>
        <div style={{ position: "absolute", left: 130, top: 112, width: 780, ...enterStyle(frame, motion.introPhase.startFrame + 1, 10) }}>
          <div style={{ color: "#4F46E5", fontSize: contract.label.fontSize, lineHeight: contract.label.lineHeight, fontWeight: 950, textTransform: "uppercase", letterSpacing: 1 }}>
            {label || "省钱策略"}
          </div>
          <div style={{ height: contract.label.headlineGap }} />
          <SafeText role="title" tone="primary" maxLines={contract.headline.maxLines} maxWidth={contract.headline.maxWidth} preserveContent>
            {lines[0]}
          </SafeText>
          {support ? (
            <div style={{ marginTop: 14, fontSize: contract.supportingText.fontSize, lineHeight: contract.supportingText.lineHeight, color: colors.textSecondary, fontWeight: 750, maxWidth: contract.supportingText.maxWidth }}>
              {support}
            </div>
          ) : null}
        </div>
        <div style={{ position: "absolute", left: 150, top: 340, right: 150, height: 8, borderRadius: 99, background: "linear-gradient(90deg, rgba(79,70,229,.24), rgba(20,184,166,.24))", transform: `scaleX(${railScale})`, transformOrigin: "left center" }} />
        {steps.slice(0, 3).map((step, index) => {
          const box = cardBoxes[index] ?? contract.card.box;
          const start = motion.visibleByFrame.firstItem ?? 12;
          const cardStart = start + index * 6;
          const cardScale = emphasis(frame, motion.emphasisPhase.startFrame + index * 12, 1.025);
          return (
            <div key={step} style={{ position: "absolute", ...box, borderRadius: 34, background: "rgba(255,255,255,.96)", border: frame >= motion.emphasisPhase.startFrame + index * 12 && frame <= motion.emphasisPhase.startFrame + index * 12 + 16 ? "2px solid rgba(79,70,229,.42)" : "1px solid rgba(15,23,42,.10)", boxShadow: "0 28px 80px rgba(30,41,59,.14)", padding: contract.card.textPadding, display: "grid", gridTemplateRows: "auto 1fr", alignItems: "center", ...enterStyle(frame, cardStart, 20), transform: `${enterStyle(frame, cardStart, 20).transform} scale(${cardScale})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, color: "#4F46E5", fontSize: 18, fontWeight: 950 }}>
                <span style={{ width: 46, height: 46, borderRadius: 16, background: ["#94A3B8", "#2563EB", "#4F46E5"][index] ?? "#4F46E5", color: "white", display: "grid", placeItems: "center" }}>{index + 1}</span>
                <span>STEP {index + 1}</span>
              </div>
              <strong style={{ color: "#0F172A", fontSize: contract.card.fontSize, lineHeight: contract.card.lineHeight, fontWeight: 950, overflowWrap: "break-word" }}>
                {step}
              </strong>
            </div>
          );
        })}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 20%, rgba(99,102,241,0.16), transparent 32%), radial-gradient(circle at 82% 78%, rgba(20,184,166,0.16), transparent 30%), linear-gradient(135deg, #F8FAFC 0%, #F4F7FF 52%, #F6F3EA 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["stepBackdrop"]} style={{ position: "absolute", inset: -160 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.10) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </MotionComposer>
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 130, top: 116 }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={330} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            Step Flow / {String(scene.id ?? sceneIndex + 1).padStart(2, "0")}
          </SafeText>
          <div style={{ height: 24 }} />
          <SafeText role="title" tone="primary" maxLines={2} maxWidth={760} preserveContent={isStrictArticleScene(scene)}>
            {lines[0] ?? "Turn a process into a guided sequence."}
          </SafeText>
          {support ? (
            <div style={{ marginTop: 16 }}>
              <SafeText role="body" tone="secondary" maxLines={2} maxWidth={760} preserveContent={isStrictArticleScene(scene)}>
                {support}
              </SafeText>
            </div>
          ) : null}
        </div>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["processRail"]} style={{ position: "absolute", left: 230, top: 548, width: 1000, height: 5, transformOrigin: "left" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #4F46E5, #14B8A6)" }} />
        </MotionComposer>
        <div style={{ position: "absolute", left: 190, top: 420, display: "grid", gridTemplateColumns: `repeat(${steps.length}, 210px)`, gap: 64 }}>
          {steps.map((step, index) => {
            const isActive = index === Math.min(2, steps.length - 1);
            return (
              <MotionComposer
                key={step}
                choreographyId={choreographyId}
                animationTracks={animationTracks}
                targetIds={isActive ? ["stepCards", "activeStep"] : ["stepCards"]}
                featureIndex={index}
              >
                <div style={{ width: 210, height: 150, borderRadius: 30, background: "rgba(255,255,255,.94)", border: isActive ? "1px solid rgba(79,70,229,.28)" : "1px solid rgba(15,23,42,.09)", boxShadow: isActive ? "0 24px 70px rgba(79,70,229,.18)" : "0 18px 48px rgba(30,41,59,.10)", display: "grid", placeItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 46, height: 46, borderRadius: 16, background: ["#94A3B8", "#2563EB", "#4F46E5", "#0F766E"][index] ?? "#4F46E5", margin: "0 auto 18px" }} />
                    <strong style={{ color: "#0F172A", fontSize: 22, lineHeight: 1.15, padding: "0 16px", overflowWrap: "break-word" }}>
                      {isStrictArticleScene(scene) ? step : cleanLine(step, 16)}
                    </strong>
                  </div>
                </div>
              </MotionComposer>
            );
          })}
        </div>
        {isStrictArticleScene(scene) ? (
          <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["toolModule"]} style={{ position: "absolute", left: 950, top: 650 }}>
            <div style={{ width: 300, minHeight: 140, borderRadius: 34, background: "rgba(79,70,229,.94)", boxShadow: "0 30px 80px rgba(79,70,229,.24)", color: "white", padding: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label ?? "Article step flow"}</div>
              {support ? <div style={{ marginTop: 12, fontSize: 18, lineHeight: 1.3, overflowWrap: "break-word" }}>{support}</div> : null}
            </div>
          </MotionComposer>
        ) : (
          <>
            <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["toolModule"]} style={{ position: "absolute", left: 950, top: 650 }}>
              <div style={{ width: 210, height: 140, borderRadius: 34, background: "rgba(79,70,229,.94)", boxShadow: "0 30px 80px rgba(79,70,229,.24)", color: "white", display: "grid", placeItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 52, height: 42, borderRadius: 16, background: "rgba(255,255,255,.24)", margin: "0 auto 14px" }} />
                  <strong style={{ fontSize: 22 }}>Auto route</strong>
                </div>
              </div>
            </MotionComposer>
            <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["progressMeter"]} style={{ position: "absolute", right: 150, bottom: 130 }}>
              <div style={{ width: 330, height: 160, borderRadius: 34, background: "rgba(255,255,255,.94)", border: "1px solid rgba(15,118,110,.16)", boxShadow: "0 26px 76px rgba(30,41,59,.14)", padding: 28 }}>
                <div style={{ color: "#0F766E", fontSize: 16, fontWeight: 900, textTransform: "uppercase", marginBottom: 24 }}>Flow readiness</div>
                <div style={{ height: 16, borderRadius: 999, background: "#D1FAE5", overflow: "hidden" }}>
                  <div style={{ width: "78%", height: "100%", borderRadius: 999, background: "#0F766E" }} />
                </div>
                <strong style={{ display: "block", color: "#0F172A", fontSize: 28, marginTop: 18 }}>78% aligned</strong>
              </div>
            </MotionComposer>
          </>
        )}
      </MotionComposer>
    </AbsoluteFill>
  );
};

const WebsiteHeroCenterStageScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  sceneIndex,
  animationTracks,
  choreographyId,
}) => {
  const lines = sceneLines(scene);
  const src = toBrowserSrc(scene.assets?.image?.[0] ?? scene.screenshot?.publicPath ?? scene.screenshot?.src);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 28%, rgba(251,207,232,0.38), transparent 30%), radial-gradient(circle at 80% 28%, rgba(191,219,254,0.30), transparent 34%), linear-gradient(135deg, #FBF7F2 0%, #F8FAFC 55%, #EEF7FF 100%)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["heroDeskBackdrop"]} style={{ position: "absolute", inset: -120 }}>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 78, height: 170, borderRadius: "50%", background: "rgba(148,163,184,.16)", filter: "blur(22px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: "linear-gradient(rgba(15,23,42,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.10) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      </MotionComposer>
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["titlePill"]} style={{ position: "absolute", left: 130, top: 116 }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={360} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            Website Hero / {String(scene.id ?? sceneIndex + 1).padStart(2, "0")}
          </SafeText>
          <div style={{ height: 24 }} />
          <SafeText role="title" tone="primary" maxLines={2} maxWidth={760}>
            {lines[0] ?? "Center the website, then reveal the value."}
          </SafeText>
        </MotionComposer>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["laptopFrame"]} style={{ position: "absolute", left: 440, top: 330 }}>
          <div style={{ width: 960, height: 560, borderRadius: 30, background: "#111827", boxShadow: "0 42px 112px rgba(30,41,59,.22)", padding: 18 }}>
            <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["browserContent"]} style={{ transformOrigin: "top" }}>
              <BrowserSurface src={src} />
            </MotionComposer>
          </div>
        </MotionComposer>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["ctaSpotlight"]} style={{ position: "absolute", right: 190, bottom: 150 }}>
          <div style={{ width: 310, height: 96, borderRadius: 999, background: "rgba(37,99,235,.94)", color: "white", boxShadow: "0 26px 72px rgba(37,99,235,.24)", display: "grid", placeItems: "center", fontSize: 24, fontWeight: 900 }}>
            Clear next step
          </div>
        </MotionComposer>
      </MotionComposer>
    </AbsoluteFill>
  );
};

const FinalCtaCardsConvergeScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  animationTracks,
  choreographyId,
}) => {
  const lines = sceneLines(scene);
  const cards = sceneCards(scene);
  const chips = scene.dataFocus?.length ? scene.dataFocus.slice(0, 3) : ["No code", "Reusable", "Ready"];

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 30%, rgba(37,99,235,.18), transparent 34%), radial-gradient(circle at 18% 80%, rgba(20,184,166,.16), transparent 30%), linear-gradient(135deg,#F8FAFC,#F3F7FF 52%,#F7F1E8)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["ctaBackdrop"]} style={{ position: "absolute", inset: -160 }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.16, backgroundImage: "linear-gradient(rgba(15,23,42,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.10) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      </MotionComposer>
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", left: 260, top: 210, display: "flex", gap: 28 }}>
          {cards.map((card, index) => (
            <MotionComposer key={card} choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["ctaCards"]} featureIndex={index}>
              <div style={{ width: 320, height: 160, borderRadius: 34, background: "rgba(255,255,255,.92)", border: "1px solid rgba(15,23,42,.10)", boxShadow: "0 24px 64px rgba(30,41,59,.12)", display: "grid", placeItems: "center", color: "#0F172A", fontWeight: 900, fontSize: 26 }}>
                {card}
              </div>
            </MotionComposer>
          ))}
        </div>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["finalTitle"]} style={{ position: "absolute", left: 250, right: 250, top: 460, textAlign: "center" }}>
          <SafeText role="hero" tone="primary" maxLines={2} maxWidth={1120}>
            {lines[0] ?? "Ready to turn this into your next video?"}
          </SafeText>
        </MotionComposer>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["primaryButton"]} style={{ position: "absolute", left: 790, top: 680 }}>
          <div style={{ width: 340, height: 94, borderRadius: 999, background: "#2563EB", color: "white", boxShadow: "0 28px 78px rgba(37,99,235,.25)", display: "grid", placeItems: "center", fontSize: 28, fontWeight: 950 }}>
            Start now
          </div>
        </MotionComposer>
        <div style={{ position: "absolute", left: 520, right: 520, bottom: 120, display: "flex", justifyContent: "center", gap: 18 }}>
          {chips.map((chip, index) => (
            <MotionComposer key={chip} choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["proofChips"]} featureIndex={index}>
              <div style={{ padding: "16px 24px", borderRadius: 999, background: "rgba(255,255,255,.86)", border: "1px solid rgba(15,23,42,.08)", color: "#0F766E", fontWeight: 900, fontSize: 20, whiteSpace: "nowrap" }}>
                {cleanLine(chip, 18)}
              </div>
            </MotionComposer>
          ))}
        </div>
      </MotionComposer>
    </AbsoluteFill>
  );
};

const CoverHookImpactScene: React.FC<SceneRendererProps & { animationTracks: ChoreographyAnimationTrack[]; choreographyId: string }> = ({
  scene,
  animationTracks,
  choreographyId,
}) => {
  const frame = useCurrentFrame();
  const lines = sceneLines(scene);
  const chips = isStrictArticleScene(scene) ? sceneCards(scene) : scene.dataFocus?.length ? scene.dataFocus.slice(0, 3) : ["Fast", "Reusable", "Certified"];
  const support = articleSupport(scene, "");
  const evidenceCaption = articleEvidenceCaption(scene, "");

  if (isStrictArticleScene(scene)) {
    const contract = getArticleLayoutContract("hook");
    const motion = getArticleMotionContract("hook");
    const evidenceScale = emphasis(frame, motion.emphasisPhase.startFrame + 8, 1.045);
    const highlightOpacity = ease(frame, [motion.emphasisPhase.startFrame + 10, motion.emphasisPhase.startFrame + 22], [0, 0.35]);
    return (
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 72% 26%,rgba(37,99,235,.28),transparent 34%),radial-gradient(circle at 18% 78%,rgba(245,158,11,.18),transparent 30%),linear-gradient(135deg,#0F172A,#1E3A8A 54%,#F8FAFC)",
          overflow: "hidden",
          fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
        }}
      >
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["hookBackdrop"]} style={{ position: "absolute", inset: -160 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.16, backgroundImage: "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        </MotionComposer>
        <div style={{ position: "absolute", ...contract.layoutZones.primary, color: "white", display: "flex", flexDirection: "column", justifyContent: "center", ...enterStyle(frame, motion.introPhase.startFrame + 1, 12) }}>
          <div style={{ color: "#FBBF24", fontSize: contract.label.fontSize, lineHeight: contract.label.lineHeight, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>
            {articleShortLabel(scene, "对比结论")}
          </div>
          <div style={{ height: contract.label.headlineGap }} />
          <div style={{ maxWidth: contract.headline.maxWidth, color: "white", fontSize: contract.headline.fontSize, lineHeight: contract.headline.lineHeight, letterSpacing: "-0.02em", fontWeight: 950, overflowWrap: "break-word" }}>
            {lines[0]}
          </div>
          {evidenceCaption ? (
            <div style={{ marginTop: 30, ...contract.evidence.box, position: "static", maxWidth: contract.evidence.maxWidth, minHeight: 0, borderRadius: 28, padding: "20px 26px", background: `linear-gradient(90deg, rgba(251,191,36,${highlightOpacity}), rgba(255,255,255,.14) 42%)`, border: "1px solid rgba(255,255,255,.24)", color: "rgba(255,255,255,.96)", fontSize: contract.evidence.fontSize, lineHeight: contract.evidence.lineHeight, fontWeight: 850, boxShadow: "0 24px 70px rgba(15,23,42,.22)", transform: `scale(${evidenceScale})`, transformOrigin: "left center" }}>
              {evidenceCaption}
            </div>
          ) : support ? (
            <div style={{ marginTop: 28, maxWidth: contract.supportingText.maxWidth, color: "rgba(255,255,255,0.92)", fontSize: contract.supportingText.fontSize, lineHeight: contract.supportingText.lineHeight, fontWeight: 700 }}>
              {support}
            </div>
          ) : null}
        </div>
        <div style={{ position: "absolute", ...contract.layoutZones.secondary, display: "grid", placeItems: "center" }}>
          <div style={{ width: contract.card.box.width, height: contract.card.box.height, borderRadius: 42, background: "rgba(255,255,255,.94)", boxShadow: "0 42px 112px rgba(15,23,42,.28)", border: "1px solid rgba(255,255,255,.35)", padding: contract.card.textPadding, color: "#0F172A", ...slideInStyle(frame, motion.buildPhase.startFrame, 34) }}>
            <div style={{ color: "#1D4ED8", fontSize: 18, lineHeight: 1.25, fontWeight: 950, letterSpacing: ".04em", textTransform: "uppercase" }}>Annual vs Monthly</div>
            <div style={{ marginTop: 30, height: 138, borderRadius: 30, background: "linear-gradient(135deg,#DBEAFE,#FDE68A)", display: "grid", placeItems: "center", color: "#1D4ED8", fontSize: 56, fontWeight: 950 }}>15-25%</div>
            <div style={{ marginTop: 28, fontSize: 24, lineHeight: 1.28, fontWeight: 900 }}>年度方案的长期成本优势</div>
            <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
              <div style={{ height: 16, width: 330, borderRadius: 99, background: "#CBD5E1" }} />
              <div style={{ height: 16, width: 260, borderRadius: 99, background: "#E2E8F0" }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 74% 26%,rgba(37,99,235,.26),transparent 34%),radial-gradient(circle at 18% 78%,rgba(245,158,11,.20),transparent 30%),linear-gradient(135deg,#0F172A,#1E3A8A 54%,#F8FAFC)",
        overflow: "hidden",
        fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
      }}
    >
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["hookBackdrop"]} style={{ position: "absolute", inset: -160 }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.18, backgroundImage: "linear-gradient(rgba(255,255,255,.20) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.20) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
      </MotionComposer>
      <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["fullComposition"]} style={{ position: "absolute", inset: 0 }}>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["hookTitle"]} style={{ position: "absolute", left: 150, top: 180, color: "white" }}>
          <SafeText role="caption" tone="accent" maxLines={1} maxWidth={360} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
            Cover Hook
          </SafeText>
          <div style={{ height: 28 }} />
          <div style={{ maxWidth: 820, color: "white", fontSize: 76, lineHeight: 0.95, letterSpacing: "-0.07em", fontWeight: 950 }}>
            {lines[0] ?? "Open with one unforgettable value moment."}
          </div>
          {support ? (
            <div style={{ marginTop: 24, maxWidth: 720, color: "rgba(255,255,255,0.92)", fontSize: 28, lineHeight: 1.2, fontWeight: 700, overflowWrap: "break-word" }}>
              {support}
            </div>
          ) : null}
          <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["hookUnderline"]} style={{ width: 520, height: 10, borderRadius: 99, background: "#FBBF24", marginTop: 32, transformOrigin: "left" }}>
            <span />
          </MotionComposer>
        </MotionComposer>
        <MotionComposer choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["productSlab"]} style={{ position: "absolute", right: 170, top: 300 }}>
          <div style={{ width: 460, height: 330, borderRadius: 42, background: "rgba(255,255,255,.92)", boxShadow: "0 42px 112px rgba(15,23,42,.28)", border: "1px solid rgba(255,255,255,.35)", padding: 38 }}>
            <div style={{ height: 30, width: 220, borderRadius: 99, background: "#1D4ED8", marginBottom: 34 }} />
            <div style={{ height: 126, borderRadius: 30, background: "linear-gradient(135deg,#DBEAFE,#FDE68A)", marginBottom: 32 }} />
            <div style={{ height: 16, width: 310, borderRadius: 99, background: "#CBD5E1", marginBottom: 16 }} />
            <div style={{ height: 16, width: 240, borderRadius: 99, background: "#E2E8F0" }} />
          </div>
        </MotionComposer>
        <div style={{ position: "absolute", left: 160, bottom: 140, display: "flex", gap: 18 }}>
          {chips.map((chip, index) => (
            <MotionComposer key={chip} choreographyId={choreographyId} animationTracks={animationTracks} targetIds={["accentChips"]} featureIndex={index}>
              <div style={{ padding: "16px 24px", borderRadius: 999, background: "rgba(255,255,255,.90)", color: "#1D4ED8", fontWeight: 900, fontSize: 20 }}>
                {isStrictArticleScene(scene) ? chip : cleanLine(chip, 18)}
              </div>
            </MotionComposer>
          ))}
        </div>
      </MotionComposer>
    </AbsoluteFill>
  );
};

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, sceneIndex }) => {
  if (!scene.choreographyId) {
    throw new Error(`Blocked render: scene ${scene.id ?? sceneIndex + 1} has no choreographyId.`);
  }
  const entry = getChoreographyEntry(scene.choreographyId);
  if (!entry) {
    throw new Error(`Blocked render: unknown choreographyId ${scene.choreographyId}.`);
  }
  const animationTracks = scene.animationTracks?.length
    ? scene.animationTracks
    : materializeAnimationTracks(scene.choreographyId, entry.durationFrames.preferred);
  validateAnimationTracks(scene.choreographyId, animationTracks);

  if (scene.choreographyId === "websiteHeroAngledPushIn") {
    return <WebsiteHeroAngledPushInScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "websiteHeroAngledProductSurface") {
    return <WebsiteHeroAngledProductSurfaceAdapter scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "emailDraftGenerationDemo") {
    return <EmailDraftGenerationDemoAdapter scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "aiRecommendationCursorPanelReveal") {
    return (
      <AIRecommendationCursorPanelRevealScene
        scene={scene}
        sceneIndex={sceneIndex}
        choreographyId={scene.choreographyId}
        animationTracks={animationTracks}
      />
    );
  }
  if (scene.choreographyId === "searchTypingThenRows") {
    return <SearchTypingThenRowsScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "splitCompareCards") {
    return <SplitCompareCardsScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "dashboardGridOrbit") {
    return <DashboardGridOrbitScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "priceInsightSnap") {
    return <PriceInsightSnapScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "stepFlowRail") {
    return <StepFlowRailScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "websiteHeroCenterStage") {
    return <WebsiteHeroCenterStageScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "finalCtaCardsConverge") {
    return <FinalCtaCardsConvergeScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }
  if (scene.choreographyId === "coverHookImpact") {
    return <CoverHookImpactScene scene={scene} sceneIndex={sceneIndex} choreographyId={scene.choreographyId} animationTracks={animationTracks} />;
  }

  throw new Error(`Blocked render: choreography ${scene.choreographyId} has no registered SceneRenderer template.`);
};

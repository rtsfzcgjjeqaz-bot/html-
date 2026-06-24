import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, layout, safeArea } from "../../design/tokens";
import { VisualTemplate } from "../../templates/visualTemplates";
import { AnimatedText } from "./AnimatedText";
import { AppIconCard } from "./AppIconCard";
import { BarChartRace } from "./BarChartRace";
import { BeatTransition } from "./BeatTransition";
import { CameraRig } from "./CameraRig";
import { DataCard } from "./DataCard";
import { DepthLayer } from "./DepthLayer";
import { PriceCard } from "./PriceCard";
import { SafeText } from "./SafeText";
import { SceneBackground } from "./SceneBackground";
import { SemanticShape } from "./SemanticShape";
import { WebsiteFrame } from "./WebsiteFrame";

type SceneData = {
  id?: number;
  duration?: number;
  hookType?: string;
  camera?: { shot?: string; motion?: string };
  visualIntent?: string;
  textOverlay?: string[];
  assets?: { image?: string[]; fallback?: string; appIcons?: Array<{ appName: string; src: string; alt?: string }> };
  audioCue?: string;
  type?: string;
  text?: string;
  motion?: string;
  dataFocus?: string[];
  visualTemplate?: VisualTemplate;
  semanticShapes?: Array<{ semanticRole?: "connector" | "focusMarker" | "highlightBox" | "stepLine" | "chartGuide" | "priceDeltaArrow"; targetRegion?: { x: number; y: number; width: number; height: number } }>;
  screenshotPolicy?: "websiteHeroOnly" | "none";
  screenshot?: { publicPath?: string; src?: string; label?: string };
};

type SceneProps = {
  scene: SceneData;
  sceneIndex: number;
  strategyId?: "A" | "B" | "C";
};

type LayoutProps = {
  lines: string[];
  items: string[];
  src?: string;
  appIcons?: Array<{ appName: string; src: string; alt?: string }>;
  accent: string;
  variant: number;
  durationFrames: number;
};

const toBrowserSrc = (value?: string) => {
  if (!value) return undefined;
  if (/^(https?:|file:|data:)/.test(value)) return value;
  if (value.startsWith("generated/")) return staticFile(value);
  if (/^[A-Za-z]:\\/.test(value)) return `file:///${value.replace(/\\/g, "/")}`;
  return value;
};

const cleanLine = (value: string, max = 48) => {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1).trim() : clean;
};

const shortLines = (scene: SceneData) => {
  const raw = scene.textOverlay?.length ? scene.textOverlay : [scene.text ?? scene.visualIntent ?? "Website insight"];
  return raw.map((line, index) => cleanLine(line, index === 0 ? 34 : 48)).filter(Boolean).slice(0, 2);
};

const focusItems = (scene: SceneData, lines: string[]) => {
  const raw = scene.dataFocus?.length ? scene.dataFocus : [...lines, scene.audioCue, scene.camera?.motion].filter(Boolean);
  return raw.map((item) => cleanLine(String(item), 32)).filter(Boolean).slice(0, 5);
};

const templateFor = (scene: SceneData, index: number): VisualTemplate => {
  if (scene.visualTemplate) return scene.visualTemplate;
  return (["websiteHero", "appGrid", "searchFlow", "comparisonPanel", "recommendationPanel", "dynamicChart", "iconRail", "signalBoard"] as VisualTemplate[])[index % 8];
};

const accentFor = (strategyId: SceneProps["strategyId"], index: number) => {
  if (strategyId === "B") return colors.accentGreen;
  if (strategyId === "C") return colors.accentOrange;
  return index % 2 === 0 ? colors.accentBlue : colors.accentCyan;
};

const GlassPanel: React.FC<React.PropsWithChildren<{ style?: React.CSSProperties }>> = ({ children, style }) => (
  <div
    style={{
      borderRadius: layout.radiusLg,
      background: colors.card,
      border: `1px solid ${colors.border}`,
      boxShadow: layout.shadow,
      ...style,
    }}
  >
    {children}
  </div>
);

const Kicker: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ marginBottom: 18 }}>
    <SafeText role="caption" tone="accent" maxLines={1} maxWidth={360} style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>
      {text}
    </SafeText>
  </div>
);

const SceneShapes: React.FC<{ scene: SceneData; accent: string }> = ({ scene, accent }) => (
  <>
    {(scene.semanticShapes ?? []).slice(0, 2).map((shape, index) => (
      <SemanticShape
        key={`${shape.semanticRole}-${index}`}
        semanticRole={shape.semanticRole}
        targetRegion={shape.targetRegion}
        accent={accent}
        delay={6 + index * 8}
      />
    ))}
  </>
);

const WebsiteHero: React.FC<LayoutProps> = ({ lines, items, src, accent, variant, durationFrames }) => (
  <>
    <DepthLayer zDepth={-160} parallaxSpeed={0.3} durationFrames={durationFrames} style={{ left: 900, top: 150 }}>
      <WebsiteFrame src={src} accent={accent} variant={variant} width={760} height={620} />
    </DepthLayer>
    <DepthLayer zDepth={210} parallaxSpeed={0.9} durationFrames={durationFrames} style={{ left: 240, top: 240 }}>
      <Kicker text="Website intelligence" />
      <AnimatedText lines={lines} accent={accent} mode="hero" />
    </DepthLayer>
    <DepthLayer zDepth={260} parallaxSpeed={0.86} durationFrames={durationFrames} style={{ left: 240, top: 680, display: "flex", gap: 18 }}>
      {items.slice(0, 3).map((item, index) => <div key={`${item}-${index}`} style={{ width: 190 }}><DataCard label={item} index={index} accent={accent} /></div>)}
    </DepthLayer>
  </>
);

const AppGrid: React.FC<LayoutProps> = ({ lines, accent, appIcons = [], durationFrames }) => (
  <>
    <DepthLayer zDepth={100} parallaxSpeed={0.68} durationFrames={durationFrames} style={{ left: 180, top: 150 }}>
      <GlassPanel style={{ width: 800, height: 720, padding: 50, boxSizing: "border-box" }}>
        <Kicker text="Subscriptions" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 190px)", gap: 26, marginTop: 34, justifyContent: "center" }}>
          {(appIcons.length ? appIcons : ["ChatGPT", "Claude", "Gemini", "YouTube", "Spotify", "iCloud"].map((appName) => ({ appName, src: "" }))).slice(0, 6).map((icon, index) => (
            <AppIconCard key={icon.appName} label={icon.appName} iconSrc={icon.src} index={index} accent={accent} />
          ))}
        </div>
      </GlassPanel>
    </DepthLayer>
    <DepthLayer zDepth={240} parallaxSpeed={0.88} durationFrames={durationFrames} style={{ left: 1060, top: 270 }}>
      <AnimatedText lines={lines} accent={accent} mode="title" />
    </DepthLayer>
  </>
);

const IconRail: React.FC<LayoutProps> = ({ lines, accent, appIcons = [], durationFrames }) => (
  <>
    <DepthLayer zDepth={180} parallaxSpeed={0.78} durationFrames={durationFrames} style={{ left: 230, top: 275 }}>
      <AnimatedText lines={lines} accent={accent} mode="title" />
    </DepthLayer>
    <DepthLayer zDepth={90} parallaxSpeed={0.55} durationFrames={durationFrames} style={{ left: 890, top: 155 }}>
      <GlassPanel style={{ width: 780, height: 700, padding: 50, boxSizing: "border-box" }}>
        <Kicker text="Website icons" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 190px)", gap: 30, justifyContent: "center", alignItems: "center", marginTop: 40 }}>
          {(appIcons.length ? appIcons : ["ChatGPT", "Claude", "YouTube", "Spotify", "Netflix", "Gemini"].map((appName) => ({ appName, src: "" }))).slice(0, 6).map((icon, index) => (
            <AppIconCard key={icon.appName} label={icon.appName} iconSrc={icon.src} index={index} accent={accent} />
          ))}
        </div>
      </GlassPanel>
    </DepthLayer>
  </>
);

const SignalBoard: React.FC<LayoutProps> = ({ lines, items, accent, durationFrames }) => (
  <>
    <DepthLayer zDepth={230} parallaxSpeed={0.8} durationFrames={durationFrames} style={{ left: 560, top: 220 }}>
      <AnimatedText lines={lines} accent={accent} mode="compact" />
    </DepthLayer>
    <DepthLayer zDepth={120} parallaxSpeed={0.58} durationFrames={durationFrames} style={{ left: 200, top: 430 }}>
      <GlassPanel style={{ width: 1520, height: 410, padding: 44, boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 26, alignItems: "stretch" }}>
          {(items.length ? items : ["App list", "Country data", "Price reference", "AI route"]).slice(0, 4).map((item, index) => (
            <DataCard key={`${item}-${index}`} label={item} index={index} accent={accent} />
          ))}
        </div>
      </GlassPanel>
    </DepthLayer>
  </>
);

const SearchFlow: React.FC<LayoutProps> = ({ lines, accent, durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const steps = ["Search app", "Compare regions", "Choose route"];
  return (
    <>
      <DepthLayer zDepth={180} parallaxSpeed={0.78} durationFrames={durationFrames} style={{ left: 280, top: 245 }}>
        <AnimatedText lines={lines} accent={accent} mode="title" />
      </DepthLayer>
    <DepthLayer zDepth={80} parallaxSpeed={0.58} durationFrames={durationFrames} style={{ left: 220, top: 510, display: "flex", alignItems: "center", gap: 34 }}>
        {steps.map((step, index) => {
          const enter = spring({ frame: frame - index * 9, fps, config: { damping: 20, stiffness: 115 } });
          return (
            <React.Fragment key={step}>
              <GlassPanel style={{ width: 420, height: 210, padding: 30, opacity: enter, transform: `translateY(${(1 - enter) * 34}px)` }}>
                <SafeText role="micro" tone="accent" maxLines={1} maxWidth={120}>STEP {index + 1}</SafeText>
                <div style={{ marginTop: 18 }}><SafeText role="title" tone="primary" maxLines={2} maxWidth={330}>{step}</SafeText></div>
              </GlassPanel>
            </React.Fragment>
          );
        })}
      </DepthLayer>
    </>
  );
};

const ComparisonPanel: React.FC<LayoutProps> = ({ lines, items, accent, variant, durationFrames }) => (
  <>
    <DepthLayer zDepth={120} parallaxSpeed={0.64} durationFrames={durationFrames} style={{ left: 190, top: 150 }}>
      <GlassPanel style={{ width: 840, height: 720, padding: 60, boxSizing: "border-box" }}>
        <Kicker text="Country comparison" />
        <BarChartRace items={items.length ? items : ["US", "Japan", "Turkey", "India"]} accent={accent} variant={variant} />
      </GlassPanel>
    </DepthLayer>
    <DepthLayer zDepth={250} parallaxSpeed={0.86} durationFrames={durationFrames} style={{ left: 1100, top: 285 }}>
      <AnimatedText lines={lines} accent={accent} mode="title" />
    </DepthLayer>
  </>
);

const RecommendationPanel: React.FC<LayoutProps> = ({ lines, items, accent, durationFrames }) => (
  <>
    <DepthLayer zDepth={180} parallaxSpeed={0.78} durationFrames={durationFrames} style={{ left: 260, top: 255 }}>
      <AnimatedText lines={lines} accent={accent} mode="title" />
    </DepthLayer>
    <DepthLayer zDepth={80} parallaxSpeed={0.54} durationFrames={durationFrames} style={{ left: 900, top: 150 }}>
      <GlassPanel style={{ width: 740, height: 720, padding: 58, boxSizing: "border-box" }}>
        <Kicker text="AI decision" />
        <SafeText role="hero" tone="primary" maxLines={1} maxWidth={420}>Best route</SafeText>
        <div style={{ marginTop: 18 }}><SafeText role="body" tone="secondary" maxLines={2} maxWidth={520}>Use price, country, and service signals before choosing.</SafeText></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 18, marginTop: 44 }}>
          {(items.length ? items : ["Low price", "Risk check", "Region", "Confidence"]).slice(0, 4).map((item, index) => <PriceCard key={item} label={item} index={index} accent={accent} />)}
        </div>
      </GlassPanel>
    </DepthLayer>
  </>
);

const DynamicChart: React.FC<LayoutProps> = ({ lines, items, accent, variant, durationFrames }) => (
  <>
    <DepthLayer zDepth={80} parallaxSpeed={0.56} durationFrames={durationFrames} style={{ left: 180, top: 140 }}>
      <GlassPanel style={{ width: 1560, height: 760, padding: 64, boxSizing: "border-box" }}>
        <Kicker text="System overview" />
        <div style={{ display: "grid", gridTemplateColumns: "620px 1fr", gap: 120, alignItems: "center", height: 560, paddingTop: 54 }}>
          <AnimatedText lines={lines} accent={accent} mode="compact" />
          <BarChartRace items={items.length ? items : ["Price data", "Country data", "App list", "AI logic"]} accent={accent} variant={variant} />
        </div>
      </GlassPanel>
    </DepthLayer>
  </>
);

export const Scene: React.FC<SceneProps> = ({ scene, sceneIndex, strategyId }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const durationFrames = Math.max(1, Math.round(Number(scene.duration || 5) * fps));
  const variant = sceneIndex % 6;
  const accent = accentFor(strategyId, sceneIndex);
  const template = templateFor(scene, sceneIndex);
  const src = template === "websiteHero" ? toBrowserSrc(scene.assets?.image?.[0] ?? scene.screenshot?.publicPath ?? scene.screenshot?.src) : undefined;
  const lines = shortLines(scene);
  const items = focusItems(scene, lines);
  const exit = interpolate(frame, [durationFrames - 16, durationFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const layoutProps = { lines, items, src, appIcons: scene.assets?.appIcons, accent, variant, durationFrames };
  const view =
    template === "websiteHero" ? <WebsiteHero {...layoutProps} />
    : template === "appGrid" ? <AppGrid {...layoutProps} />
    : template === "searchFlow" ? <SearchFlow {...layoutProps} />
    : template === "comparisonPanel" ? <ComparisonPanel {...layoutProps} />
    : template === "recommendationPanel" ? <RecommendationPanel {...layoutProps} />
    : template === "iconRail" ? <IconRail {...layoutProps} />
    : template === "signalBoard" ? <SignalBoard {...layoutProps} />
    : <DynamicChart {...layoutProps} />;

  return (
    <BeatTransition durationFrames={durationFrames}>
      <AbsoluteFill
        style={{
          color: colors.textPrimary,
          overflow: "hidden",
          opacity: exit,
          fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
        }}
      >
        <SceneBackground accent={accent} variant={variant} />
        <CameraRig variant={variant} durationFrames={durationFrames} cameraPathId={scene.camera?.motion} active={[0, 2, 5].includes(sceneIndex)}>
          {view}
          <SceneShapes scene={scene} accent={accent} />
        </CameraRig>
        <div style={{ position: "absolute", left: safeArea.left, top: safeArea.top, transform: "translate3d(0, 0, 500px)" }}>
          <SafeText role="micro" tone="tertiary" maxLines={1} maxWidth={280} style={{ textTransform: "uppercase", letterSpacing: 1.4 }}>
            {template} / {String(scene.id ?? sceneIndex + 1).padStart(2, "0")}
          </SafeText>
        </div>
      </AbsoluteFill>
    </BeatTransition>
  );
};

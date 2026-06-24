import type { CSSProperties } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { type EngineMode, selectEngine } from "./EngineSelector";
import { engineRuntime } from "./EngineRegistry";
import type { EngineMotionSystem } from "./core/motionLayerTypes";
import { websiteData } from "./data/websiteData";

type MainVideoProps = { engineType: EngineMode };
type Scene = { id: number; type: string };
type SceneClipProps = { engineType: EngineMode; scene: Scene; sceneIndex: number };
type Palette = { bg: string; ink: string; accent: string; alt: string; panel: string };

const apps = websiteData.apps.map((app) => app.name);
const countries = websiteData.countries.map((country) => country.regionCode);
const priceRows = websiteData.apps
  .flatMap((app) => app.prices.map((price) => ({ app: app.name, region: price.regionCode, cny: price.priceCny })))
  .slice(0, 12);
const logic = websiteData.aiDecisionLogic;

const palettes: Record<EngineMode, Palette> = {
  info: { bg: "#f7efe4", ink: "#251b14", accent: "#d95b35", alt: "#9a6b22", panel: "rgba(255,255,255,.72)" },
  minimal: { bg: "#f8f7f1", ink: "#111", accent: "#111", alt: "#8d8b80", panel: "rgba(0,0,0,.04)" },
  map: { bg: "#e9f4e9", ink: "#183025", accent: "#1d8060", alt: "#b8862b", panel: "rgba(255,255,255,.72)" },
  ai: { bg: "#eef8f4", ink: "#10251f", accent: "#159b77", alt: "#476fae", panel: "rgba(255,255,255,.74)" },
  shock: { bg: "#fffaf7", ink: "#21110c", accent: "#d93a2d", alt: "#111", panel: "#fff" },
  dashboard: { bg: "#edf3f8", ink: "#102236", accent: "#256ce1", alt: "#1d8ca8", panel: "rgba(255,255,255,.78)" },
  parallax: { bg: "#f2effa", ink: "#221d35", accent: "#7058c8", alt: "#c96f42", panel: "rgba(255,255,255,.74)" },
  narrative: { bg: "#f2e4ca", ink: "#33210f", accent: "#9b5d2d", alt: "#226b67", panel: "rgba(255,250,237,.86)" },
  realtime: { bg: "#eaf4ef", ink: "#13241f", accent: "#238567", alt: "#b88b25", panel: "rgba(255,255,255,.74)" },
  walkthrough: { bg: "#f3f6ff", ink: "#101e34", accent: "#416ee8", alt: "#1a9f72", panel: "rgba(255,255,255,.82)" },
};

const sceneTimings: Record<EngineMode, number[]> = {
  info: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  minimal: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  map: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  ai: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  shock: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  dashboard: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  parallax: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  narrative: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  realtime: [66, 66, 66, 66, 66, 66, 66, 66, 72],
  walkthrough: [66, 66, 66, 66, 66, 66, 66, 66, 72],
};

const rootStyle = (palette: Palette): CSSProperties => ({
  background: palette.bg,
  color: palette.ink,
  overflow: "hidden",
  fontFamily: '"Aptos Display", "Microsoft YaHei UI", sans-serif',
});

const motionStyle = (motion: EngineMotionSystem, extra?: CSSProperties): CSSProperties => ({
  opacity: motion.transitionSystem.opacity,
  filter: `blur(${motion.transitionSystem.blur}px)`,
  transform: `translate3d(${motion.cameraSystem.x}px, ${motion.cameraSystem.y}px, 0) scale(${motion.cameraSystem.zoom}) rotate(${motion.cameraSystem.rotate}deg)`,
  transformOrigin: "center",
  ...extra,
});

const label = (text: string, palette: Palette, extra?: CSSProperties) => (
  <div style={{ position: "absolute", color: palette.ink, fontWeight: 950, ...extra }}>{text}</div>
);

const renderInfoExplosion = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => {
  const stream = [...apps, ...countries, ...priceRows.map((row) => `${row.region} ¥${row.cny}`)];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, ${palette.accent}33, transparent 46%), ${palette.bg}` }}>
      <div style={motionStyle(motion)}>
        {stream.map((item, index) => {
          const lane = index % 7;
          const x = (index * 173 + sceneIndex * 211) % 1760;
          const y = 80 + lane * 122 + ((index * 29 + sceneIndex * 47) % 54);
          return label(item, palette, {
            left: x,
            top: y,
            fontSize: 22 + (index % 5) * 10,
            color: index % 3 === 0 ? palette.alt : palette.ink,
            transform: `skewX(${(index % 4) * -5}deg)` ,
            textTransform: "uppercase",
          });
        })}
        <div style={{ position: "absolute", left: 110, top: 780, fontSize: 92, lineHeight: .9, fontWeight: 1000, color: palette.accent }}>{scene.type}</div>
      </div>
    </AbsoluteFill>
  );
};

const renderMinimal = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => (
  <AbsoluteFill style={{ background: palette.bg }}>
    <div style={motionStyle(motion, { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" })}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: palette.accent, marginRight: 42 }} />
      <main style={{ maxWidth: 980 }}>
        <div style={{ fontSize: 24, color: palette.alt, marginBottom: 34 }}>0{sceneIndex + 1}</div>
        <h1 style={{ margin: 0, fontSize: 104, letterSpacing: -6, lineHeight: .94 }}>{scene.type}</h1>
        <p style={{ width: 520, marginTop: 38, fontSize: 24, lineHeight: 1.4, color: palette.alt }}>{websiteData.platform}</p>
      </main>
    </div>
  </AbsoluteFill>
);

const renderMap = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => (
  <AbsoluteFill style={{ background: `linear-gradient(135deg, ${palette.bg}, #f9f4dc)` }}>
    <svg viewBox="0 0 1920 1080" style={motionStyle(motion, { position: "absolute", inset: 0, width: "100%", height: "100%" })}>
      <path d="M120 640 C420 360 710 710 980 420 S1470 360 1770 610" fill="none" stroke={palette.accent} strokeWidth="9" strokeLinecap="round" strokeDasharray="22 20" />
      {countries.map((country, index) => {
        const x = 210 + ((index * 227 + sceneIndex * 60) % 1450);
        const y = 245 + Math.sin(index * 1.7 + sceneIndex) * 210;
        return <g key={country}><circle cx={x} cy={y} r={26 + (index % 3) * 8} fill={index % 2 ? palette.alt : palette.accent} opacity=".82" /><text x={x + 34} y={y + 8} fill={palette.ink} fontSize="30" fontWeight="900">{country}</text></g>;
      })}
      <text x="110" y="940" fill={palette.ink} fontSize="74" fontWeight="1000">{scene.type}</text>
    </svg>
  </AbsoluteFill>
);

const renderAI = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 72% 34%, ${palette.accent}22, transparent 34%), linear-gradient(135deg, ${palette.bg}, #f8fbf2)` }}>
    <div style={motionStyle(motion, { position: "absolute", inset: 0, width: "100%", height: "100%" })}>
      <div style={{ position: "absolute", left: 120, top: 120, width: 520, fontSize: 92, lineHeight: .92, fontWeight: 1000, color: palette.ink }}>{scene.type}</div>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {logic.map((step, index) => {
          const x = 720 + index * 230;
          const y = 235 + (index % 2) * 210;
          return <g key={step}><line x1={x - 118} y1={y + 46} x2={x - 18} y2={y + 46} stroke={palette.alt} strokeWidth="10" opacity=".72" /><rect x={x} y={y} width="196" height="96" rx="48" fill={palette.accent} stroke={palette.ink} strokeWidth="4" /><text x={x + 42} y={y + 62} fill="#fff" fontSize="38" fontWeight="900">AI {index + 1}</text></g>;
        })}
      </svg>
      <div style={{ position: "absolute", left: 720, top: 760, fontSize: 42, lineHeight: 1.2, color: palette.alt, width: 920, fontWeight: 800 }}>{logic[sceneIndex % logic.length]}</div>
    </div>
  </AbsoluteFill>
);

const renderShock = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => {
  const flash = sceneIndex % 2 === 0 ? palette.bg : palette.accent;
  const text = sceneIndex % 2 === 0 ? palette.accent : palette.panel;
  return (
    <AbsoluteFill style={{ background: flash }}>
      <div style={motionStyle(motion)}>
        <div style={{ position: "absolute", left: 80, top: 80, fontSize: 42, fontWeight: 1000, color: text }}>PRICE SHOCK</div>
        <div style={{ position: "absolute", left: sceneIndex % 2 ? 920 : 140, top: 300, fontSize: 180, lineHeight: .82, fontWeight: 1000, color: text }}>{scene.type}</div>
        <div style={{ position: "absolute", right: 110, bottom: 80, fontSize: 110, fontWeight: 1000, color: sceneIndex % 2 ? palette.bg : palette.ink }}>¥68.5 / ¥196</div>
      </div>
    </AbsoluteFill>
  );
};

const renderDashboard = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => (
  <AbsoluteFill style={{ background: palette.bg, padding: 56 }}>
    <div style={motionStyle(motion, { border: `2px solid ${palette.ink}22`, height: 968, background: "#f8fbff" })}>
      <header style={{ height: 84, borderBottom: `2px solid ${palette.ink}22`, display: "flex", alignItems: "center", padding: "0 34px", fontSize: 28, fontWeight: 1000 }}>ENTERPRISE PRICE INTELLIGENCE / {scene.type}</header>
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 420px", gridTemplateRows: "260px 260px 280px", gap: 0, height: 884 }}>
        {Array.from({ length: 9 }).map((_, index) => <section key={index} style={{ borderRight: `2px solid ${palette.ink}22`, borderBottom: `2px solid ${palette.ink}22`, padding: 24, fontSize: 22, fontWeight: 900, color: index === sceneIndex ? palette.accent : palette.ink }}>{["APPS", "COUNTRIES", "PRICE TABLE", "AI LOGIC", "RISK", "SUMMARY", "REGION", "PLAN", "STATUS"][index]}</section>)}
      </div>
    </div>
  </AbsoluteFill>
);

const renderParallax = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${palette.accent}44, transparent 40%), ${palette.bg}`, perspective: 1600 }}>
    <div style={motionStyle(motion, { position: "absolute", inset: 0, transformStyle: "preserve-3d" })}>
      {apps.slice(0, 7).map((app, index) => <div key={app} style={{ position: "absolute", left: 260 + index * 170, top: 180 + (index % 3) * 140, width: 230, height: 120, borderRadius: 28, display: "grid", placeItems: "center", background: palette.panel, color: palette.ink, fontSize: 30, fontWeight: 1000, transform: `translateZ(${(index + 1) * 95}px) rotateY(${-22 + index * 7}deg)` }}>{app}</div>)}
      <div style={{ position: "absolute", left: 120, bottom: 120, fontSize: 86, fontWeight: 1000, transform: "translateZ(520px)", color: palette.alt }}>{scene.type}</div>
    </div>
  </AbsoluteFill>
);

const renderNarrative = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => (
  <AbsoluteFill style={{ background: palette.bg }}>
    <div style={motionStyle(motion)}>
      <div style={{ position: "absolute", left: 120, top: 120, width: 430, height: 760, border: `4px solid ${palette.ink}`, borderRadius: "220px 220px 24px 24px", padding: 60 }}>
        <div style={{ fontSize: 28, color: palette.accent, fontWeight: 1000 }}>CHAPTER {scene.id}</div>
        <h1 style={{ fontSize: 70, lineHeight: .95 }}>{scene.type}</h1>
      </div>
      <div style={{ position: "absolute", left: 660, top: 200, right: 120, display: "flex", gap: 0 }}>
        {['problem', 'search', 'evidence', 'choice', 'result'].map((part, index) => <div key={part} style={{ width: 210, height: 560, borderLeft: `3px solid ${palette.ink}`, padding: 28, background: index === sceneIndex ? palette.accent : 'transparent', color: index === sceneIndex ? '#fff' : palette.ink, fontSize: 32, fontWeight: 1000, writingMode: 'vertical-rl' }}>{part}</div>)}
      </div>
    </div>
  </AbsoluteFill>
);

const renderRealtime = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => (
  <AbsoluteFill style={{ background: palette.bg }}>
    <div style={motionStyle(motion)}>
      <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 90, background: palette.accent, color: palette.bg, display: "flex", alignItems: "center", paddingLeft: 60, fontSize: 34, fontWeight: 1000 }}>LIVE FEED / {scene.type}</div>
      {Array.from({ length: 18 }).map((_, index) => {
        const row = priceRows[index % priceRows.length];
        return <div key={index} style={{ position: "absolute", left: 90 + (index % 3) * 520, top: 130 + Math.floor(index / 3) * 140, width: 440, height: 92, borderBottom: `2px solid ${palette.accent}66`, color: index === sceneIndex + 3 ? palette.alt : palette.ink, fontSize: 25, fontWeight: 900 }}>{row.app} / {row.region} / ¥{row.cny}</div>;
      })}
    </div>
  </AbsoluteFill>
);

const renderWalkthrough = (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => (
  <AbsoluteFill style={{ background: palette.bg }}>
    <div style={motionStyle(motion)}>
      <div style={{ position: "absolute", left: 100, top: 90, width: 520, height: 900, borderRadius: 54, background: palette.panel, boxShadow: `0 30px 90px ${palette.accent}33`, padding: 44 }}>
        <div style={{ height: 74, borderRadius: 999, background: '#fff', padding: 22, fontWeight: 900 }}>app-card-price.tnt-pub.com</div>
        <h1 style={{ fontSize: 68, lineHeight: .94 }}>{scene.type}</h1>
      </div>
      <div style={{ position: "absolute", left: 760, top: 170, width: 900 }}>
        {['Open', 'Search', 'Compare', 'Ask AI', 'Decide'].map((step, index) => <div key={step} style={{ height: 116, marginBottom: 24, borderRadius: 999, background: index === sceneIndex ? palette.accent : palette.panel, color: index === sceneIndex ? '#fff' : palette.ink, padding: '36px 48px', fontSize: 34, fontWeight: 1000 }}>{index + 1}. {step}</div>)}
      </div>
    </div>
  </AbsoluteFill>
);

const renderByEngine: Record<EngineMode, (scene: Scene, sceneIndex: number, motion: EngineMotionSystem, palette: Palette) => React.ReactNode> = {
  info: renderInfoExplosion,
  minimal: renderMinimal,
  map: renderMap,
  ai: renderAI,
  shock: renderShock,
  dashboard: renderDashboard,
  parallax: renderParallax,
  narrative: renderNarrative,
  realtime: renderRealtime,
  walkthrough: renderWalkthrough,
};

const SceneClip: React.FC<SceneClipProps> = ({ engineType, scene, sceneIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const motion = engineRuntime[engineType].getMotion(frame, fps);
  const palette = palettes[engineType];
  return <>{renderByEngine[engineType](scene, sceneIndex, motion, palette)}</>;
};

export const MainVideo: React.FC<MainVideoProps> = ({ engineType }) => {
  const runtime = engineRuntime[engineType];
  selectEngine(engineType);
  let cursor = 0;
  return (
    <AbsoluteFill style={rootStyle(palettes[engineType])}>
      <Audio src={staticFile("reference-bgm.mp4")} volume={0.7} />
      {runtime.storyboard.scene.map((scene, index) => {
        const duration = sceneTimings[engineType][index];
        const from = cursor;
        cursor += duration;
        return (
          <Sequence key={`${engineType}-${scene.id}`} from={from} durationInFrames={duration}>
            <SceneClip engineType={engineType} scene={scene} sceneIndex={index} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

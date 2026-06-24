import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { apps } from './data';
import { getCameraForScene, getSceneRange, sceneOpacity } from './components/camera';
import { ThreeDScene, CameraRig, DepthLayer } from './components/ThreeDScene';
import { Background } from './components/Background';
import { ProductCard } from './components/ProductCard';
import { PriceComparisonTable } from './components/PriceComparisonTable';
import { RegionMap } from './components/RegionMap';
import { LiveMonitorCard } from './components/LiveMonitorCard';
import { PriceHistoryChart } from './components/PriceHistoryChart';
import { AIRecommendationCard } from './components/AIRecommendationCard';
import { ComparisonResult } from './components/ComparisonResult';
import { SearchCTA } from './components/SearchCTA';
import { SoftGlow } from './components/SoftGlow';
import { RegionalEcosystem } from './components/RegionalEcosystem';

const orbitRegions = apps[0].regions.slice(0, 10);

const PhoneProblem = () => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [96, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <div className="phone-scene">
    <div className="orbit-ring" style={{ opacity: reveal, transform: 'translate3d(0,0,150px)' }} />
    <div className="phone card" style={{ transform: 'translate3d(0,0,0) rotateX(2deg)' }}>
      <span>Current storefront</span><strong>Sample price</strong><small>Only one visible option</small>
      <div className="phone-payline" style={{ transform: 'translate3d(0,0,80px)' }}>Subscribe</div>
    </div>
    <div className="blind-spot-panel card" style={{ opacity: reveal, transform: 'translate3d(315px, 48px, 180px)' }}>
      <b>Hidden comparison layer</b>
      <p>Other regions, trends and risks are not shown on the normal checkout screen.</p>
    </div>
    {orbitRegions.map((r, i) => {
      const angle = frame / 28 + (i / orbitRegions.length) * Math.PI * 2;
      const x = Math.cos(angle) * 405;
      const y = Math.sin(angle) * 178;
      const z = 190 + Math.sin(angle) * 56;
      return <div key={r.regionCode} className="orbit-dot orbit-dot-v3" style={{ opacity: reveal, transform: `translate3d(${x}px, ${y}px, ${z}px)` }}>{r.regionCode}</div>;
    })}
  </div>;
};

const FrameCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div className="frame-counter">Frame {frame} · {Math.floor(frame / fps).toString().padStart(2, '0')}:{(frame % fps).toString().padStart(2, '0')}</div>;
};

const SceneTitle: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 96 }) => <div className="scene-title" style={{ top, transform: 'translate3d(-50%,0,150px)' }}>{children}</div>;

const scenes = [
  { title: '订阅价格，不止一个答案', bg: 'map' as const, ui: <ProductCard />, fg: <SoftGlow x={1160} y={180} /> },
  { title: '但大多数人，只看到一个价格。', bg: 'map' as const, ui: <PhoneProblem />, fg: <SoftGlow x={1180} y={560} color="rgba(47,128,237,.12)" /> },
  { title: '全球 App Store 订阅价格，一屏对比。', bg: 'map' as const, ui: <div className="two-col"><RegionMap /><PriceComparisonTable /></div>, fg: <SoftGlow x={300} y={610} color="rgba(34,160,107,.16)" /> },
  { title: '每次打开，都是新的地区信号。', bg: 'grid' as const, ui: <LiveMonitorCard />, fg: <div className="scan-note" style={{ transform: 'translate3d(1240px,710px,220px)' }}>自动刷新</div> },
  { title: '不只看现在，还能看到过去。', bg: 'chart' as const, ui: <PriceHistoryChart />, fg: <SoftGlow x={1180} y={560} color="rgba(34,160,107,.12)" /> },
  { title: '不同国家，也有不同订阅优势。', bg: 'grid' as const, ui: <RegionalEcosystem />, fg: <SoftGlow x={260} y={610} color="rgba(47,128,237,.10)" /> },
  { title: 'AI Recommendation', bg: 'grid' as const, ui: <AIRecommendationCard />, fg: <SoftGlow x={320} y={650} color="rgba(47,128,237,.13)" /> },
  { title: '同一个订阅，你可能一直买贵了。', bg: 'map' as const, ui: <ComparisonResult />, fg: <div className="result-note" style={{ transform: 'translate3d(1110px,740px,220px)' }}>基于实时数据计算</div> },
  { title: '', bg: 'map' as const, ui: <SearchCTA />, fg: <SoftGlow x={1220} y={220} color="rgba(47,128,237,.16)" /> },
];

export const AppCardPricePromo: React.FC<{ showFrameCounter?: boolean }> = ({ showFrameCounter = false }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill className="promo-root">
    {scenes.map((scene, i) => {
      const { start } = getSceneRange(i);
      const camera = getCameraForScene(i, frame - start);
      const opacity = sceneOpacity(frame, i);
      return <ThreeDScene key={i} opacity={opacity}>
        <CameraRig camera={camera}>
          <DepthLayer camera={camera} depth="background" z={i === 2 ? -560 : -480}><Background variant={scene.bg} /></DepthLayer>
          <DepthLayer camera={camera} depth="ui" z={0}><SceneTitle>{scene.title}</SceneTitle>{scene.ui}</DepthLayer>
          <DepthLayer camera={camera} depth="foreground" z={280}>{scene.fg}</DepthLayer>
        </CameraRig>
      </ThreeDScene>;
    })}
    {showFrameCounter ? <FrameCounter /> : null}
  </AbsoluteFill>;
};

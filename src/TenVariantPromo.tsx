import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { aiDecisionLogic, allApps, countries, selectedApps } from './sharedSourceData';

type VariantId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type SceneKey = 'cover' | 'apps' | 'countries' | 'prices' | 'logic' | 'decision' | 'cta';

type VariantConfig = {
  id: VariantId;
  name: string;
  className: string;
  camera: string;
  layout: string;
  motion: string;
  narrative: string;
  tone: string;
  order: SceneKey[];
};

const sceneDuration = 128;

const variants: Record<VariantId, VariantConfig> = {
  1: {
    id: 1,
    name: 'Website Atlas',
    className: 'v-radar',
    camera: 'slow orbital map dolly',
    layout: 'radar center with orbiting cards',
    motion: 'rotating sweeps and pulse pins',
    narrative: 'open website, search subscription, compare regions',
    tone: 'warm atlas editorial',
    order: ['cover', 'apps', 'countries', 'prices', 'logic', 'decision', 'cta'],
  },
  2: {
    id: 2,
    name: 'Price Terminal',
    className: 'v-terminal',
    camera: 'fixed analyst workstation',
    layout: 'multi-panel market terminal',
    motion: 'ticker wipes and row scans',
    narrative: 'market terminal reads website pricing tables',
    tone: 'clean financial blue',
    order: ['cover', 'prices', 'apps', 'countries', 'logic', 'decision', 'cta'],
  },
  3: {
    id: 3,
    name: 'App Shelf',
    className: 'v-conveyor',
    camera: 'side tracking shot',
    layout: 'horizontal subscription conveyor',
    motion: 'staggered belt movement',
    narrative: 'browse the website like a subscription storefront',
    tone: 'soft retail packaging',
    order: ['cover', 'apps', 'prices', 'countries', 'logic', 'decision', 'cta'],
  },
  4: {
    id: 4,
    name: 'Decision Lab',
    className: 'v-lab',
    camera: 'microscope push-in',
    layout: 'glass lab bench and specimen cards',
    motion: 'measured reveal and scan beams',
    narrative: 'AI evaluates website price evidence',
    tone: 'clinical white and mint',
    order: ['cover', 'logic', 'apps', 'countries', 'prices', 'decision', 'cta'],
  },
  5: {
    id: 5,
    name: 'Region Passport',
    className: 'v-passport',
    camera: 'top-down document table',
    layout: 'passport pages and stamped regions',
    motion: 'paper slides and stamp hits',
    narrative: 'move through website-supported countries',
    tone: 'paper travel archive',
    order: ['cover', 'countries', 'apps', 'prices', 'logic', 'decision', 'cta'],
  },
  6: {
    id: 6,
    name: 'Buyer Audit',
    className: 'v-split',
    camera: 'locked split-screen compare',
    layout: 'left question right evidence',
    motion: 'hard cuts and synchronized counters',
    narrative: 'single checkout price versus website comparison',
    tone: 'broadcast explainer',
    order: ['cover', 'prices', 'countries', 'apps', 'logic', 'decision', 'cta'],
  },
  7: {
    id: 7,
    name: 'Launch Editorial',
    className: 'v-magazine',
    camera: 'page-turn editorial zoom',
    layout: 'large type with inset data plates',
    motion: 'page masks and typographic slides',
    narrative: 'website feature story in editorial spreads',
    tone: 'premium print editorial',
    order: ['cover', 'apps', 'logic', 'prices', 'countries', 'decision', 'cta'],
  },
  8: {
    id: 8,
    name: 'Subscription Ops',
    className: 'v-command',
    camera: 'wide war-room wall',
    layout: 'mission tiles and map board',
    motion: 'status lights and command pings',
    narrative: 'monitor website signals before purchase',
    tone: 'calm operations room',
    order: ['cover', 'countries', 'prices', 'apps', 'logic', 'decision', 'cta'],
  },
  9: {
    id: 9,
    name: 'AI Route Map',
    className: 'v-flow',
    camera: 'vertical process pan',
    layout: 'decision graph and connected nodes',
    motion: 'line drawing and node activation',
    narrative: 'website data enters AI decision route',
    tone: 'minimal product diagram',
    order: ['cover', 'logic', 'countries', 'apps', 'prices', 'decision', 'cta'],
  },
  10: {
    id: 10,
    name: 'Browser Gallery',
    className: 'v-storefront',
    camera: 'gallery walk-through',
    layout: 'app storefront shelves',
    motion: 'depth parallax and shelf spotlight',
    narrative: 'browser-based product tour',
    tone: 'bright consumer showcase',
    order: ['cover', 'apps', 'countries', 'logic', 'prices', 'decision', 'cta'],
  },
};

const visibleApps = selectedApps;
const primaryApp = selectedApps[0];
const primaryPrices = [...primaryApp.prices].sort((a, b) => a.priceCny - b.priceCny);
const lowest = primaryPrices[0];
const highest = primaryPrices[primaryPrices.length - 1];

const formatPrice = (price: (typeof primaryApp.prices)[number]) =>
  `${price.regionNameZh} ${price.currencySymbol}${price.priceLocal} / ¥${price.priceCny}`;

const BrowserShell: React.FC<{ children: React.ReactNode; compact?: boolean }> = ({ children, compact = false }) => (
  <div className={`browser-shell ${compact ? 'browser-shell-compact' : ''}`}>
    <div className="browser-bar">
      <i />
      <i />
      <i />
      <span>app-card-price.tnt-pub.com</span>
      <b>SubPrice AI</b>
    </div>
    <div className="browser-content">{children}</div>
  </div>
);

const useSceneProgress = (sceneIndex: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - sceneIndex * sceneDuration;
  const visible =
    local < 0 || local > sceneDuration
      ? 0
      : sceneIndex === 0
        ? interpolate(local, [sceneDuration - 18, sceneDuration], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        : interpolate(local, [0, 18, sceneDuration - 18, sceneDuration], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
  return {
    local,
    inOut: visible,
    pop: spring({ frame: Math.max(0, local), fps, config: { damping: 18, stiffness: 120 } }),
  };
};

const SceneShell: React.FC<{
  variant: VariantConfig;
  sceneIndex: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}> = ({ variant, sceneIndex, eyebrow, title, children }) => {
  const { inOut, local } = useSceneProgress(sceneIndex);
  const shift = variant.id % 2 === 0 ? 42 : -42;
  const y = interpolate(local, [0, 32], [shift, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill
      className={`variant-scene scene-${sceneIndex}`}
      style={{ opacity: inOut, transform: `translate3d(0, ${y}px, 0)` }}
    >
      <div className="variant-meta">
        <span>{eyebrow}</span>
        <b>{variant.name}</b>
      </div>
      <h1 className="variant-title">{title}</h1>
      {children}
    </AbsoluteFill>
  );
};

const AppMark: React.FC<{ app: (typeof selectedApps)[number]; index: number }> = ({ app, index }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame % sceneDuration, [0, 24 + index * 4], [0.84, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div className="variant-app" style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 24}px)` }}>
      <div className="variant-icon">
        <span>{app.name.slice(0, 2)}</span>
      </div>
      <strong>{app.name}</strong>
      <small>{app.planName}</small>
    </div>
  );
};

const CoverScene: React.FC<{ variant: VariantConfig; sceneIndex: number }> = ({ variant, sceneIndex }) => (
  <SceneShell variant={variant} sceneIndex={sceneIndex} eyebrow="SubPrice AI Website" title="打开网站，先看全球订阅价格">
    <div className="cover-board">
      <div>
        <p>宣传对象：app-card-price.tnt-pub.com。每个版本都共用同一份网站数据快照、同一套 AI 判断逻辑。</p>
        <strong>{allApps.length} apps</strong>
        <strong>{countries.length} regions</strong>
      </div>
      <BrowserShell>
        <div className="site-hero-card">
          <b>全球 AI / App 订阅价格对比</b>
          <span>Search app, compare regions, decide with AI.</span>
          <div className="site-search">Search ChatGPT, Claude, Gemini...</div>
        </div>
        <div className="cover-stack">
          {visibleApps.slice(0, 4).map((app, i) => (
            <AppMark app={app} index={i} key={app.slug} />
          ))}
        </div>
      </BrowserShell>
    </div>
  </SceneShell>
);

const AppsScene: React.FC<{ variant: VariantConfig; sceneIndex: number }> = ({ variant, sceneIndex }) => (
  <SceneShell variant={variant} sceneIndex={sceneIndex} eyebrow="Website app cards" title="网站里的订阅服务，一次扫完">
    <BrowserShell compact>
      <div className="app-grid">
        {visibleApps.map((app, i) => (
          <AppMark app={app} index={i} key={app.slug} />
        ))}
      </div>
    </BrowserShell>
  </SceneShell>
);

const CountriesScene: React.FC<{ variant: VariantConfig; sceneIndex: number }> = ({ variant, sceneIndex }) => {
  const frame = useCurrentFrame();
  return (
    <SceneShell variant={variant} sceneIndex={sceneIndex} eyebrow="Website country layer" title="同一订阅，网站按国家展开价格层">
      <div className="country-orbit">
        {countries.map((country, i) => {
          const angle = frame / (42 + variant.id) + (i / countries.length) * Math.PI * 2;
          const x = Math.cos(angle) * (420 + variant.id * 4);
          const y = Math.sin(angle) * (210 + variant.id * 2);
          return (
            <div className="country-chip" key={country.regionCode} style={{ transform: `translate(${x}px, ${y}px)` }}>
              <b>{country.regionCode}</b>
              <span>{country.regionNameZh}</span>
              <em>{country.currencyCode}</em>
            </div>
          );
        })}
        <div className="country-core">Global price signal</div>
      </div>
    </SceneShell>
  );
};

const PricesScene: React.FC<{ variant: VariantConfig; sceneIndex: number }> = ({ variant, sceneIndex }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...primaryPrices.map((price) => price.priceCny));
  return (
    <SceneShell variant={variant} sceneIndex={sceneIndex} eyebrow="Website pricing table" title={`从网站价格表读取 ${primaryApp.name}`}>
      <div className="price-stage">
        <div className="price-table">
          {primaryPrices.map((price, i) => {
            const width = interpolate(frame - sceneIndex * sceneDuration, [10 + i * 4, 44 + i * 4], [0, price.priceCny / max], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div className="price-bar-row" key={price.regionCode}>
                <span>{price.regionNameZh}</span>
                <i style={{ transform: `scaleX(${width})` }} />
                <b>{price.currencySymbol}{price.priceLocal}</b>
                <em>¥{price.priceCny}</em>
              </div>
            );
          })}
        </div>
        <div className="price-callout">
          <small>Lowest visible</small>
          <strong>{formatPrice(lowest)}</strong>
          <small>Highest visible</small>
          <strong>{formatPrice(highest)}</strong>
        </div>
      </div>
    </SceneShell>
  );
};

const LogicScene: React.FC<{ variant: VariantConfig; sceneIndex: number }> = ({ variant, sceneIndex }) => (
  <SceneShell variant={variant} sceneIndex={sceneIndex} eyebrow="AI decision from website data" title="AI 判断逻辑：只排序和提示，不改数据">
    <div className="logic-flow">
      {aiDecisionLogic.map((step, i) => (
        <div className="logic-node" key={step}>
          <b>{String(i + 1).padStart(2, '0')}</b>
          <span>{step}</span>
        </div>
      ))}
    </div>
  </SceneShell>
);

const DecisionScene: React.FC<{ variant: VariantConfig; sceneIndex: number }> = ({ variant, sceneIndex }) => (
  <SceneShell variant={variant} sceneIndex={sceneIndex} eyebrow="Purchase decision" title="购买前，让网站先给出判断依据">
    <div className="decision-card">
      <span>AI recommendation uses the shared source data</span>
      <h2>{primaryApp.name} · {lowest.regionNameZh}</h2>
      <p>低价信号：{formatPrice(lowest)}。风险提示与趋势判断必须跟随同一份数据源。</p>
      <div className="decision-pills">
        <b>price normalized</b>
        <b>region ranked</b>
        <b>risk checked</b>
      </div>
    </div>
  </SceneShell>
);

const CtaScene: React.FC<{ variant: VariantConfig; sceneIndex: number }> = ({ variant, sceneIndex }) => (
  <SceneShell variant={variant} sceneIndex={sceneIndex} eyebrow="Website CTA" title="现在打开网站，查一下正在用的订阅">
    <div className="variant-search">
      <span>app-card-price.tnt-pub.com</span>
      <b>SubPrice AI</b>
    </div>
    <div className="system-proof">
      <p>Camera: {variant.camera}</p>
      <p>Layout: {variant.layout}</p>
      <p>Motion: {variant.motion}</p>
      <p>Narrative: {variant.narrative}</p>
      <p>Tone: {variant.tone}</p>
    </div>
  </SceneShell>
);

const sceneMap: Record<SceneKey, React.FC<{ variant: VariantConfig; sceneIndex: number }>> = {
  cover: CoverScene,
  apps: AppsScene,
  countries: CountriesScene,
  prices: PricesScene,
  logic: LogicScene,
  decision: DecisionScene,
  cta: CtaScene,
};

const VariantBackground: React.FC<{ variant: VariantConfig }> = ({ variant }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill className={`variant-bg ${variant.className}`}>
      <div className="variant-noise" />
      <div className="variant-sweep" style={{ transform: `translateX(${(frame * (variant.id + 2)) % 2200 - 300}px)` }} />
      <div className="variant-watermark">SubPrice AI / shared data / v{variant.id}</div>
    </AbsoluteFill>
  );
};

export const TenVariantPromo: React.FC<{ variantId: VariantId }> = ({ variantId }) => {
  const variant = variants[variantId];
  return (
    <AbsoluteFill className={`variant-root ${variant.className}`}>
      <VariantBackground variant={variant} />
      {variant.order.map((key, sceneIndex) => {
        const Scene = sceneMap[key];
        return <Scene key={key} variant={variant} sceneIndex={sceneIndex} />;
      })}
      <Audio src={staticFile('reference-bgm.mp4')} volume={0.72} />
    </AbsoluteFill>
  );
};

export const variantConfigs = variants;

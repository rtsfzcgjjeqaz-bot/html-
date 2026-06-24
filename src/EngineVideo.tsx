import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { aiDecisionLogic, allApps, countries, selectedApps } from "./sharedSourceData";
import type { EngineMode, VideoEngine } from "./core/types";
import type { StoryScene } from "./core/storyboard/types";
import { resolveMotionSystem } from "./core/motion/resolveMotionSystem";
import { engines } from "./engines";

const sceneDuration = 180;
const featuredApp = selectedApps[0];
const sortedPrices = [...featuredApp.prices].sort((a, b) => a.priceCny - b.priceCny);
const lowPrice = sortedPrices[0];
const highPrice = sortedPrices[sortedPrices.length - 1];

type EngineVideoProps = {
  engineMode: EngineMode;
};

const priceLabel = (price: (typeof sortedPrices)[number]) =>
  `${price.regionNameZh} ${price.currencySymbol}${price.priceLocal} / ¥${price.priceCny}`;

const sceneCopy: Record<StoryScene["purpose"], { eyebrow: string; title: string; body: string }> = {
  hook: {
    eyebrow: "App-Card-Price",
    title: "Global subscription prices are not one price.",
    body: `${allApps.length} apps, ${countries.length} regions, one website for subscription price intelligence.`,
  },
  comparison: {
    eyebrow: "Price comparison",
    title: `${featuredApp.name}: lowest and highest visible prices split apart.` ,
    body: `Lowest: ${priceLabel(lowPrice)}. Highest: ${priceLabel(highPrice)}.`,
  },
  insight: {
    eyebrow: "Regional insight",
    title: "Country, currency, and plan data stay attached to every app.",
    body: "The platform keeps the subscription context visible before purchase.",
  },
  "AI decision": {
    eyebrow: "AI decision",
    title: "AI ranks the signal, but never rewrites the source price.",
    body: aiDecisionLogic.slice(0, 3).join(" · "),
  },
  summary: {
    eyebrow: "Website CTA",
    title: "Check the subscription before you pay.",
    body: "app-card-price.tnt-pub.com",
  },
  input: {
    eyebrow: "Input",
    title: "Start with one app name from the website search.",
    body: "ChatGPT, Claude, Gemini, Spotify, Netflix, iCloud+, and more.",
  },
  analysis: {
    eyebrow: "Analysis",
    title: "Normalize region prices into comparable signals.",
    body: aiDecisionLogic[0],
  },
  decision: {
    eyebrow: "Decision",
    title: `Recommended signal: ${lowPrice.regionNameZh}.`,
    body: priceLabel(lowPrice),
  },
  baseline: {
    eyebrow: "Baseline",
    title: "The checkout screen shows one local subscription price.",
    body: "That single number hides the global spread.",
  },
  disruption: {
    eyebrow: "Disruption",
    title: "App-Card-Price reveals the price gap instantly.",
    body: `Compare ${sortedPrices.length} visible ${featuredApp.name} regions in one view.`,
  },
  "contrast reveal": {
    eyebrow: "Contrast",
    title: `${priceLabel(lowPrice)} versus ${priceLabel(highPrice)}.` ,
    body: "The same plan can look very different by region.",
  },
  "system loading": {
    eyebrow: "System loading",
    title: "Load app list, country layer, pricing table, and AI decision.",
    body: "A dashboard-style build from the same source dataset.",
  },
  "panel build": {
    eyebrow: "Panel build",
    title: "App cards, country chips, and price bars assemble into one dashboard.",
    body: "No per-video data mutation is allowed.",
  },
  "full overview": {
    eyebrow: "Overview",
    title: "One screen for subscription intelligence.",
    body: `${selectedApps.length} featured apps shown from the larger ${allApps.length}-app set.`,
  },
  entry: {
    eyebrow: "Entry",
    title: "Enter the App-Card-Price data space.",
    body: "Apps, countries, and prices become separate depth layers.",
  },
  "depth immersion": {
    eyebrow: "Depth",
    title: "Move through app cards and region signals.",
    body: "The camera changes, the dataset does not.",
  },
  "orbit reveal": {
    eyebrow: "Orbit",
    title: "Regions orbit around a single subscription question.",
    body: `Current focus: ${featuredApp.name} ${featuredApp.planName}.`,
  },
  problem: {
    eyebrow: "Problem",
    title: "A user is about to renew without checking the global price.",
    body: "Most subscription decisions start with incomplete information.",
  },
  discovery: {
    eyebrow: "Discovery",
    title: "They search the app on App-Card-Price.",
    body: "The website turns one price into a ranked regional comparison.",
  },
  resolution: {
    eyebrow: "Resolution",
    title: "The decision becomes evidence-based.",
    body: "Check price, compare country, read AI signal, then subscribe.",
  },
  "continuous stream": {
    eyebrow: "Realtime feed",
    title: "Subscription price signals keep streaming in.",
    body: "The feed format emphasizes freshness and monitoring.",
  },
  anomaly: {
    eyebrow: "Anomaly",
    title: "A region becomes unusually attractive.",
    body: `Highlighted signal: ${priceLabel(lowPrice)}.`,
  },
  highlight: {
    eyebrow: "Highlight",
    title: "Turn the anomaly into a buying checkpoint.",
    body: "The platform surfaces what deserves attention.",
  },
  "step 1": {
    eyebrow: "Step 1",
    title: "Search the subscription app.",
    body: "Start from the website search bar.",
  },
  "step 2": {
    eyebrow: "Step 2",
    title: "Compare countries and currencies.",
    body: "Read the global price table before buying.",
  },
  "step 3": {
    eyebrow: "Step 3",
    title: "Use AI decision logic as the final checkpoint.",
    body: "Normalize, rank, check risk, then decide.",
  },
};

const AppStrip = () => (
  <div className="engine-app-strip">
    {selectedApps.slice(0, 10).map((app) => (
      <div className="engine-app-card" key={app.slug}>
        <b>{app.name.slice(0, 2)}</b>
        <span>{app.name}</span>
        <small>{app.planName}</small>
      </div>
    ))}
  </div>
);

const PriceBars = () => {
  const max = Math.max(...sortedPrices.map((price) => price.priceCny));
  return (
    <div className="engine-price-bars">
      {sortedPrices.map((price) => (
        <div className="engine-price-row" key={price.regionCode}>
          <span>{price.regionNameZh}</span>
          <i style={{ width: `${(price.priceCny / max) * 100}%` }} />
          <b>{price.currencySymbol}{price.priceLocal}</b>
          <em>¥{price.priceCny}</em>
        </div>
      ))}
    </div>
  );
};

const CountryCloud = () => (
  <div className="engine-country-cloud">
    {countries.map((country) => (
      <div className="engine-country-chip" key={country.regionCode}>
        <b>{country.regionCode}</b>
        <span>{country.regionNameZh}</span>
        <em>{country.currencyCode}</em>
      </div>
    ))}
  </div>
);

const LogicStack = () => (
  <div className="engine-logic-stack">
    {aiDecisionLogic.map((logic, index) => (
      <div className="engine-logic-node" key={logic}>
        <b>{index + 1}</b>
        <span>{logic}</span>
      </div>
    ))}
  </div>
);

const VisualPayload: React.FC<{ purpose: StoryScene["purpose"] }> = ({ purpose }) => {
  if (["comparison", "baseline", "disruption", "contrast reveal"].includes(purpose)) {
    return <PriceBars />;
  }
  if (["insight", "orbit reveal", "depth immersion"].includes(purpose)) {
    return <CountryCloud />;
  }
  if (["AI decision", "analysis", "decision", "resolution", "step 3"].includes(purpose)) {
    return <LogicStack />;
  }
  return <AppStrip />;
};

const SceneFrame: React.FC<{
  engine: VideoEngine;
  scene: StoryScene;
  index: number;
}> = ({ engine, scene, index }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - index * sceneDuration;
  const motion = resolveMotionSystem(engine.config, localFrame);
  const copy = sceneCopy[scene.purpose];
  const visible = localFrame < 0 || localFrame > sceneDuration
    ? 0
    : index === 0
      ? interpolate(localFrame, [sceneDuration - 18, sceneDuration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(localFrame, [0, 18, sceneDuration - 18, sceneDuration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      className="engine-scene"
      style={{
        opacity: visible,
        transform: `translate3d(${motion.cameraSystem.x}px, ${motion.cameraSystem.y}px, 0) scale(${motion.cameraSystem.zoom})`,
      }}
    >
      <div className="engine-browser">
        <div className="engine-browser-bar">
          <i /><i /><i />
          <span>app-card-price.tnt-pub.com</span>
          <b>{engine.name}</b>
        </div>
        <div className="engine-content">
          <div className="engine-copy">
            <small>{copy.eyebrow}</small>
            <h1>{copy.title}</h1>
            <p>{copy.body}</p>
          </div>
          <VisualPayload purpose={scene.purpose} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const EngineVideo: React.FC<EngineVideoProps> = ({ engineMode }) => {
  const engine = engines[engineMode];
  return (
    <AbsoluteFill className={`engine-root mode-${engine.mode} layout-${engine.config.layoutMode} density-${engine.config.density} depth-${engine.config.depthEnabled ? "on" : "off"}`}>
      <div className="engine-bg-grid" />
      <div className="engine-bg-orb engine-bg-orb-a" />
      <div className="engine-bg-orb engine-bg-orb-b" />
      {engine.storyboard.scene.map((scene, index) => (
        <SceneFrame engine={engine} scene={scene} index={index} key={`${engine.mode}-${scene.id}`} />
      ))}
      <Audio src={staticFile("reference-bgm.mp4")} volume={0.72} />
    </AbsoluteFill>
  );
};

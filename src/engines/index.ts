import { AIDecisionEngine } from "./AIDecisionEngine";
import { AppleMinimalEngine } from "./AppleMinimalEngine";
import { DashboardEngine } from "./DashboardEngine";
import { GlobalMapEngine } from "./GlobalMapEngine";
import { InfoExplosionEngine } from "./InfoExplosionEngine";
import { NarrativeEngine } from "./NarrativeEngine";
import { ParallaxEngine } from "./ParallaxEngine";
import { PriceShockEngine } from "./PriceShockEngine";
import { RealtimeEngine } from "./RealtimeEngine";
import { WalkthroughEngine } from "./WalkthroughEngine";
import type { EngineMode, VideoEngine } from "../core/types";

export const engines: Record<EngineMode, VideoEngine> = {
  info: InfoExplosionEngine,
  minimal: AppleMinimalEngine,
  map: GlobalMapEngine,
  ai: AIDecisionEngine,
  shock: PriceShockEngine,
  dashboard: DashboardEngine,
  parallax: ParallaxEngine,
  narrative: NarrativeEngine,
  realtime: RealtimeEngine,
  walkthrough: WalkthroughEngine,
};

export const engineModes = Object.keys(engines) as EngineMode[];

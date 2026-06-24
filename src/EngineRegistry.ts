import type { EngineMode } from "./EngineSelector";
import type { EngineMotionSystem } from "./core/motionLayerTypes";
import { config as aiConfig } from "./engines/ai/config";
import { getMotion as aiMotion } from "./engines/ai/motion";
import { storyboard as aiStoryboard } from "./engines/ai/storyboard";
import { config as dashboardConfig } from "./engines/dashboard/config";
import { getMotion as dashboardMotion } from "./engines/dashboard/motion";
import { storyboard as dashboardStoryboard } from "./engines/dashboard/storyboard";
import { config as infoConfig } from "./engines/info/config";
import { getMotion as infoMotion } from "./engines/info/motion";
import { storyboard as infoStoryboard } from "./engines/info/storyboard";
import { config as mapConfig } from "./engines/map/config";
import { getMotion as mapMotion } from "./engines/map/motion";
import { storyboard as mapStoryboard } from "./engines/map/storyboard";
import { config as minimalConfig } from "./engines/minimal/config";
import { getMotion as minimalMotion } from "./engines/minimal/motion";
import { storyboard as minimalStoryboard } from "./engines/minimal/storyboard";
import { config as narrativeConfig } from "./engines/narrative/config";
import { getMotion as narrativeMotion } from "./engines/narrative/motion";
import { storyboard as narrativeStoryboard } from "./engines/narrative/storyboard";
import { config as parallaxConfig } from "./engines/parallax/config";
import { getMotion as parallaxMotion } from "./engines/parallax/motion";
import { storyboard as parallaxStoryboard } from "./engines/parallax/storyboard";
import { config as realtimeConfig } from "./engines/realtime/config";
import { getMotion as realtimeMotion } from "./engines/realtime/motion";
import { storyboard as realtimeStoryboard } from "./engines/realtime/storyboard";
import { config as shockConfig } from "./engines/shock/config";
import { getMotion as shockMotion } from "./engines/shock/motion";
import { storyboard as shockStoryboard } from "./engines/shock/storyboard";
import { config as walkthroughConfig } from "./engines/walkthrough/config";
import { getMotion as walkthroughMotion } from "./engines/walkthrough/motion";
import { storyboard as walkthroughStoryboard } from "./engines/walkthrough/storyboard";

type EngineRuntime = {
  config: {
    layoutMode: string;
    cameraMode: string;
    motionStyle: string;
    density: "low" | "medium" | "high";
    transitionType: string;
    depthEnabled: boolean;
  };
  storyboard: { scene: readonly { id: number; type: string }[] };
  getMotion: (frame: number, fps: number) => EngineMotionSystem;
};

export const engineRuntime: Record<EngineMode, EngineRuntime> = {
  info: { config: infoConfig, storyboard: infoStoryboard, getMotion: infoMotion },
  minimal: { config: minimalConfig, storyboard: minimalStoryboard, getMotion: minimalMotion },
  map: { config: mapConfig, storyboard: mapStoryboard, getMotion: mapMotion },
  ai: { config: aiConfig, storyboard: aiStoryboard, getMotion: aiMotion },
  shock: { config: shockConfig, storyboard: shockStoryboard, getMotion: shockMotion },
  dashboard: { config: dashboardConfig, storyboard: dashboardStoryboard, getMotion: dashboardMotion },
  parallax: { config: parallaxConfig, storyboard: parallaxStoryboard, getMotion: parallaxMotion },
  narrative: { config: narrativeConfig, storyboard: narrativeStoryboard, getMotion: narrativeMotion },
  realtime: { config: realtimeConfig, storyboard: realtimeStoryboard, getMotion: realtimeMotion },
  walkthrough: { config: walkthroughConfig, storyboard: walkthroughStoryboard, getMotion: walkthroughMotion },
};

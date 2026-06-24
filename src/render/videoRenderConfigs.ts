import type { EngineMode } from "../EngineSelector";

export type VideoRenderConfig = {
  name: string;
  engineType: EngineMode;
  compositionId: string;
  outputFile: string;
};

export const videoRenderConfigs: VideoRenderConfig[] = [
  {
    name: "InfoExplosion",
    engineType: "info",
    compositionId: "AppCardPriceFactory-info",
    outputFile: "public/renders/InfoExplosion.mp4",
  },
  {
    name: "Minimal",
    engineType: "minimal",
    compositionId: "AppCardPriceFactory-minimal",
    outputFile: "public/renders/Minimal.mp4",
  },
  {
    name: "Map",
    engineType: "map",
    compositionId: "AppCardPriceFactory-map",
    outputFile: "public/renders/Map.mp4",
  },
  {
    name: "AI",
    engineType: "ai",
    compositionId: "AppCardPriceFactory-ai",
    outputFile: "public/renders/AI.mp4",
  },
  {
    name: "Shock",
    engineType: "shock",
    compositionId: "AppCardPriceFactory-shock",
    outputFile: "public/renders/Shock.mp4",
  },
  {
    name: "Dashboard",
    engineType: "dashboard",
    compositionId: "AppCardPriceFactory-dashboard",
    outputFile: "public/renders/Dashboard.mp4",
  },
  {
    name: "Parallax",
    engineType: "parallax",
    compositionId: "AppCardPriceFactory-parallax",
    outputFile: "public/renders/Parallax.mp4",
  },
  {
    name: "Narrative",
    engineType: "narrative",
    compositionId: "AppCardPriceFactory-narrative",
    outputFile: "public/renders/Narrative.mp4",
  },
  {
    name: "Realtime",
    engineType: "realtime",
    compositionId: "AppCardPriceFactory-realtime",
    outputFile: "public/renders/Realtime.mp4",
  },
  {
    name: "Walkthrough",
    engineType: "walkthrough",
    compositionId: "AppCardPriceFactory-walkthrough",
    outputFile: "public/renders/Walkthrough.mp4",
  },
];

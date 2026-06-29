import { websiteHeroAngledProductSurfaceAtomicMotions } from "../../atomic/websiteHeroAngledProductSurface";

export type WebsiteHeroAngledProductSurfaceTrack = {
  trackId: string;
  motionId: (typeof websiteHeroAngledProductSurfaceAtomicMotions)[number];
  target: string;
  layer: "website" | "semantic" | "title" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const websiteHeroAngledProductSurfaceTracks: WebsiteHeroAngledProductSurfaceTrack[] = [
  {
    trackId: "track-macHeroSurfaceEnter",
    motionId: "macHeroSurfaceEnter",
    target: "heroSurface",
    layer: "website",
    startPercent: 0,
    endPercent: 34,
    role: "entry",
    purpose: "Bring the angled product surface into view.",
    semanticTarget: "macSource.heroSurface",
  },
  {
    trackId: "track-macHeroSidebarReveal",
    motionId: "macHeroSidebarReveal",
    target: "supportPanel",
    layer: "semantic",
    startPercent: 10,
    endPercent: 42,
    role: "build",
    purpose: "Reveal article-backed support rows.",
    semanticTarget: "article.supportingRows",
  },
  {
    trackId: "track-macHeroHeaderSettle",
    motionId: "macHeroHeaderSettle",
    target: "headline",
    layer: "title",
    startPercent: 20,
    endPercent: 48,
    role: "message-hierarchy",
    purpose: "Lock the article headline into the hero area.",
    semanticTarget: "article.headline",
  },
  {
    trackId: "track-macHeroContentCard",
    motionId: "macHeroContentCard",
    target: "evidenceCard",
    layer: "semantic",
    startPercent: 44,
    endPercent: 78,
    role: "emphasis",
    purpose: "Emphasize a source-backed article claim.",
    semanticTarget: "article.evidence",
  },
  {
    trackId: "track-macHeroReadableHold",
    motionId: "macHeroReadableHold",
    target: "fullComposition",
    layer: "camera",
    startPercent: 78,
    endPercent: 100,
    role: "settle",
    purpose: "Hold the completed layout for readability.",
  },
];
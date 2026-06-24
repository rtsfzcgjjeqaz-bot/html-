import { websiteHeroAngledPushInAtomicMotions } from "../../atomic/websiteHeroAngledPushIn";

export type WebsiteHeroAngledPushInTrack = {
  trackId: string;
  motionId: (typeof websiteHeroAngledPushInAtomicMotions)[number];
  target: string;
  layer: "background" | "camera" | "website" | "title" | "semantic";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const websiteHeroAngledPushInTracks: WebsiteHeroAngledPushInTrack[] = [
  {
    trackId: "track-backgroundParallax",
    motionId: "backgroundParallax",
    target: "ambientDepthGrid",
    layer: "background",
    startPercent: 0,
    endPercent: 15,
    role: "depth-establish",
    purpose: "Bring the background grid and soft atmosphere into a stable parallax field.",
  },
  {
    trackId: "track-cameraPushIn",
    motionId: "cameraPushIn",
    target: "cameraRig",
    layer: "camera",
    startPercent: 0,
    endPercent: 100,
    role: "camera-glue",
    purpose: "Bind the whole shot with a slow push-in so the layout does not feel like a static slide.",
  },
  {
    trackId: "track-websiteTiltIn",
    motionId: "websiteTiltIn",
    target: "websiteFrame",
    layer: "website",
    startPercent: 5,
    endPercent: 38,
    role: "primary-evidence-entry",
    purpose: "Introduce the generic website interface as the main visual evidence.",
  },
  {
    trackId: "track-titleReveal",
    motionId: "titleReveal",
    target: "heroTitle",
    layer: "title",
    startPercent: 18,
    endPercent: 45,
    role: "message-hierarchy",
    purpose: "Reveal the replaceable title after the website frame has started to settle.",
  },
  {
    trackId: "track-highlightBoxReveal",
    motionId: "highlightBoxReveal",
    target: "primaryHighlightBox",
    layer: "semantic",
    startPercent: 40,
    endPercent: 62,
    role: "semantic-emphasis",
    purpose: "Call out the most important website region with a reusable highlight box.",
    semanticTarget: "website.primaryConversionArea",
  },
  {
    trackId: "track-featureCardReveal",
    motionId: "featureCardReveal",
    target: "valueCards",
    layer: "semantic",
    startPercent: 55,
    endPercent: 85,
    role: "supporting-value-proof",
    purpose: "Cascade reusable value cards after the primary website area is readable.",
    semanticTarget: "valueProposition.cards",
  },
  {
    trackId: "track-softSettle",
    motionId: "softSettle",
    target: "fullComposition",
    layer: "camera",
    startPercent: 85,
    endPercent: 100,
    role: "readability-hold",
    purpose: "Slightly settle the whole layout for final readability without adding new elements.",
  },
];

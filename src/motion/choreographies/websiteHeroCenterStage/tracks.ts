import { websiteHeroCenterStageAtomicMotions } from "../../atomic/websiteHeroCenterStage";

export type WebsiteHeroCenterStageTrack = {
  trackId: string;
  motionId: (typeof websiteHeroCenterStageAtomicMotions)[number];
  target: string;
  layer: "background" | "website" | "title" | "semantic" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const websiteHeroCenterStageTracks: WebsiteHeroCenterStageTrack[] = [
  { trackId: "track-heroDeskBackdropDrift", motionId: "heroDeskBackdropDrift", target: "heroDeskBackdrop", layer: "background", startPercent: 0, endPercent: 100, role: "depth-establish", purpose: "Create a restrained centered website-hero stage." },
  { trackId: "track-laptopFrameRise", motionId: "laptopFrameRise", target: "laptopFrame", layer: "website", startPercent: 4, endPercent: 32, role: "primary-website-entry", purpose: "Lift a centered laptop/browser frame into view.", semanticTarget: "website.centerFrame" },
  { trackId: "track-browserContentWipe", motionId: "browserContentWipe", target: "browserContent", layer: "website", startPercent: 20, endPercent: 48, role: "website-content-reveal", purpose: "Reveal generic browser content without source UI.", semanticTarget: "website.heroContent" },
  { trackId: "track-titlePillReveal", motionId: "titlePillReveal", target: "titlePill", layer: "title", startPercent: 34, endPercent: 60, role: "semantic-context", purpose: "Reveal a compact context label outside the laptop.", semanticTarget: "website.contextLabel" },
  { trackId: "track-ctaSpotlightPulse", motionId: "ctaSpotlightPulse", target: "ctaSpotlight", layer: "semantic", startPercent: 52, endPercent: 78, role: "conversion-emphasis", purpose: "Apply one restrained CTA/value spotlight pulse.", semanticTarget: "website.cta" },
  { trackId: "track-heroHoldSettle", motionId: "heroHoldSettle", target: "fullComposition", layer: "camera", startPercent: 78, endPercent: 100, role: "readability-hold", purpose: "Hold the centered website hero for readability." },
];

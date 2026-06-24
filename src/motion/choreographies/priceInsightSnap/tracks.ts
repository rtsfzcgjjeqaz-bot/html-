import { priceInsightSnapAtomicMotions } from "../../atomic/priceInsightSnap";

export type PriceInsightSnapTrack = {
  trackId: string;
  motionId: (typeof priceInsightSnapAtomicMotions)[number];
  target: string;
  layer: "background" | "device" | "price" | "semantic" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const priceInsightSnapTracks: PriceInsightSnapTrack[] = [
  { trackId: "track-commerceBackdropDrift", motionId: "commerceBackdropDrift", target: "commerceBackdrop", layer: "background", startPercent: 0, endPercent: 100, role: "depth-establish", purpose: "Create a soft commerce-stage parallax background." },
  { trackId: "track-deviceShelfPush", motionId: "deviceShelfPush", target: "productSurface", layer: "device", startPercent: 5, endPercent: 34, role: "primary-commerce-context", purpose: "Push the product or website surface into a stable reading position.", semanticTarget: "commerce.productSurface" },
  { trackId: "track-priceBadgePop", motionId: "priceBadgePop", target: "priceBadge", layer: "price", startPercent: 18, endPercent: 46, role: "semantic-price-hook", purpose: "Pop the price or savings badge as the primary insight.", semanticTarget: "price.badge" },
  { trackId: "track-insightPanelSlide", motionId: "insightPanelSlide", target: "insightPanel", layer: "semantic", startPercent: 34, endPercent: 66, role: "evidence-panel-entry", purpose: "Slide an evidence panel into view without copying source content.", semanticTarget: "price.evidencePanel" },
  { trackId: "track-valueRowsReveal", motionId: "valueRowsReveal", target: "valueRows", layer: "semantic", startPercent: 52, endPercent: 78, role: "data-proof-build", purpose: "Reveal generic rows that support the price insight.", semanticTarget: "price.valueRows" },
  { trackId: "track-savingsEmphasisPulse", motionId: "savingsEmphasisPulse", target: "savingsHighlight", layer: "price", startPercent: 68, endPercent: 88, role: "price-emphasis", purpose: "Apply one restrained emphasis pulse to the final savings claim.", semanticTarget: "price.savingsHighlight" },
  { trackId: "track-priceInsightSettle", motionId: "priceInsightSettle", target: "fullComposition", layer: "camera", startPercent: 86, endPercent: 100, role: "readability-hold", purpose: "Settle the complete price insight for readability." },
];

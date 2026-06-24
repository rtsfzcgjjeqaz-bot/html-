import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  aiBackdropFloat,
  aiCardSlideIn,
  aiPillPop,
  aiRecommendationRowsReveal,
  aiRecommendationSettle,
  cursorTriggerPanel,
} from "../../motion/atomic/aiRecommendationCursorPanelReveal";
import {
  backgroundParallax,
  cameraPushIn,
  featureCardReveal,
  highlightBoxReveal,
  softSettle,
  titleReveal,
  websiteTiltIn,
  type MotionInput,
  type MotionStyle,
} from "../../motion/atomic/websiteHeroAngledPushIn";
import {
  queryTypeReveal,
  resultRowsReveal,
  searchBackdropDrift,
  searchBarReveal,
  searchFocusSettle,
  submitPulse,
} from "../../motion/atomic/searchTypingThenRows";
import {
  comparisonBackdropDrift,
  comparisonDividerSweep,
  comparisonSettle,
  leftResultSlide,
  rightResultSlide,
  splitPanelsReveal,
  winnerCardLift,
} from "../../motion/atomic/splitCompareCards";
import {
  calloutPinsPop,
  columnHighlightSweep,
  dashboardFrameOrbit,
  dashboardSettle,
  gridBackdropParallax,
  gridCellsCascade,
} from "../../motion/atomic/dashboardGridOrbit";
import {
  accentChipsSnap,
  coverHookSettle,
  hookBackdropSurge,
  hookTitleSmashIn,
  hookUnderlineSweep,
  productSlabRise,
} from "../../motion/atomic/coverHookImpact";
import {
  ctaBackdropGlow,
  ctaCardsConverge,
  finalCtaSettle,
  finalTitleReveal,
  primaryButtonPop,
  proofChipsOrbitIn,
} from "../../motion/atomic/finalCtaCardsConverge";
import {
  commerceBackdropDrift,
  deviceShelfPush,
  insightPanelSlide,
  priceBadgePop,
  priceInsightSettle,
  savingsEmphasisPulse,
  valueRowsReveal,
} from "../../motion/atomic/priceInsightSnap";
import {
  activeStepFocus,
  processLineDraw,
  progressMeterReveal,
  stepBackdropDrift,
  stepCardsCascade,
  stepFlowSettle,
  toolIconLift,
} from "../../motion/atomic/stepFlowRail";
import {
  browserContentWipe,
  ctaSpotlightPulse,
  heroDeskBackdropDrift,
  heroHoldSettle,
  laptopFrameRise,
  titlePillReveal,
} from "../../motion/atomic/websiteHeroCenterStage";
import { getChoreographyEntry } from "../../motion/choreographyRegistry";
import type { ChoreographyAnimationTrack } from "../../motion/choreographyTypes";

type MotionComposerProps = {
  choreographyId: string;
  animationTracks: ChoreographyAnimationTrack[];
  targetIds: string[];
  children: React.ReactNode;
  style?: React.CSSProperties;
  featureIndex?: number;
};

const motionFns: Record<string, (input: MotionInput, index?: number) => MotionStyle> = {
  aiBackdropFloat,
  cursorTriggerPanel,
  aiPillPop,
  aiCardSlideIn,
  aiRecommendationRowsReveal,
  aiRecommendationSettle,
  backgroundParallax,
  cameraPushIn,
  websiteTiltIn,
  titleReveal,
  highlightBoxReveal,
  featureCardReveal,
  softSettle,
  searchBackdropDrift,
  searchBarReveal,
  queryTypeReveal,
  submitPulse,
  resultRowsReveal,
  searchFocusSettle,
  comparisonBackdropDrift,
  splitPanelsReveal,
  leftResultSlide,
  rightResultSlide,
  comparisonDividerSweep,
  winnerCardLift,
  comparisonSettle,
  gridBackdropParallax,
  dashboardFrameOrbit,
  gridCellsCascade,
  calloutPinsPop,
  columnHighlightSweep,
  dashboardSettle,
  commerceBackdropDrift,
  deviceShelfPush,
  priceBadgePop,
  insightPanelSlide,
  valueRowsReveal,
  savingsEmphasisPulse,
  priceInsightSettle,
  stepBackdropDrift,
  processLineDraw,
  stepCardsCascade,
  activeStepFocus,
  toolIconLift,
  progressMeterReveal,
  stepFlowSettle,
  heroDeskBackdropDrift,
  laptopFrameRise,
  browserContentWipe,
  titlePillReveal,
  ctaSpotlightPulse,
  heroHoldSettle,
  ctaBackdropGlow,
  ctaCardsConverge,
  finalTitleReveal,
  primaryButtonPop,
  proofChipsOrbitIn,
  finalCtaSettle,
  hookBackdropSurge,
  hookTitleSmashIn,
  productSlabRise,
  accentChipsSnap,
  hookUnderlineSweep,
  coverHookSettle,
};

function mergeStyles(styles: MotionStyle[]): MotionStyle {
  return styles.reduce<MotionStyle>((acc, style) => ({
    opacity: typeof style.opacity === "number" ? (acc.opacity ?? 1) * style.opacity : acc.opacity,
    transform: [acc.transform, style.transform].filter(Boolean).join(" "),
    filter: [acc.filter, style.filter].filter(Boolean).join(" "),
  }), {});
}

export function validateAnimationTracks(choreographyId: string, animationTracks: ChoreographyAnimationTrack[]) {
  const entry = getChoreographyEntry(choreographyId);
  if (!entry || !entry.approved || !entry.allowedInFactory) {
    throw new Error(`Blocked render: choreography ${choreographyId} is not approved for factory use.`);
  }
  if (animationTracks.length < 4 || animationTracks.length > 7) {
    throw new Error(`Blocked render: choreography ${choreographyId} must provide 4-7 animation tracks.`);
  }
  const invalid = animationTracks.find((track) => !entry.atomicMotions.includes(track.motionId));
  if (invalid) {
    throw new Error(`Blocked render: motionId ${invalid.motionId} is not registered for ${choreographyId}.`);
  }
}

export const MotionComposer: React.FC<MotionComposerProps> = ({
  choreographyId,
  animationTracks,
  targetIds,
  children,
  style,
  featureIndex = 0,
}) => {
  validateAnimationTracks(choreographyId, animationTracks);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const input = { frame, durationInFrames };
  const targetSet = new Set(targetIds);
  const activeTracks = animationTracks.filter((track) => targetSet.has(track.target));
  const motionStyles = activeTracks.map((track) => motionFns[track.motionId](input, featureIndex));
  const composed = mergeStyles(motionStyles);

  return (
    <div
      data-motion-composer={targetIds.join(",")}
      style={{
        ...style,
        opacity: composed.opacity ?? style?.opacity,
        transform: [style?.transform, composed.transform].filter(Boolean).join(" "),
        filter: [style?.filter, composed.filter].filter(Boolean).join(" "),
      }}
    >
      {children}
    </div>
  );
};

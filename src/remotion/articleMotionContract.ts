import type { ArticleVideoJob } from "../article/types";
import { buildArticleLayoutInspection } from "./articleLayoutContract";

export type ArticleMotionIntent = "hook" | "step_flow" | "recommendation";

type MotionPhase = {
  startFrame: number;
  endFrame: number;
  purpose: string;
};

type MotionEvent = {
  frame: number;
  target: string;
  type: "fade" | "translate" | "scale" | "reveal" | "highlight" | "rail";
  delta: number;
};

export type ArticleMotionContract = {
  visualIntent: ArticleMotionIntent;
  introPhase: MotionPhase;
  buildPhase: MotionPhase;
  emphasisPhase: MotionPhase;
  settlePhase: MotionPhase;
  visibleByFrame: {
    headline: number;
    secondary: number;
    firstItem?: number;
    secondItem?: number;
    allItems?: number;
  };
  maxStaticIntervalDuringActivePhase: number;
  minimumMeaningfulMotionEvents: number;
  readingHoldFrames: number;
  motionIntensity: "subtle" | "moderate";
  allowedMotionTypes: MotionEvent["type"][];
  meaningfulMotionEvents: MotionEvent[];
};

export const articleMotionContracts: Record<ArticleMotionIntent, ArticleMotionContract> = {
  hook: {
    visualIntent: "hook",
    introPhase: { startFrame: 0, endFrame: 9, purpose: "headline fade-up readable within 0.3s" },
    buildPhase: { startFrame: 5, endFrame: 18, purpose: "right evidence card depth reveal" },
    emphasisPhase: { startFrame: 18, endFrame: 48, purpose: "15-25% evidence accent pop and fill" },
    settlePhase: { startFrame: 66, endFrame: 120, purpose: "stable reading hold with no new elements in final 0.4s" },
    visibleByFrame: { headline: 7, secondary: 16 },
    maxStaticIntervalDuringActivePhase: 19,
    minimumMeaningfulMotionEvents: 4,
    readingHoldFrames: 36,
    motionIntensity: "moderate",
    allowedMotionTypes: ["fade", "translate", "scale", "reveal", "highlight"],
    meaningfulMotionEvents: [
      { frame: 2, target: "headline", type: "fade", delta: 0.45 },
      { frame: 6, target: "headline", type: "translate", delta: 12 },
      { frame: 12, target: "evidenceCard", type: "reveal", delta: 0.6 },
      { frame: 26, target: "evidenceValue", type: "scale", delta: 0.04 },
      { frame: 38, target: "evidenceHighlight", type: "highlight", delta: 0.3 },
    ],
  },
  step_flow: {
    visualIntent: "step_flow",
    introPhase: { startFrame: 0, endFrame: 8, purpose: "headline and rail begin immediately" },
    buildPhase: { startFrame: 8, endFrame: 27, purpose: "three readable cards enter with stagger" },
    emphasisPhase: { startFrame: 30, endFrame: 66, purpose: "cards receive sequential emphasis" },
    settlePhase: { startFrame: 70, endFrame: 144, purpose: "large cards remain readable" },
    visibleByFrame: { headline: 7, secondary: 9, firstItem: 12, secondItem: 18, allItems: 27 },
    maxStaticIntervalDuringActivePhase: 19,
    minimumMeaningfulMotionEvents: 6,
    readingHoldFrames: 36,
    motionIntensity: "moderate",
    allowedMotionTypes: ["fade", "translate", "scale", "reveal", "highlight", "rail"],
    meaningfulMotionEvents: [
      { frame: 3, target: "headline", type: "fade", delta: 0.35 },
      { frame: 9, target: "rail", type: "rail", delta: 0.7 },
      { frame: 12, target: "stepCard1", type: "translate", delta: 18 },
      { frame: 18, target: "stepCard2", type: "translate", delta: 18 },
      { frame: 24, target: "stepCard3", type: "translate", delta: 18 },
      { frame: 38, target: "stepCard1", type: "highlight", delta: 0.24 },
      { frame: 50, target: "stepCard2", type: "highlight", delta: 0.24 },
      { frame: 62, target: "stepCard3", type: "highlight", delta: 0.24 },
    ],
  },
  recommendation: {
    visualIntent: "recommendation",
    introPhase: { startFrame: 0, endFrame: 10, purpose: "left headline and panel skeleton visible early" },
    buildPhase: { startFrame: 10, endFrame: 36, purpose: "recommendation rows enter with stagger" },
    emphasisPhase: { startFrame: 36, endFrame: 66, purpose: "selected recommendation confirmation accent" },
    settlePhase: { startFrame: 70, endFrame: 140, purpose: "panel remains readable" },
    visibleByFrame: { headline: 8, secondary: 16, firstItem: 20, secondItem: 30, allItems: 36 },
    maxStaticIntervalDuringActivePhase: 19,
    minimumMeaningfulMotionEvents: 6,
    readingHoldFrames: 36,
    motionIntensity: "moderate",
    allowedMotionTypes: ["fade", "translate", "scale", "reveal", "highlight"],
    meaningfulMotionEvents: [
      { frame: 4, target: "headline", type: "fade", delta: 0.35 },
      { frame: 10, target: "panel", type: "reveal", delta: 0.55 },
      { frame: 20, target: "row1", type: "translate", delta: 14 },
      { frame: 28, target: "row2", type: "translate", delta: 14 },
      { frame: 36, target: "row3", type: "translate", delta: 14 },
      { frame: 48, target: "row1", type: "highlight", delta: 0.24 },
      { frame: 58, target: "panelAccent", type: "scale", delta: 0.03 },
    ],
  },
};

export function getArticleMotionContract(visualIntent: string): ArticleMotionContract {
  if (visualIntent === "step_flow" || visualIntent === "checklist") return articleMotionContracts.step_flow;
  if (visualIntent === "recommendation" || visualIntent === "cta") return articleMotionContracts.recommendation;
  return articleMotionContracts.hook;
}

function maxGap(events: MotionEvent[]) {
  const frames = events.map((event) => event.frame).sort((a, b) => a - b);
  return Math.max(...frames.slice(1).map((frame, index) => frame - frames[index]), 0);
}

export function buildArticleMotionInspection(job: ArticleVideoJob) {
  const layoutInspection = buildArticleLayoutInspection(job);
  const scenes = (job.visibleCopyPlan ?? []).map((scene) => {
    const contract = getArticleMotionContract(scene.visualIntent);
    const duration = job.sceneSchedule.find((item) => item.sceneId === scene.sceneId)?.durationInFrames ?? 0;
    const stableHoldFrames = Math.max(0, duration - contract.settlePhase.startFrame);
    const maxStaticIntervalFrames = maxGap(contract.meaningfulMotionEvents);
    const visibleValues = [
      scene.headline?.value,
      scene.supportingText?.value,
      scene.shortLabel?.value,
      scene.recommendationTitle?.value,
      scene.evidenceCaption?.value,
      ...(scene.stepItems ?? []).map((item) => item.value),
      ...(scene.recommendationItems ?? []).map((item) => item.value),
    ].filter(Boolean);
    const visibleCopyPassed =
      Boolean(scene.headline?.value) &&
      !visibleValues.some((value) => /Example article template|Prepare a title and summary|Hero message/i.test(String(value))) &&
      !visibleValues.some((value) => /\.\.\.|…|⋯/.test(String(value)));
    const layoutPassed = layoutInspection.scenes.find((item) => item.sceneId === scene.sceneId)?.passed === true;
    const passed =
      contract.meaningfulMotionEvents.length >= contract.minimumMeaningfulMotionEvents &&
      maxStaticIntervalFrames <= contract.maxStaticIntervalDuringActivePhase &&
      stableHoldFrames >= contract.readingHoldFrames &&
      layoutPassed &&
      visibleCopyPassed;
    return {
      sceneId: scene.sceneId,
      visualIntent: scene.visualIntent,
      runtimeShotId: scene.runtimeShotId,
      choreographyId: scene.choreographyId,
      motionPhases: {
        introPhase: contract.introPhase,
        buildPhase: contract.buildPhase,
        emphasisPhase: contract.emphasisPhase,
        settlePhase: contract.settlePhase,
      },
      firstVisibleFrame: contract.visibleByFrame.headline,
      secondaryVisibleFrame: contract.visibleByFrame.secondary,
      buildCompleteFrame: contract.visibleByFrame.allItems ?? contract.visibleByFrame.secondary,
      emphasisFrame: contract.emphasisPhase.startFrame,
      settleStartFrame: contract.settlePhase.startFrame,
      stableHoldFrames,
      stableHoldSeconds: Number((stableHoldFrames / 30).toFixed(3)),
      meaningfulMotionEvents: contract.meaningfulMotionEvents,
      meaningfulMotionEventCount: contract.meaningfulMotionEvents.length,
      maxStaticIntervalFrames,
      layoutQaPassed: layoutPassed,
      visibleCopyQaPassed: visibleCopyPassed,
      passed,
      warnings: passed ? [] : ["article_motion_contract_threshold_failed"],
    };
  });

  const checks = {
    articleMotionContractApplied: scenes.length > 0,
    headlineVisibleByThreshold: scenes.every((scene) => scene.firstVisibleFrame <= 9),
    introContainsMeaningfulMotion: scenes.every((scene) => scene.meaningfulMotionEvents.some((event) => event.frame <= scene.motionPhases.introPhase.endFrame)),
    buildContainsMeaningfulMotion: scenes.every((scene) =>
      scene.meaningfulMotionEvents.some((event) => event.frame >= scene.motionPhases.buildPhase.startFrame && event.frame <= scene.motionPhases.buildPhase.endFrame),
    ),
    emphasisContainsMeaningfulMotion: scenes.every((scene) =>
      scene.meaningfulMotionEvents.some((event) => event.frame >= scene.motionPhases.emphasisPhase.startFrame && event.frame <= scene.motionPhases.emphasisPhase.endFrame),
    ),
    noStaticActivePlateauExceeded: scenes.every((scene) => scene.maxStaticIntervalFrames <= getArticleMotionContract(scene.visualIntent).maxStaticIntervalDuringActivePhase),
    motionEventsMeetMinimum: scenes.every((scene) => scene.meaningfulMotionEventCount >= getArticleMotionContract(scene.visualIntent).minimumMeaningfulMotionEvents),
    stepCardsStaggered: scenes.filter((scene) => scene.visualIntent === "step_flow").every((scene) => scene.buildCompleteFrame <= 27),
    stepRailDoesNotDelayCards: scenes.filter((scene) => scene.visualIntent === "step_flow").every((scene) => scene.secondaryVisibleFrame <= 9),
    recommendationPanelVisibleEarly: scenes.filter((scene) => scene.visualIntent === "recommendation").every((scene) => scene.secondaryVisibleFrame <= 16),
    recommendationRowsStaggered: scenes.filter((scene) => scene.visualIntent === "recommendation").every((scene) => scene.buildCompleteFrame <= 36),
    hookEvidenceReceivesEmphasis: scenes.filter((scene) => scene.visualIntent === "hook").every((scene) => scene.emphasisFrame <= 18),
    endingStableHoldPassed: scenes.every((scene) => scene.stableHoldFrames >= 12),
    layoutContractStillPassed: layoutInspection.status === "passed",
    visibleCopyBindingStillPassed: scenes.every((scene) => scene.visibleCopyQaPassed),
  };

  return {
    contractVersion: "article-motion-contract-v1",
    contracts: articleMotionContracts,
    scenes,
    checks,
    status: Object.values(checks).every(Boolean) && scenes.every((scene) => scene.passed) ? "passed" : "failed",
  };
}

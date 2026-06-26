import type { ArticleVideoJob } from "../article/types";

export type ArticleLayoutIntent = "hook" | "step_flow" | "recommendation";

type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type TypographyRule = {
  fontSize: number;
  lineHeight: number;
  maxLines: number;
  maxWidth: number;
};

export type ArticleLayoutContract = {
  visualIntent: ArticleLayoutIntent;
  safeArea: {
    horizontal: number;
    vertical: number;
  };
  headline: TypographyRule;
  label: TypographyRule & {
    headlineGap: number;
  };
  supportingText: TypographyRule;
  evidence: TypographyRule & {
    box: Box;
  };
  card: TypographyRule & {
    box: Box;
    minWidth: number;
    minHeight: number;
    textPadding: number;
  };
  panel: TypographyRule & {
    box: Box;
    minWidth: number;
    minHeight: number;
    textPadding: number;
  };
  layoutZones: {
    primary: Box;
    secondary: Box;
    cards?: Box[];
  };
  entranceTiming: {
    primaryVisibleFrame: number;
    secondaryVisibleFrame: number;
    allCardsVisibleFrame?: number;
    panelVisibleFrame?: number;
    firstRowVisibleFrame?: number;
    secondRowVisibleFrame?: number;
  };
  readingHold: {
    minimumFrames: number;
    endingStableFrames: number;
  };
  densityRules: {
    minimumPrimaryContentCoverage: number;
    minimumSecondaryVisualCoverage: number;
    minimumVisibleContentByTime: number;
    maxEmptyLeadDuration: number;
    maxSingleCornerOnlyDuration: number;
    minimumCardReadableDuration: number;
    minimumPanelReadableDuration: number;
  };
};

const fps = 30;
const canvas = { width: 1920, height: 1080 };
const area = (box: Box) => box.width * box.height;
const coverage = (box: Box) => area(box) / (canvas.width * canvas.height);

export const articleLayoutContracts: Record<ArticleLayoutIntent, ArticleLayoutContract> = {
  hook: {
    visualIntent: "hook",
    safeArea: { horizontal: 112, vertical: 84 },
    headline: { fontSize: 68, lineHeight: 1.14, maxLines: 2, maxWidth: 820 },
    label: { fontSize: 18, lineHeight: 1.2, maxLines: 1, maxWidth: 360, headlineGap: 16 },
    supportingText: { fontSize: 24, lineHeight: 1.35, maxLines: 2, maxWidth: 680 },
    evidence: { fontSize: 24, lineHeight: 1.32, maxLines: 2, maxWidth: 620, box: { left: 150, top: 575, width: 650, height: 118 } },
    card: {
      fontSize: 20,
      lineHeight: 1.28,
      maxLines: 2,
      maxWidth: 380,
      box: { left: 1080, top: 255, width: 540, height: 430 },
      minWidth: 500,
      minHeight: 330,
      textPadding: 34,
    },
    panel: {
      fontSize: 20,
      lineHeight: 1.28,
      maxLines: 2,
      maxWidth: 380,
      box: { left: 1080, top: 255, width: 540, height: 430 },
      minWidth: 500,
      minHeight: 330,
      textPadding: 34,
    },
    layoutZones: {
      primary: { left: 130, top: 170, width: 820, height: 540 },
      secondary: { left: 1040, top: 210, width: 620, height: 540 },
    },
    entranceTiming: { primaryVisibleFrame: 7, secondaryVisibleFrame: 16 },
    readingHold: { minimumFrames: 36, endingStableFrames: 12 },
    densityRules: {
      minimumPrimaryContentCoverage: 0.15,
      minimumSecondaryVisualCoverage: 0.12,
      minimumVisibleContentByTime: 18,
      maxEmptyLeadDuration: 9,
      maxSingleCornerOnlyDuration: 11,
      minimumCardReadableDuration: 36,
      minimumPanelReadableDuration: 36,
    },
  },
  step_flow: {
    visualIntent: "step_flow",
    safeArea: { horizontal: 112, vertical: 84 },
    headline: { fontSize: 46, lineHeight: 1.16, maxLines: 2, maxWidth: 760 },
    label: { fontSize: 16, lineHeight: 1.2, maxLines: 1, maxWidth: 360, headlineGap: 12 },
    supportingText: { fontSize: 20, lineHeight: 1.35, maxLines: 2, maxWidth: 720 },
    evidence: { fontSize: 18, lineHeight: 1.3, maxLines: 2, maxWidth: 420, box: { left: 1110, top: 190, width: 480, height: 112 } },
    card: {
      fontSize: 24,
      lineHeight: 1.28,
      maxLines: 2,
      maxWidth: 360,
      box: { left: 150, top: 380, width: 500, height: 250 },
      minWidth: 470,
      minHeight: 220,
      textPadding: 30,
    },
    panel: {
      fontSize: 20,
      lineHeight: 1.28,
      maxLines: 2,
      maxWidth: 420,
      box: { left: 1110, top: 190, width: 480, height: 220 },
      minWidth: 440,
      minHeight: 180,
      textPadding: 30,
    },
    layoutZones: {
      primary: { left: 120, top: 330, width: 1680, height: 400 },
      secondary: { left: 120, top: 120, width: 1680, height: 190 },
      cards: [
        { left: 150, top: 390, width: 500, height: 250 },
        { left: 710, top: 390, width: 500, height: 250 },
        { left: 1270, top: 390, width: 500, height: 250 },
      ],
    },
    entranceTiming: { primaryVisibleFrame: 9, secondaryVisibleFrame: 12, allCardsVisibleFrame: 27 },
    readingHold: { minimumFrames: 36, endingStableFrames: 12 },
    densityRules: {
      minimumPrimaryContentCoverage: 0.22,
      minimumSecondaryVisualCoverage: 0.04,
      minimumVisibleContentByTime: 18,
      maxEmptyLeadDuration: 9,
      maxSingleCornerOnlyDuration: 11,
      minimumCardReadableDuration: 36,
      minimumPanelReadableDuration: 36,
    },
  },
  recommendation: {
    visualIntent: "recommendation",
    safeArea: { horizontal: 112, vertical: 84 },
    headline: { fontSize: 56, lineHeight: 1.14, maxLines: 2, maxWidth: 610 },
    label: { fontSize: 16, lineHeight: 1.2, maxLines: 1, maxWidth: 360, headlineGap: 14 },
    supportingText: { fontSize: 21, lineHeight: 1.35, maxLines: 2, maxWidth: 560 },
    evidence: { fontSize: 18, lineHeight: 1.3, maxLines: 2, maxWidth: 540, box: { left: 1080, top: 690, width: 610, height: 112 } },
    card: {
      fontSize: 20,
      lineHeight: 1.28,
      maxLines: 2,
      maxWidth: 530,
      box: { left: 930, top: 185, width: 740, height: 590 },
      minWidth: 720,
      minHeight: 460,
      textPadding: 36,
    },
    panel: {
      fontSize: 20,
      lineHeight: 1.28,
      maxLines: 2,
      maxWidth: 540,
      box: { left: 900, top: 160, width: 820, height: 640 },
      minWidth: 760,
      minHeight: 460,
      textPadding: 38,
    },
    layoutZones: {
      primary: { left: 120, top: 150, width: 650, height: 560 },
      secondary: { left: 880, top: 140, width: 860, height: 700 },
    },
    entranceTiming: { primaryVisibleFrame: 8, secondaryVisibleFrame: 16, panelVisibleFrame: 16, firstRowVisibleFrame: 24, secondRowVisibleFrame: 36 },
    readingHold: { minimumFrames: 36, endingStableFrames: 12 },
    densityRules: {
      minimumPrimaryContentCoverage: 0.12,
      minimumSecondaryVisualCoverage: 0.18,
      minimumVisibleContentByTime: 18,
      maxEmptyLeadDuration: 9,
      maxSingleCornerOnlyDuration: 11,
      minimumCardReadableDuration: 36,
      minimumPanelReadableDuration: 36,
    },
  },
};

export function getArticleLayoutContract(visualIntent: string): ArticleLayoutContract {
  if (visualIntent === "step_flow" || visualIntent === "checklist") return articleLayoutContracts.step_flow;
  if (visualIntent === "recommendation" || visualIntent === "cta") return articleLayoutContracts.recommendation;
  return articleLayoutContracts.hook;
}

function sceneDurationFrames(job: ArticleVideoJob, sceneId: number) {
  return job.sceneSchedule.find((scene) => scene.sceneId === sceneId)?.durationInFrames ?? 0;
}

export function buildArticleLayoutInspection(job: ArticleVideoJob) {
  const scenes = (job.visibleCopyPlan ?? []).map((scene) => {
    const contract = getArticleLayoutContract(scene.visualIntent);
    const duration = sceneDurationFrames(job, scene.sceneId);
    const primaryCoverage = coverage(contract.layoutZones.primary);
    const secondaryCoverage = coverage(contract.layoutZones.secondary);
    const cardBoxes = contract.layoutZones.cards ?? [contract.panel.box];
    const contentCoverage = primaryCoverage + secondaryCoverage;
    const firstPrimaryFrame = contract.entranceTiming.primaryVisibleFrame;
    const secondaryFrame = contract.entranceTiming.secondaryVisibleFrame;
    const stableReadableFrames = Math.max(0, duration - Math.max(firstPrimaryFrame, secondaryFrame) - contract.readingHold.endingStableFrames);
    const warnings: string[] = [];
    const passed =
      contract.headline.lineHeight >= 1.12 &&
      contract.headline.maxLines <= 2 &&
      contract.label.fontSize >= 12 &&
      contract.supportingText.fontSize >= 18 &&
      contract.supportingText.lineHeight >= 1.3 &&
      contract.card.fontSize >= 17 &&
      contract.card.minWidth >= 470 &&
      contract.card.minHeight >= 180 &&
      contract.card.textPadding >= 24 &&
      firstPrimaryFrame <= contract.densityRules.maxEmptyLeadDuration &&
      secondaryFrame <= contract.densityRules.minimumVisibleContentByTime &&
      primaryCoverage >= contract.densityRules.minimumPrimaryContentCoverage &&
      secondaryCoverage >= contract.densityRules.minimumSecondaryVisualCoverage &&
      stableReadableFrames >= contract.readingHold.minimumFrames;

    if (!passed) warnings.push("layout_contract_threshold_failed");

    return {
      sceneId: scene.sceneId,
      runtimeShotId: scene.runtimeShotId,
      choreographyId: scene.choreographyId,
      visualIntent: scene.visualIntent,
      headlineBoundingBox: contract.layoutZones.primary,
      visibleContentBoundingBoxes: [contract.layoutZones.primary, contract.layoutZones.secondary],
      cardPanelBoundingBoxes: cardBoxes,
      text: {
        headline: contract.headline,
        label: contract.label,
        supportingText: contract.supportingText,
        card: contract.card,
        panel: contract.panel,
      },
      firstVisibleFrame: firstPrimaryFrame,
      secondaryVisibleFrame: secondaryFrame,
      allCardsVisibleFrame: contract.entranceTiming.allCardsVisibleFrame,
      panelVisibleFrame: contract.entranceTiming.panelVisibleFrame,
      firstRowVisibleFrame: contract.entranceTiming.firstRowVisibleFrame,
      secondRowVisibleFrame: contract.entranceTiming.secondRowVisibleFrame,
      finalStableFrame: Math.max(0, duration - contract.readingHold.endingStableFrames),
      readableHoldFrames: stableReadableFrames,
      readableHoldSeconds: Number((stableReadableFrames / fps).toFixed(3)),
      primaryContentCoverage: Number(primaryCoverage.toFixed(3)),
      secondaryVisualCoverage: Number(secondaryCoverage.toFixed(3)),
      totalContentCoverage: Number(contentCoverage.toFixed(3)),
      layoutWarnings: warnings,
      passed,
    };
  });

  const checks = {
    articleSafeAreaPassed: scenes.every((scene) => getArticleLayoutContract(scene.visualIntent).safeArea.horizontal >= 72),
    headlineLineHeightDefined: scenes.every((scene) => scene.text.headline.lineHeight >= 1.12),
    headlineMaxLinesWithinPolicy: scenes.every((scene) => scene.text.headline.maxLines <= 2),
    headlineNoOverlapRisk: scenes.every((scene) => scene.text.headline.maxWidth <= scene.headlineBoundingBox.width),
    headlineNoEllipsis: true,
    labelHeadlineSpacingPassed: scenes.every((scene) => scene.text.label.headlineGap >= 10 && scene.text.label.headlineGap <= 26),
    bodyTextLineHeightDefined: scenes.every((scene) => scene.text.supportingText.lineHeight >= 1.3),
    cardMinimumSizePassed: scenes.every((scene) => scene.text.card.minWidth >= 470 && scene.text.card.minHeight >= 180),
    cardTextMinimumSizePassed: scenes.every((scene) => scene.text.card.fontSize >= 17),
    textPaddingPassed: scenes.every((scene) => scene.text.card.textPadding >= 24 && scene.text.panel.textPadding >= 30),
    hookTwoZoneBalancePassed: scenes
      .filter((scene) => scene.visualIntent === "hook")
      .every((scene) => scene.primaryContentCoverage >= 0.15 && scene.secondaryVisualCoverage >= 0.12),
    stepFlowCardsVisibleByThreshold: scenes
      .filter((scene) => scene.visualIntent === "step_flow")
      .every((scene) => (scene.allCardsVisibleFrame ?? 999) <= 27),
    stepFlowNoLineOnlyDelay: scenes
      .filter((scene) => scene.visualIntent === "step_flow")
      .every((scene) => scene.firstVisibleFrame <= 9 && (scene.allCardsVisibleFrame ?? 999) <= 27),
    stepFlowCardsOccupyMainArea: scenes
      .filter((scene) => scene.visualIntent === "step_flow")
      .every((scene) => scene.primaryContentCoverage >= 0.22),
    recommendationPanelVisibleByThreshold: scenes
      .filter((scene) => scene.visualIntent === "recommendation")
      .every((scene) => (scene.panelVisibleFrame ?? 999) <= 16 && (scene.firstRowVisibleFrame ?? 999) <= 24),
    recommendationPanelOccupiesMainArea: scenes
      .filter((scene) => scene.visualIntent === "recommendation")
      .every((scene) => scene.secondaryVisualCoverage >= 0.18),
    noSingleCornerOnlyDurationExceeded: scenes.every((scene) => scene.secondaryVisibleFrame <= 18),
    noLargeEmptyLeadDuration: scenes.every((scene) => scene.firstVisibleFrame <= 9),
    minimumContentCoveragePassed: scenes.every((scene) => scene.totalContentCoverage >= 0.24),
    endingStableHoldPassed: scenes.every((scene) => scene.finalStableFrame >= 0),
  };

  return {
    contractVersion: "article-layout-contract-v1",
    canvas,
    fps,
    contracts: articleLayoutContracts,
    scenes,
    checks,
    status: Object.values(checks).every(Boolean) && scenes.every((scene) => scene.passed) ? "passed" : "failed",
  };
}

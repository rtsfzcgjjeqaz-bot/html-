import type { ShotLibraryEntry } from "./types";

export const aiPartnerValueStatementLibraryEntry: ShotLibraryEntry = {
  libraryId: "ai-partner-value-statement",
  choreographyId: "aiPartnerValueStatement",
  sourceShotId: "shot_142",
  sceneType: "featureHighlight",
  title: "AI Partner Value Statement",
  approved: true,
  allowedInFactory: true,
  implementationVerified: true,
  durationFrames: 75,
  actionBreakdownPath: "src/motion/shot_142/shot142-action-breakdown.md",
  atomicMotionsPath: "src/motion/shot_142/shot142-atomic-motions.ts",
  choreographyPath: "src/motion/shot_142/shot142-choreography.tsx",
  executableChoreographyPath: "src/motion/choreographies/aiPartnerValueStatement.tsx",
  certificationPreviewPath: "outputs/motion-catalog/review/shot_142/aiPartnerValueStatement.preview.mp4",
  sourceReferencePath: "references/extracted-shots/new-reference-ai-agent-platform-click-feedback/shot_142_featureHighlight_20p1-22p6.mp4",
  atomicMotionIds: ["headlineWordBuild", "aiWordColorPop", "softGlowPush", "statementHold"],
};

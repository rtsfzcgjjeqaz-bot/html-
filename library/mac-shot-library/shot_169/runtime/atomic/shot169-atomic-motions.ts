export type AtomicMotion = {id: string; label: string; frameRange: [number, number]; purpose: string; reusable: boolean; reviewRisk: string};

export const shot169AtomicMotions: AtomicMotion[] = [
  {id: "editorSurfaceLift", label: "Editor Surface Lift", frameRange: [0, 34], purpose: "Establish a stable transcript editing surface.", reusable: true, reviewRisk: "Editor must remain fully inside the safe area."},
  {id: "roughTranscriptType", label: "Rough Transcript Type", frameRange: [18, 78], purpose: "Reveal source transcript words in reading order.", reusable: true, reviewRisk: "Typing pace must remain readable."},
  {id: "correctionTargetSweep", label: "Correction Target Sweep", frameRange: [64, 122], purpose: "Identify terms that require normalization.", reusable: true, reviewRisk: "Highlights must have semantic targets."},
  {id: "refinedCopyMorph", label: "Refined Copy Morph", frameRange: [100, 164], purpose: "Replace rough terms with corrected terms in place.", reusable: true, reviewRisk: "Replacement must not shift surrounding copy abruptly."},
  {id: "refinedResultHold", label: "Refined Result Hold", frameRange: [158, 201], purpose: "Hold the polished result and completion status.", reusable: true, reviewRisk: "Final residual motion must remain subtle."},
];

export const shot169AtomicMotionIds = shot169AtomicMotions.map((motion) => motion.id);
export const shot169MotionPackageStatus = {shotId: "shot_169", libraryId: "rough-to-refined-transcript-morph", choreographyId: "roughToRefinedTranscriptMorph", sceneType: "resultComparison", visualApproved: true, implementationVerified: true, approved: true, allowedInFactory: true} as const;

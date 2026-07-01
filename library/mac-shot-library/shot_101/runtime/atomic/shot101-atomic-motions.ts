export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot101AtomicMotions: AtomicMotion[] = [
  { id: "rowStreamEnter", label: "Row Stream Enter", frameRange: [0, 34], purpose: "Bring layered app rows into frame.", reusable: true, reviewRisk: "Rows should not drift outside safe area." },
  { id: "statusPillSweep", label: "Status Pill Sweep", frameRange: [20, 58], purpose: "Reveal colored status chips inside rows.", reusable: true, reviewRisk: "Pills should stay aligned to row grid." },
  { id: "cursorGuide", label: "Cursor Guide", frameRange: [38, 72], purpose: "Guide attention to a row action.", reusable: true, reviewRisk: "Cursor must point to a semantic target." },
  { id: "depthBlurPass", label: "Depth Blur Pass", frameRange: [54, 88], purpose: "Create depth while preserving focus row readability.", reusable: true, reviewRisk: "Blur can over-soften the UI." },
  { id: "listSettle", label: "List Settle", frameRange: [78, 97], purpose: "Hold the final list overview.", reusable: true, reviewRisk: "Final state should remain stable." },
];

export const shot101AtomicMotionIds = shot101AtomicMotions.map((motion) => motion.id);

export const shot101MotionPackageStatus = {
  shotId: "shot_101",
  libraryId: "saas-row-stream-overview",
  choreographyId: "saasRowStreamOverview",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;

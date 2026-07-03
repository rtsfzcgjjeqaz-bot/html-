export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot117AtomicMotions: AtomicMotion[] = [
  { id: "darkWorkspacePush", label: "Dark Workspace Push", frameRange: [0, 24], purpose: "Push a dark app board into a cinematic angled position.", reusable: true, reviewRisk: "The background must not overpower the cards." },
  { id: "selectedMessageLift", label: "Selected Message Lift", frameRange: [12, 36], purpose: "Lift the lead message card from the workspace.", reusable: true, reviewRisk: "Selection must read as a chosen task or message." },
  { id: "stepCardFanout", label: "Step Card Fanout", frameRange: [24, 62], purpose: "Stagger workflow cards into a curved rail.", reusable: true, reviewRisk: "Too many overlaps can make the sequence unreadable." },
  { id: "connectorGlowSweep", label: "Connector Glow Sweep", frameRange: [40, 70], purpose: "Sweep a connector glow through the step sequence.", reusable: true, reviewRisk: "Connector must imply flow, not decoration." },
  { id: "cursorPinConfirm", label: "Cursor Pin Confirm", frameRange: [48, 72], purpose: "Land cursor on the lead card to confirm the flow target.", reusable: true, reviewRisk: "Cursor must land on a card." },
  { id: "railSettle", label: "Rail Settle", frameRange: [66, 78], purpose: "Settle all cards into a reusable workflow rail state.", reusable: true, reviewRisk: "Final layout should fit inside safe area." },
];

export const shot117AtomicMotionIds = shot117AtomicMotions.map((motion) => motion.id);

export const shot117MotionPackageStatus = {
  shotId: "shot_117",
  libraryId: "floating-workflow-step-rail",
  choreographyId: "floatingWorkflowStepRail",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;

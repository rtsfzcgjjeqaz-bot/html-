export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot118AtomicMotions: AtomicMotion[] = [
  { id: "commandBoardPush", label: "Command Board Push", frameRange: [0, 22], purpose: "Push a dark productivity board into angled focus.", reusable: true, reviewRisk: "Board must remain readable and not crop core controls." },
  { id: "quickStepToolbarSweep", label: "Quick Step Toolbar Sweep", frameRange: [10, 36], purpose: "Reveal a compact toolbar of app commands.", reusable: true, reviewRisk: "Icons should read as controls, not random decoration." },
  { id: "floatingTaskReturn", label: "Floating Task Return", frameRange: [20, 50], purpose: "Return a purple workflow card into the app board.", reusable: true, reviewRisk: "Motion should connect to a target row." },
  { id: "inboxRowFocus", label: "Inbox Row Focus", frameRange: [34, 58], purpose: "Highlight the target message or schedule row.", reusable: true, reviewRisk: "Focused row must be visually distinct." },
  { id: "pinConfirmPulse", label: "Pin Confirm Pulse", frameRange: [48, 68], purpose: "Confirm attachment with a pin/cursor pulse.", reusable: true, reviewRisk: "Pulse must not obscure the row content." },
  { id: "appGridSettle", label: "App Grid Settle", frameRange: [60, 66], purpose: "Settle the board as a reusable appGrid final state.", reusable: true, reviewRisk: "Final state must avoid text overflow." },
];

export const shot118AtomicMotionIds = shot118AtomicMotions.map((motion) => motion.id);

export const shot118MotionPackageStatus = {
  shotId: "shot_118",
  libraryId: "agent-command-board-showcase",
  choreographyId: "agentCommandBoardShowcase",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;

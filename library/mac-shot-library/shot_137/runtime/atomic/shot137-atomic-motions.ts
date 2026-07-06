export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot137AtomicMotions: AtomicMotion[] = [
  { id: "workflowPanelReveal", label: "Workflow Panel Reveal", frameRange: [0, 24], purpose: "Reveal a centered workflow interface panel.", reusable: true, reviewRisk: "Panel should not look empty." },
  { id: "stepRailConnect", label: "Step Rail Connect", frameRange: [16, 50], purpose: "Draw a connector rail between workflow steps.", reusable: true, reviewRisk: "Connector line must remain semantic." },
  { id: "activeStepPulse", label: "Active Step Pulse", frameRange: [30, 64], purpose: "Highlight the active step in the process.", reusable: true, reviewRisk: "Pulse should stay subtle." },
  { id: "panelSettle", label: "Panel Settle", frameRange: [44, 76], purpose: "Settle supporting workflow rows and chips.", reusable: true, reviewRisk: "Rows should not become unreadable clutter." },
  { id: "bridgeHold", label: "Bridge Hold", frameRange: [74, 87], purpose: "Hold final workflow bridge state.", reusable: true, reviewRisk: "Avoid late drift." },
];

export const shot137AtomicMotionIds = shot137AtomicMotions.map((motion) => motion.id);

export const shot137MotionPackageStatus = {
  shotId: "shot_137",
  libraryId: "workflow-stepper-bridge",
  choreographyId: "workflowStepperBridge",
  sceneType: "stepFlow",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;

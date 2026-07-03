export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot116AtomicMotions: AtomicMotion[] = [
  { id: "documentBackdropSlide", label: "Document Backdrop Slide", frameRange: [0, 24], purpose: "Move prior document context backward before the mode selector takes focus.", reusable: true, reviewRisk: "Backdrop must stay secondary and not compete with the selector." },
  { id: "modePanelRise", label: "Mode Panel Rise", frameRange: [10, 36], purpose: "Raise a compact selector panel into the safe area.", reusable: true, reviewRisk: "Panel text and controls must stay inside safe area." },
  { id: "appCardPairBuild", label: "App Card Pair Build", frameRange: [20, 48], purpose: "Reveal paired Light and Dark app-state cards.", reusable: true, reviewRisk: "Cards must be visually distinct enough for the choice to read." },
  { id: "cursorModeSelect", label: "Cursor Mode Select", frameRange: [36, 62], purpose: "Guide the cursor to the Dark card as a semantic selection.", reusable: true, reviewRisk: "Cursor must land on the selected card, not between cards." },
  { id: "activeDarkGlow", label: "Active Dark Glow", frameRange: [52, 75], purpose: "Confirm the selected dark card with a warm active border and glow.", reusable: true, reviewRisk: "Glow should not obscure UI structure." },
  { id: "dashboardSettle", label: "Dashboard Settle", frameRange: [64, 81], purpose: "Let the selected dashboard card settle into reusable app state.", reusable: true, reviewRisk: "Final state should not feel like a pure transition." },
];

export const shot116AtomicMotionIds = shot116AtomicMotions.map((motion) => motion.id);

export const shot116MotionPackageStatus = {
  shotId: "shot_116",
  libraryId: "dark-agent-dashboard-grid-build",
  choreographyId: "darkAgentDashboardGridBuild",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;

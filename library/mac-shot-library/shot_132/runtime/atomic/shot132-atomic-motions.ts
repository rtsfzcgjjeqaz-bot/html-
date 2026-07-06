export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot132AtomicMotions: AtomicMotion[] = [
  { id: "searchPanelReveal", label: "Search Panel Reveal", frameRange: [0, 22], purpose: "Reveal a search dashboard panel.", reusable: true, reviewRisk: "Panel must stay readable and not feel like a blank rectangle." },
  { id: "searchQueryType", label: "Search Query Type", frameRange: [14, 42], purpose: "Type or reveal a concise search query.", reusable: true, reviewRisk: "Query copy needs a short capacity guard." },
  { id: "resultCardHighlight", label: "Result Card Highlight", frameRange: [28, 58], purpose: "Brighten the matching search result.", reusable: true, reviewRisk: "Highlight should not resemble an error state." },
  { id: "cursorSelectTap", label: "Cursor Select Tap", frameRange: [38, 66], purpose: "Use cursor motion to confirm the chosen result.", reusable: true, reviewRisk: "Cursor should be purposeful and subtle." },
  { id: "selectionLift", label: "Selection Lift", frameRange: [52, 80], purpose: "Lift selected content into workflow focus.", reusable: true, reviewRisk: "Selected card must not crop out of safe area." },
  { id: "focusHold", label: "Focus Hold", frameRange: [76, 84], purpose: "Hold the selected search result.", reusable: true, reviewRisk: "Avoid late motion that disrupts handoff." },
];

export const shot132AtomicMotionIds = shot132AtomicMotions.map((motion) => motion.id);

export const shot132MotionPackageStatus = {
  shotId: "shot_132",
  libraryId: "dashboard-search-select-focus",
  choreographyId: "dashboardSearchSelectFocus",
  sceneType: "searchDemo",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;

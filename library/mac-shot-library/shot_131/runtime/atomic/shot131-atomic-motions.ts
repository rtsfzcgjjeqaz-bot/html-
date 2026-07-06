export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot131AtomicMotions: AtomicMotion[] = [
  { id: "dashboardPaneSlide", label: "Dashboard Pane Slide", frameRange: [0, 26], purpose: "Slide a library workspace panel into view.", reusable: true, reviewRisk: "Pane must not feel like a generic blank card." },
  { id: "cardRowSweep", label: "Card Row Sweep", frameRange: [12, 68], purpose: "Move rows of content thumbnails through the browsing plane.", reusable: true, reviewRisk: "Too many cards can become visual noise." },
  { id: "thumbnailFocusLift", label: "Thumbnail Focus Lift", frameRange: [36, 76], purpose: "Lift and brighten the selected thumbnail.", reusable: true, reviewRisk: "Focus card needs enough contrast without covering neighbors." },
  { id: "cursorHoverPulse", label: "Cursor Hover Pulse", frameRange: [48, 84], purpose: "Use a subtle cursor hint to imply selection.", reusable: true, reviewRisk: "Cursor should not become tutorial clutter." },
  { id: "metadataStripResolve", label: "Metadata Strip Resolve", frameRange: [58, 90], purpose: "Resolve compact card metadata for library context.", reusable: true, reviewRisk: "Metadata should stay non-critical and short." },
  { id: "gridSettleHold", label: "Grid Settle Hold", frameRange: [86, 99], purpose: "Hold the final library selection state.", reusable: true, reviewRisk: "Avoid late horizontal drift." },
];

export const shot131AtomicMotionIds = shot131AtomicMotions.map((motion) => motion.id);

export const shot131MotionPackageStatus = {
  shotId: "shot_131",
  libraryId: "video-card-library-grid-sweep",
  choreographyId: "videoCardLibraryGridSweep",
  sceneType: "appGrid",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;

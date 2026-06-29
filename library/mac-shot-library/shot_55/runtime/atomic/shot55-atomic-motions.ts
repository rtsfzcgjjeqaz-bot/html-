export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot55AtomicMotions = [
  {
    id: "ai-canvas-label-reveal",
    purpose: "Introduce the AI context and keep the opening from feeling blank.",
    timingFrames: [0, 32],
    properties: { opacity: [0, 1], translateY: [12, 0] },
    reviewRisk: "AI tag should be clear but not become the whole shot.",
  },
  {
    id: "prompt-input-slide-in",
    purpose: "Bring the input field into the center as the interaction anchor.",
    timingFrames: [24, 58],
    properties: { opacity: [0, 1], translateY: [18, 0], scale: [0.96, 1] },
    reviewRisk: "Input field must stay inside safe area and not look like a static banner.",
  },
  {
    id: "requirement-text-type",
    purpose: "Type the user requirement into the field.",
    timingFrames: [50, 94],
    properties: { characters: [0, 16], cursorBlink: true },
    reviewRisk: "Typed text must fit and remain readable.",
  },
  {
    id: "generation-status-pulse",
    purpose: "Switch from prompt entry to AI processing state.",
    timingFrames: [88, 118],
    properties: { opacity: [0, 1], pulseScale: [1, 1.04, 1] },
    reviewRisk: "Pulse cannot feel like random decoration.",
  },
  {
    id: "workspace-rise-sharpen",
    purpose: "Lift the product workspace into view and sharpen generated content.",
    timingFrames: [96, 146],
    properties: { opacity: [0, 1], translateY: [38, 0], blur: [10, 0] },
    reviewRisk: "Workspace must become readable by the end frame.",
  },
  {
    id: "generated-rows-resolve",
    purpose: "Reveal generated rows and note lines progressively.",
    timingFrames: [120, 172],
    properties: { opacity: [0, 1], translateY: [8, 0], staggerFrames: 5 },
    reviewRisk: "Rows need to imply generated structure, not placeholder noise.",
  },
] as const satisfies readonly AtomicMotion[];

export const shot55AtomicMotionIds = shot55AtomicMotions.map((motion) => motion.id);

export const shot55AtomicMotionPackage = {
  shotId: "shot_55",
  libraryId: "ai-requirement-composer",
  choreographyId: "aiRequirementComposer",
  sceneType: "searchDemo",
  status: "preview_ready",
  approved: false,
  allowedInFactory: false,
  implementationVerified: false,
} as const;

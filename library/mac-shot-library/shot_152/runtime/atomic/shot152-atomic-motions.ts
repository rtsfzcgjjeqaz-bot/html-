export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot152AtomicMotions: AtomicMotion[] = [
  {
    id: "stageDriftReveal",
    label: "Stage Drift Reveal",
    frameRange: [0, 32],
    purpose: "Establish the bright blue stage and soft camera drift.",
    reusable: true,
    reviewRisk: "Background energy cannot overpower the UI surface.",
  },
  {
    id: "devicePanelFloatIn",
    label: "Device Panel Float In",
    frameRange: [12, 60],
    purpose: "Bring the main recommendation device state into focus.",
    reusable: true,
    reviewRisk: "Tilt and scale must preserve readability.",
  },
  {
    id: "recommendationCardsFan",
    label: "Recommendation Cards Fan",
    frameRange: [42, 96],
    purpose: "Populate multiple assistant suggestions around the center state.",
    reusable: true,
    reviewRisk: "Too many cards can make the scene feel like a collage.",
  },
  {
    id: "assistantConsoleSwap",
    label: "Assistant Console Swap",
    frameRange: [86, 132],
    purpose: "Shift into a darker assistant operations console.",
    reusable: true,
    reviewRisk: "The swap cannot feel like an unrelated hard cut.",
  },
  {
    id: "confirmationDockReturn",
    label: "Confirmation Dock Return",
    frameRange: [124, 162],
    purpose: "Return to the bright device surface with a confirmed action tone.",
    reusable: true,
    reviewRisk: "Late elements must not crowd the main device frame.",
  },
  {
    id: "trustShieldResolve",
    label: "Trust Shield Resolve",
    frameRange: [150, 189],
    purpose: "Resolve a final automation/trust state as the concluding recommendation payoff.",
    reusable: true,
    reviewRisk: "The final mark cannot drift into generic decorative branding.",
  },
];

export const shot152AtomicMotionIds = shot152AtomicMotions.map((motion) => motion.id);

export const shot152MotionPackageStatus = {
  shotId: "shot_152",
  libraryId: "assistant-panel-confirm-flow",
  choreographyId: "assistantPanelConfirmFlow",
  sceneType: "aiRecommendation",
  visualApproved: false,
  implementationVerified: true,
  approved: false,
  allowedInFactory: false,
} as const;

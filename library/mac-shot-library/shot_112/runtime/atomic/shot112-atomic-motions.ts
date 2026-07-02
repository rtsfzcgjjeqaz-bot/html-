export type AtomicMotion = {
  id: string;
  label: string;
  frameRange: [number, number];
  purpose: string;
  reusable: boolean;
  reviewRisk: string;
};

export const shot112AtomicMotions: AtomicMotion[] = [
  { id: "angledGlassSurfacePush", label: "Angled Glass Surface Push", frameRange: [0, 28], purpose: "Push a frosted SaaS UI surface into frame with perspective.", reusable: true, reviewRisk: "Perspective crop must keep the main UI inside safe area." },
  { id: "toolbarIconSweep", label: "Toolbar Icon Sweep", frameRange: [12, 46], purpose: "Reveal compact toolbar icons across the top rail.", reusable: true, reviewRisk: "Icons should read as tools, not random marks." },
  { id: "cursorAccentGlide", label: "Cursor Accent Glide", frameRange: [28, 64], purpose: "Guide attention with a blue cursor/agent accent.", reusable: true, reviewRisk: "Cursor must point to a semantic area." },
  { id: "panelDepthParallax", label: "Panel Depth Parallax", frameRange: [36, 72], purpose: "Move translucent panels at different speeds for depth.", reusable: true, reviewRisk: "Panels can become clutter if too many overlap." },
  { id: "hookHeadlineResolve", label: "Hook Headline Resolve", frameRange: [54, 81], purpose: "Resolve a short hook phrase over the interface.", reusable: true, reviewRisk: "Headline capacity is intentionally short." },
];

export const shot112AtomicMotionIds = shot112AtomicMotions.map((motion) => motion.id);

export const shot112MotionPackageStatus = {
  shotId: "shot_112",
  libraryId: "angled-glass-toolbar-hook",
  choreographyId: "angledGlassToolbarHook",
  sceneType: "coverHook",
  visualApproved: true,
  implementationVerified: true,
  approved: true,
  allowedInFactory: true,
} as const;

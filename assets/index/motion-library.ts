export type MotionDefinition = {
  id: string;
  durationFrames: number;
  defaults: Record<string, number | string | boolean>;
  description: string;
};

export const motionLibrary: Record<string, MotionDefinition> = {
  fade_in: {
    id: "fade_in",
    durationFrames: 18,
    defaults: { fromOpacity: 0, toOpacity: 1 },
    description: "Opacity-only entrance for safe text and small UI elements.",
  },
  slide_up: {
    id: "slide_up",
    durationFrames: 24,
    defaults: { fromY: 32, toY: 0, opacity: true },
    description: "Vertical entrance for cards, rows, and CTA blocks.",
  },
  zoom_in: {
    id: "zoom_in",
    durationFrames: 22,
    defaults: { fromScale: 0.92, toScale: 1, opacity: true },
    description: "Soft zoom entrance for visual panels and product surfaces.",
  },
  shake: {
    id: "shake",
    durationFrames: 12,
    defaults: { amplitude: 6, cycles: 2, decay: true },
    description: "Short warning/attention motion. Use sparingly and never for body text.",
  },
  stagger: {
    id: "stagger",
    durationFrames: 36,
    defaults: { itemDelayFrames: 4, maxItems: 8 },
    description: "Sequential reveal controller for lists, chips, rows, or card groups.",
  },
};

export function getBuiltInMotion(name: string): MotionDefinition {
  const motion = motionLibrary[name];
  if (!motion) {
    throw new Error(`Motion not registered: ${name}. Add it to motionLibrary or assets/index/assets.json.`);
  }
  return motion;
}

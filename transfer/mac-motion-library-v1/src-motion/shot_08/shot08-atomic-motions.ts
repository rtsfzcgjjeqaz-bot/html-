export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot08AtomicMotions = [
  {
    "id": "focus-blur-background",
    "purpose": "Reduce workspace dominance and create focus for the AI panel.",
    "timingFrames": [
      0,
      62
    ],
    "properties": {
      "blur": [
        0,
        5
      ],
      "opacity": [
        0.82,
        0.46
      ],
      "scale": [
        1,
        1.025
      ]
    },
    "reviewRisk": "Too much blur removes product context; too little blur fights panel readability."
  },
  {
    "id": "cursor-trigger-panel",
    "purpose": "Make the AI recommendation feel user-triggered.",
    "timingFrames": [
      18,
      74
    ],
    "properties": {
      "translateX": [
        -150,
        0
      ],
      "translateY": [
        80,
        0
      ],
      "opacity": [
        0,
        1
      ]
    },
    "reviewRisk": "Cursor must land near a clear trigger, not drift randomly."
  },
  {
    "id": "ai-pill-pop",
    "purpose": "Label the AI action before the panel expands.",
    "timingFrames": [
      42,
      78
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "scale": [
        0.92,
        1
      ],
      "translateY": [
        12,
        0
      ]
    },
    "reviewRisk": "The label should not become a decorative badge disconnected from the panel."
  },
  {
    "id": "ai-card-slide-in",
    "purpose": "Reveal the AI result panel as the primary semantic object.",
    "timingFrames": [
      56,
      120
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "translateX": [
        96,
        0
      ],
      "scale": [
        0.98,
        1
      ],
      "rowStaggerFrames": 7
    },
    "reviewRisk": "Panel content requires line clamp and safe padding for real AI copy."
  }
] as const satisfies readonly AtomicMotion[];

export const shot08AtomicMotionIds = shot08AtomicMotions.map((motion) => motion.id);

export const shot08AtomicMotionPackage = {
  "shotId": "shot_08",
  "libraryId": "ai-recommendation-cursor-panel-reveal",
  "choreographyId": "aiRecommendationCursorPanelReveal",
  "sceneType": "aiRecommendation",
  "status": "approved",
  "approved": true,
  "allowedInFactory": true,
  "implementationVerified": true
} as const;

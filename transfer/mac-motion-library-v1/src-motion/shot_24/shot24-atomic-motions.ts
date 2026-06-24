export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot24AtomicMotions = [
  {
    "id": "product-core-settle",
    "purpose": "Place the main product object as the system anchor.",
    "timingFrames": [
      0,
      42
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "scale": [
        0.88,
        1
      ],
      "translateY": [
        24,
        0
      ]
    },
    "reviewRisk": "Core object must be asset-agnostic and not automotive-only."
  },
  {
    "id": "product-module-fanout",
    "purpose": "Reveal module cards around the core object in a readable sequence.",
    "timingFrames": [
      28,
      94
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "translateFromCore": true,
      "staggerFrames": 8
    },
    "reviewRisk": "Cards need semantic labels; no unlabeled floating panels."
  },
  {
    "id": "card-orbit",
    "purpose": "Keep the composition alive with bounded parallax.",
    "timingFrames": [
      70,
      146
    ],
    "properties": {
      "amplitudeX": 12,
      "amplitudeY": 8,
      "rotationRange": 2
    },
    "reviewRisk": "Orbit must stay subtle and inside safe bounds."
  },
  {
    "id": "connector-lines",
    "purpose": "Draw semantic relationships between modules and the core object.",
    "timingFrames": [
      58,
      118
    ],
    "properties": {
      "drawProgress": [
        0,
        1
      ],
      "lineOpacity": [
        0,
        0.7
      ]
    },
    "reviewRisk": "Lines should connect modules; avoid decorative crossing."
  }
] as const satisfies readonly AtomicMotion[];

export const shot24AtomicMotionIds = shot24AtomicMotions.map((motion) => motion.id);

export const shot24AtomicMotionPackage = {
  "shotId": "shot_24",
  "libraryId": "step-flow-product-module-fanout",
  "choreographyId": "stepFlowProductModuleFanout",
  "sceneType": "stepFlow",
  "status": "approved",
  "approved": true,
  "allowedInFactory": true,
  "implementationVerified": true
} as const;

export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot11AtomicMotions = [
  {
    "id": "big-number-burst",
    "purpose": "Reveal the result metric as the dominant semantic payload.",
    "timingFrames": [
      0,
      28
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "scale": [
        0.62,
        1.08,
        1
      ],
      "blur": [
        10,
        0
      ]
    },
    "reviewRisk": "Overshoot must not reduce number readability."
  },
  {
    "id": "speed-line-perspective",
    "purpose": "Imply performance acceleration toward the central value.",
    "timingFrames": [
      0,
      45
    ],
    "properties": {
      "opacity": [
        0.1,
        0.9,
        0.5
      ],
      "translateY": [
        110,
        -70
      ],
      "scale": [
        0.8,
        1.25
      ]
    },
    "reviewRisk": "Lines must stay directional and not become random decoration."
  },
  {
    "id": "value-count-up",
    "purpose": "Count quickly into the final metric value.",
    "timingFrames": [
      2,
      24
    ],
    "properties": {
      "from": "0%",
      "to": "150%+"
    },
    "reviewRisk": "Counting animation must finish early enough for reading time."
  },
  {
    "id": "subtitle-lock",
    "purpose": "Add metric interpretation after the value locks.",
    "timingFrames": [
      18,
      38
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "translateY": [
        16,
        0
      ]
    },
    "reviewRisk": "Subtitle must remain short and sourceable."
  }
] as const satisfies readonly AtomicMotion[];

export const shot11AtomicMotionIds = shot11AtomicMotions.map((motion) => motion.id);

export const shot11AtomicMotionPackage = {
  "shotId": "shot_11",
  "libraryId": "result-comparison-big-number-burst",
  "choreographyId": "resultComparisonBigNumberBurst",
  "sceneType": "resultComparison",
  "status": "approved",
  "approved": true,
  "allowedInFactory": true,
  "implementationVerified": true
} as const;

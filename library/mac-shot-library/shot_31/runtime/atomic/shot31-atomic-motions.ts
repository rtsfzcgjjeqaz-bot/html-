export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot31AtomicMotions = [
  {
    "id": "logo-endcard-fade",
    "purpose": "Reveal the brand mark clearly at the end of a video.",
    "timingFrames": [
      0,
      34
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "translateY": [
        12,
        0
      ],
      "scale": [
        0.96,
        1
      ]
    },
    "reviewRisk": "Logo must be replaceable and stay centered."
  },
  {
    "id": "centered-cta-lockup",
    "purpose": "Reveal a short slogan or CTA under the logo.",
    "timingFrames": [
      22,
      50
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "translateY": [
        10,
        0
      ],
      "maxChars": 28
    },
    "reviewRisk": "Long slogans need text fitting before factory approval."
  },
  {
    "id": "white-hold",
    "purpose": "Keep the ending calm and readable.",
    "timingFrames": [
      50,
      64
    ],
    "properties": {
      "opacity": [
        1,
        1
      ]
    },
    "reviewRisk": "Do not add unnecessary decoration."
  }
] as const satisfies readonly AtomicMotion[];

export const shot31AtomicMotionIds = shot31AtomicMotions.map((motion) => motion.id);

export const shot31AtomicMotionPackage = {
  "shotId": "shot_31",
  "libraryId": "final-cta-brand-end-card",
  "choreographyId": "finalCtaBrandEndCard",
  "sceneType": "finalCTA",
  "status": "approved",
  "approved": true,
  "allowedInFactory": true,
  "implementationVerified": true
} as const;

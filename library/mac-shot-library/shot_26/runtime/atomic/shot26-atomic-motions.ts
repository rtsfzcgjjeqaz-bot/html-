export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot26AtomicMotions = [
  {
    "id": "tilted-dashboard-callout",
    "purpose": "Present a complex dashboard as a guided walkthrough surface.",
    "timingFrames": [
      0,
      86
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "rotateY": [
        -10,
        -5
      ],
      "scale": [
        0.94,
        1.02
      ],
      "translateX": [
        60,
        -12
      ]
    },
    "reviewRisk": "Tilt must not make the dashboard unreadable."
  },
  {
    "id": "callout-stack",
    "purpose": "Reveal semantic labels connected to dashboard regions.",
    "timingFrames": [
      38,
      122
    ],
    "properties": {
      "staggerFrames": 10,
      "opacity": [
        0,
        1
      ],
      "translateX": [
        -34,
        0
      ]
    },
    "reviewRisk": "Labels should map to visible UI areas, not float decoratively."
  },
  {
    "id": "cursor-focus",
    "purpose": "Move attention to a specific action button.",
    "timingFrames": [
      92,
      158
    ],
    "properties": {
      "translateX": [
        -220,
        0
      ],
      "translateY": [
        90,
        0
      ],
      "opacity": [
        0,
        1
      ]
    },
    "reviewRisk": "Cursor path must clearly land on an actionable target."
  },
  {
    "id": "action-button-lock",
    "purpose": "Confirm the endpoint of the walkthrough.",
    "timingFrames": [
      142,
      194
    ],
    "properties": {
      "glowOpacity": [
        0,
        0.8
      ],
      "scale": [
        1,
        1.04,
        1
      ]
    },
    "reviewRisk": "Button highlight should not overtake the whole dashboard."
  }
] as const satisfies readonly AtomicMotion[];

export const shot26AtomicMotionIds = shot26AtomicMotions.map((motion) => motion.id);

export const shot26AtomicMotionPackage = {
  "shotId": "shot_26",
  "libraryId": "app-grid-tilted-dashboard-callout",
  "choreographyId": "appGridTiltedDashboardCallout",
  "sceneType": "appGrid",
  "status": "approved",
  "approved": true,
  "allowedInFactory": true,
  "implementationVerified": true
} as const;

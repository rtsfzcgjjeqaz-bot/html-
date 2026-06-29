export type AtomicMotion = {
  id: string;
  purpose: string;
  timingFrames: [number, number];
  properties: Record<string, unknown>;
  reviewRisk: string;
};

export const shot28AtomicMotions = [
  {
    "id": "timeline-draw",
    "purpose": "Reveal a process or duration line in a clear left-to-right sequence.",
    "timingFrames": [
      22,
      138
    ],
    "properties": {
      "drawProgress": [
        0,
        1
      ],
      "tickOpacity": [
        0,
        1
      ],
      "lineColor": "#22c55e"
    },
    "reviewRisk": "Too many ticks can reduce readability."
  },
  {
    "id": "date-range-highlight",
    "purpose": "Select an active range and lock date chips to its ends.",
    "timingFrames": [
      92,
      190
    ],
    "properties": {
      "rangeOpacity": [
        0,
        1
      ],
      "chipScale": [
        0.94,
        1
      ],
      "startDate": "2025-08-05",
      "endDate": "2025-08-22"
    },
    "reviewRisk": "Dates must be configurable and protected from overflow."
  },
  {
    "id": "formula-caption",
    "purpose": "Explain the calculation associated with the selected range.",
    "timingFrames": [
      148,
      238
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "translateY": [
        16,
        0
      ],
      "maxChars": 32
    },
    "reviewRisk": "Formula text should remain close to the selected range."
  },
  {
    "id": "result-chip-lock",
    "purpose": "Provide a clear endpoint for the timeline calculation.",
    "timingFrames": [
      206,
      292
    ],
    "properties": {
      "opacity": [
        0,
        1
      ],
      "scale": [
        0.9,
        1.04,
        1
      ]
    },
    "reviewRisk": "Result value must be sourceable and not purely promotional."
  }
] as const satisfies readonly AtomicMotion[];

export const shot28AtomicMotionIds = shot28AtomicMotions.map((motion) => motion.id);

export const shot28AtomicMotionPackage = {
  "shotId": "shot_28",
  "libraryId": "step-flow-timeline-calculation",
  "choreographyId": "stepFlowTimelineCalculation",
  "sceneType": "stepFlow",
  "status": "approved",
  "approved": true,
  "allowedInFactory": true,
  "implementationVerified": true
} as const;

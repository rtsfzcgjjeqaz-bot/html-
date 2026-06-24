import { chatJson } from "../lib/openai";
import type { WebsiteAnalysis } from "./analyzeWebsite";
import type { DirectorDecision, EmotionGoal } from "./directorBrain";

export type BatchStrategyId = "A" | "B" | "C";
export type BatchStrategyType = "pain_attack" | "comparison" | "aesthetic";

export type BatchStrategy = {
  strategyId: BatchStrategyId;
  type: BatchStrategyType;
  hookStrength: number;
  emotion: EmotionGoal;
  angle: string;
};

const clampHook = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0.7));

const fallbackBatchStrategies = (analysis: WebsiteAnalysis, director: DirectorDecision): BatchStrategy[] => [
  {
    strategyId: "A",
    type: "pain_attack",
    hookStrength: 0.9,
    emotion: "urgency",
    angle: analysis.painPoints[0] || "Amplify the user's decision friction before revealing the solution.",
  },
  {
    strategyId: "B",
    type: "comparison",
    hookStrength: 0.72,
    emotion: "trust",
    angle: analysis.usp || "Use contrast and proof to make the website feel more credible than alternatives.",
  },
  {
    strategyId: "C",
    type: "aesthetic",
    hookStrength: 0.82,
    emotion: director.emotionGoal === "trust" ? "desire" : director.emotionGoal,
    angle: analysis.coreValue || "Turn the strongest website value into a polished visual reveal.",
  },
];

export async function generateBatchStrategies(analysis: WebsiteAnalysis, director: DirectorDecision): Promise<BatchStrategy[]> {
  const fallback = fallbackBatchStrategies(analysis, director);
  const prompt = `
Generate exactly 3 viral ad strategies for one website.
Return strict JSON only. Use only supplied facts.

Director: ${JSON.stringify(director)}
Analysis: ${JSON.stringify(analysis)}

Rules:
- A must be pain_attack
- B must be comparison
- C must be aesthetic
- hookStrength must be 0 to 1

Schema:
[
  {"strategyId":"A","type":"pain_attack","hookStrength":0.9,"emotion":"urgency","angle":""},
  {"strategyId":"B","type":"comparison","hookStrength":0.7,"emotion":"trust","angle":""},
  {"strategyId":"C","type":"aesthetic","hookStrength":0.8,"emotion":"desire","angle":""}
]
`;

  const result = await chatJson<BatchStrategy[]>(
    [
      { role: "system", content: "You design A/B/C viral ad strategy variants with stable JSON output." },
      { role: "user", content: prompt },
    ],
    fallback,
    0.65,
  );

  const byId = new Map(result.map((strategy) => [strategy.strategyId, strategy]));
  return fallback.map((base) => {
    const next = byId.get(base.strategyId) ?? base;
    return {
      ...base,
      ...next,
      strategyId: base.strategyId,
      type: base.type,
      hookStrength: clampHook(next.hookStrength),
      emotion: ["trust", "desire", "urgency", "curiosity"].includes(next.emotion) ? next.emotion : base.emotion,
    };
  });
}

import { chatJson } from "../lib/openai";
import type { WebsiteAnalysis } from "./analyzeWebsite";

export type StrategyId = "A" | "B" | "C";

export type AdStrategy = {
  id: StrategyId;
  name: string;
  hook: string;
  angle: string;
  emotionCurve: string;
  conversionLogic: string;
};

const fallbackStrategies = (analysis: WebsiteAnalysis): AdStrategy[] => [
  {
    id: "A",
    name: "Pain Point Attack",
    hook: analysis.painPoints[0] || "The decision is harder than it should be.",
    angle: `Expose the user problem, then position ${analysis.productName} as the clean answer.`,
    emotionCurve: "friction -> recognition -> relief -> confidence",
    conversionLogic: `Move from pain to ${analysis.coreValue}, then ask viewers to act.` ,
  },
  {
    id: "B",
    name: "Competitive Contrast",
    hook: "Not every option gives the same signal.",
    angle: `Contrast scattered alternatives with ${analysis.usp}.`,
    emotionCurve: "confusion -> comparison -> proof -> preference",
    conversionLogic: "Use visible evidence and decision clarity to make the website the preferred next step.",
  },
  {
    id: "C",
    name: "Visual Impact",
    hook: analysis.dataHighlights[0] ? `One signal changes the decision: ${analysis.dataHighlights[0]}` : "One clear signal changes the decision.",
    angle: "Use the strongest website evidence as a visual reveal.",
    emotionCurve: "curiosity -> reveal -> momentum -> action",
    conversionLogic: "Create a memorable proof moment, then land on the brand and call to action.",
  },
];

export async function generateStrategy(analysis: WebsiteAnalysis): Promise<AdStrategy[]> {
  const fallback = fallbackStrategies(analysis);
  const prompt = `
Generate exactly 3 ad strategies for a 30-second website ad.
Return strict JSON only. Do not invent product facts.

Analysis: ${JSON.stringify(analysis)}

Required strategies:
A = pain point attack
B = competitor comparison
C = visual impact

Schema:
[
  {"id":"A","name":"","hook":"","angle":"","emotionCurve":"","conversionLogic":""},
  {"id":"B","name":"","hook":"","angle":"","emotionCurve":"","conversionLogic":""},
  {"id":"C","name":"","hook":"","angle":"","emotionCurve":"","conversionLogic":""}
]
`;

  const result = await chatJson<AdStrategy[]>(
    [
      { role: "system", content: "You write standardized commercial strategy objects for AI video generation." },
      { role: "user", content: prompt },
    ],
    fallback,
    0.6,
  );

  const byId = new Map(result.map((strategy) => [strategy.id, strategy]));
  return fallback.map((strategy) => ({ ...strategy, ...(byId.get(strategy.id) ?? {}) }));
}

import fs from "fs";
import path from "path";
import { imagesDir } from "../lib/config";

export type GeneratedImagePlan = {
  prompt: string;
  status: "planned";
  outputHint: string;
};

export function planImageAssets(prompts: string[]): GeneratedImagePlan[] {
  fs.mkdirSync(imagesDir, { recursive: true });
  const plans = prompts.map((prompt, index) => ({
    prompt,
    status: "planned" as const,
    outputHint: path.join(imagesDir, `generated_${index + 1}.png`),
  }));
  fs.writeFileSync(path.join(imagesDir, "image-prompts.json"), JSON.stringify(plans, null, 2));
  return plans;
}

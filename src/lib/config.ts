import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local"), override: false, quiet: true } as dotenv.DotenvConfigOptions & { quiet: boolean });
dotenv.config({ path: path.join(process.cwd(), ".env"), override: false, quiet: true } as dotenv.DotenvConfigOptions & { quiet: boolean });

export const projectRoot = process.cwd();
export const outputsDir = path.join(projectRoot, "outputs");
export const screenshotsDir = path.join(outputsDir, "screenshots");
export const imagesDir = path.join(outputsDir, "images");
export const coverDir = path.join(outputsDir, "cover");
export const publicAudioDir = path.join(projectRoot, "public", "audio");
export const videoStructurePath = path.join(projectRoot, "video-structure.json");

export const fps = 30;
export const width = 1920;
export const height = 1080;
export const defaultDurationSeconds = 30;

const defaultOpenAIModel = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export const openAIConfig = {
  baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com",
  apiKey: process.env.OPENAI_API_KEY ?? "",
  model: defaultOpenAIModel,
  semanticReviewModel: process.env.OPENAI_SEMANTIC_REVIEW_MODEL ?? defaultOpenAIModel,
  semanticReviewModelSource: process.env.OPENAI_SEMANTIC_REVIEW_MODEL ? "explicit_semantic_config" : "inherited_default",
  scriptRepairModel: process.env.OPENAI_SCRIPT_REPAIR_MODEL ?? defaultOpenAIModel,
  scriptRepairModelSource: process.env.OPENAI_SCRIPT_REPAIR_MODEL ? "explicit_script_repair_config" : "inherited_default",
};

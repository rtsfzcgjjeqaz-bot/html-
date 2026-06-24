import path from "path";

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

export const openAIConfig = {
  baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com",
  apiKey: process.env.OPENAI_API_KEY ?? "",
  model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
};

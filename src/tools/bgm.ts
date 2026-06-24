import fs from "fs";
import path from "path";
import { outputsDir, publicAudioDir } from "../lib/config";

export type AudioAvailability = {
  voice: boolean;
  bgm: boolean;
  canRenderFinal: boolean;
};

export function writeBgmKeywords(keywords: string[]): string {
  const output = path.join(outputsDir, "bgm-keywords.txt");
  fs.writeFileSync(output, keywords.join("\n"));
  return output;
}

export function detectAudio(): AudioAvailability {
  const voice = fs.existsSync(path.join(publicAudioDir, "voice.mp3"));
  const bgm = fs.existsSync(path.join(publicAudioDir, "bgm.mp3"));
  return { voice, bgm, canRenderFinal: voice && bgm };
}

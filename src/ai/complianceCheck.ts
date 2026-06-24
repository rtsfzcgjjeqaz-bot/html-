import fs from "fs";
import path from "path";
import { outputsDir } from "../lib/config";
import type { VideoStructure } from "../pipeline/main";

export type ComplianceReport = {
  passed: boolean;
  issues: string[];
  warnings: string[];
};

const banned = ["cyberpunk", "neon city", "cartoon", "hand-drawn", "real person", "presenter", "fake price", "subtitle"];

export function complianceCheck(structure: VideoStructure): ComplianceReport {
  const issues: string[] = [];
  const warnings: string[] = [];
  const serialized = JSON.stringify(structure).toLowerCase();

  for (const term of banned) {
    if (serialized.includes(term)) issues.push(`Banned term found: ${term}`);
  }

  const duration = structure.scenes.reduce((sum, scene) => sum + scene.duration, 0);
  if (Math.abs(duration - structure.renderConfig.duration) > 0.25) {
    issues.push(`Total duration is ${duration}s, expected ${structure.renderConfig.duration}s.`);
  }

  if (structure.strategies.length !== 3) {
    issues.push(`Strategy count is ${structure.strategies.length}, expected 3.`);
  }

  if (structure.scenes.length < 5) {
    issues.push(`Scene count is ${structure.scenes.length}, expected at least 5.`);
  }

  for (const scene of structure.scenes) {
    const screenText = scene.textOverlay.join(" ");
    if (screenText.split(/\s+/).filter(Boolean).length > 16) {
      warnings.push(`Scene ${scene.id} may have too much screen text.`);
    }
    const sceneImages = scene.assets.image.filter(Boolean);
    if (!sceneImages.length) {
      issues.push(`Scene ${scene.id} has no image asset.`);
    }
    for (const image of sceneImages) {
      if (!fs.existsSync(image)) warnings.push(`Scene ${scene.id} image path does not exist locally: ${image}`);
    }
    if (!scene.visualIntent) warnings.push(`Scene ${scene.id} has no visual intent.`);
  }

  const report = { passed: issues.length === 0, issues, warnings };
  fs.writeFileSync(path.join(outputsDir, "compliance-report.json"), JSON.stringify(report, null, 2));
  return report;
}

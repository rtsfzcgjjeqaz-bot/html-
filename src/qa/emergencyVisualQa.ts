import fs from "fs";
import path from "path";

export type EmergencyQaReport = {
  status: "passed" | "failed";
  typography: "passed" | "failed";
  layout: "passed" | "failed";
  screenshotUsage: "passed" | "failed";
  semanticShape: "passed" | "failed";
  motionUsage: "passed" | "failed";
  issues: string[];
  warnings: string[];
};

type SceneLike = {
  id?: number;
  duration?: number;
  textOverlay?: string[];
  camera?: { shot?: string; motion?: string };
  assets?: { image?: string[] };
  visualTemplate?: string;
  semanticShapes?: Array<{ semanticRole?: string; targetRegion?: unknown }>;
};

type StructureLike = {
  scenes?: SceneLike[];
};

const allowedRoles = new Set(["connector", "focusMarker", "highlightBox", "stepLine", "chartGuide", "priceDeltaArrow"]);
const wordCount = (value: string) => value.split(/\s+/).filter(Boolean).length;
const isHome = (value: string) => value.toLowerCase().replace(/\\/g, "/").endsWith("screenshots/home.png") || value.includes("generated/screenshots/home.png");

export function runEmergencyVisualQa(structure: StructureLike, qaPath: string): EmergencyQaReport {
  const issues: string[] = [];
  const warnings: string[] = [];
  const scenes = structure.scenes ?? [];

  for (const [index, scene] of scenes.entries()) {
    const lines = scene.textOverlay ?? [];
    if (lines.length > 2 || lines.some((line) => line.length > 52 || wordCount(line) > 8)) {
      issues.push(`TYPOGRAPHY_OVERFLOW_RISK: scene ${index + 1}`);
    }
    if (!scene.camera?.shot || !scene.camera?.motion) {
      issues.push(`MOTION_MISSING: scene ${index + 1}`);
    }
    for (const shape of scene.semanticShapes ?? []) {
      if (!shape.semanticRole || !allowedRoles.has(shape.semanticRole) || !shape.targetRegion) {
        issues.push(`SEMANTIC_SHAPE_INVALID: scene ${index + 1}`);
      }
    }
  }

  const homeUsage = scenes.flatMap((scene) => scene.assets?.image ?? []).filter(isHome).length;
  if (homeUsage > 1) issues.push(`SCREENSHOT_DUPLICATED: home screenshot used ${homeUsage} times.`);
  if (scenes[0]?.visualTemplate !== "websiteHero") issues.push("LAYOUT_INVALID: first scene must be websiteHero.");
  if (scenes.slice(1).some((scene) => (scene.assets?.image ?? []).some(isHome))) issues.push("SCREENSHOT_INVALID: home screenshot after scene 1.");
  if (new Set(scenes.map((scene) => scene.visualTemplate)).size < Math.min(5, scenes.length)) issues.push("LAYOUT_REPETITION: not enough template variety.");
  if (new Set(scenes.map((scene) => scene.camera?.motion).filter(Boolean)).size < 3) issues.push("MOTION_REPETITION: not enough motion variety.");

  const report: EmergencyQaReport = {
    status: issues.length ? "failed" : "passed",
    typography: issues.some((issue) => issue.startsWith("TYPOGRAPHY")) ? "failed" : "passed",
    layout: issues.some((issue) => issue.startsWith("LAYOUT")) ? "failed" : "passed",
    screenshotUsage: issues.some((issue) => issue.startsWith("SCREENSHOT")) ? "failed" : "passed",
    semanticShape: issues.some((issue) => issue.startsWith("SEMANTIC")) ? "failed" : "passed",
    motionUsage: issues.some((issue) => issue.startsWith("MOTION")) ? "failed" : "passed",
    issues,
    warnings,
  };

  fs.mkdirSync(path.dirname(qaPath), { recursive: true });
  fs.writeFileSync(qaPath, JSON.stringify(report, null, 2));
  return report;
}

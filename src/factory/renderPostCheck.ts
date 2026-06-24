import fs from "fs";
import path from "path";
import { renderFrameValidator } from "../qa/renderFrameValidator";

export function runRenderPostCheck(previewPath: string, qaPath?: string, contactSheetPath?: string) {
  const result = renderFrameValidator({ previewPath, contactSheetPath });
  const report = {
    passed: result.status !== "failed",
    status: result.status,
    errors: result.errors,
    warnings: result.warnings,
    previewPath,
    checkedAt: new Date().toISOString(),
  };
  if (qaPath) {
    fs.mkdirSync(path.dirname(qaPath), { recursive: true });
    const existing = fs.existsSync(qaPath) ? JSON.parse(fs.readFileSync(qaPath, "utf8")) : {};
    fs.writeFileSync(qaPath, JSON.stringify({ ...existing, postRender: report }, null, 2));
  }
  return report;
}

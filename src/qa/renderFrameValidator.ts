import fs from "fs";
import { resultFrom } from "./types";

export type RenderFrameQaInput = {
  previewPath: string;
  expectedMinBytes?: number;
  contactSheetPath?: string;
};

export function renderFrameValidator(input: RenderFrameQaInput) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const minBytes = input.expectedMinBytes ?? 250_000;
  if (!fs.existsSync(input.previewPath)) {
    errors.push(`preview missing: ${input.previewPath}`);
  } else {
    const size = fs.statSync(input.previewPath).size;
    if (size < minBytes) errors.push(`preview too small: ${size} bytes`);
  }
  if (input.contactSheetPath && !fs.existsSync(input.contactSheetPath)) warnings.push(`contact sheet unavailable: ${input.contactSheetPath}`);
  return resultFrom(errors, warnings);
}

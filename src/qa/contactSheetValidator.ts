import fs from "fs";
import { resultFrom } from "./types";

export function contactSheetValidator(contactSheetPath: string) {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!fs.existsSync(contactSheetPath)) warnings.push(`contact sheet missing: ${contactSheetPath}`);
  return resultFrom(errors, warnings);
}

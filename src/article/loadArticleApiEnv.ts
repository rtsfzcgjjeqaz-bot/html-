import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let loaded = false;

export function loadArticleApiEnv() {
  if (loaded) {
    return;
  }

  const cwd = process.cwd();
  for (const fileName of [".env", ".env.local"]) {
    const envPath = path.join(cwd, fileName);
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath, override: false });
    }
  }

  loaded = true;
}

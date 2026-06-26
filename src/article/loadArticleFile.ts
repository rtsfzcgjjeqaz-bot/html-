import fs from "fs";
import path from "path";
import type { ArticleSourceType } from "./types";

export type LoadedArticleFile = {
  absolutePath: string;
  fileName: string;
  sourceType: ArticleSourceType;
  rawContent: string;
};

function sourceTypeFromExtension(filePath: string): ArticleSourceType {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".md" || ext === ".markdown") return "markdown";
  if (ext === ".txt") return "text";
  if (ext === ".html" || ext === ".htm") return "html";
  throw new Error(`Unsupported article file extension: ${ext || "(none)"}. Only .md and .txt are supported in this phase.`);
}

export function loadArticleFile(inputPath: string): LoadedArticleFile {
  const absolutePath = path.resolve(inputPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Article file not found: ${absolutePath}`);
  }
  const sourceType = sourceTypeFromExtension(absolutePath);
  if (sourceType === "html") {
    throw new Error("HTML article input is not enabled in this phase. Use .md or .txt.");
  }
  return {
    absolutePath,
    fileName: path.basename(absolutePath),
    sourceType,
    rawContent: fs.readFileSync(absolutePath, "utf8").replace(/^\uFEFF/, ""),
  };
}

import fs from "fs";
import path from "path";

export type TenVideoManifestItem = {
  index: number;
  videoId: string;
  structurePath: string;
  qaPath: string;
  qaStatus: string;
};

export type TenVideoManifest = {
  runId: string;
  url: string;
  count: number;
  videos: TenVideoManifestItem[];
};

export function readTenVideoManifest(runId: string): TenVideoManifest {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "outputs", "runs", runId, "ten-video-manifest.json"), "utf8"));
}

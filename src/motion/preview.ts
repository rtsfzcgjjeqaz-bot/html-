import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { getChoreographyEntry } from "./choreographyRegistry";

function valueAfter(args: string[], flag: string) {
  const index = args.indexOf(flag);
  if (index >= 0) return args[index + 1];
  const inline = args.find((arg) => arg.startsWith(`${flag}=`));
  return inline ? inline.slice(flag.length + 1) : undefined;
}

export function renderMotionPreview(choreographyId: string) {
  if (!choreographyId) {
    throw new Error('Missing --choreography. Example: npm run motion:preview -- --choreography "websiteHeroAngledPushIn"');
  }
  const entry = getChoreographyEntry(choreographyId);
  if (!entry || !entry.approved || !entry.allowedInFactory) {
    throw new Error(`Cannot preview choreography ${choreographyId}: not registered as approved factory choreography.`);
  }
  if (choreographyId !== "websiteHeroAngledPushIn") {
    throw new Error(`No MotionCatalog composition is registered for ${choreographyId}.`);
  }

  const outputDir = path.join(process.cwd(), "outputs", "motion-catalog", "choreographies");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "websiteHeroAngledPushIn.preview.mp4");

  execFileSync(
    "npx",
    [
      "remotion",
      "render",
      "src/motion-catalog/index.ts",
      "WebsiteHeroAngledPushInPreview",
      outputPath,
      "--overwrite",
      "--concurrency=1",
      "--codec=h264",
    ],
    { stdio: "inherit", shell: process.platform === "win32" },
  );

  console.log(outputPath);
  return outputPath;
}

function run() {
  renderMotionPreview(valueAfter(process.argv.slice(2), "--choreography") ?? "");
}

if (require.main === module) {
  run();
}

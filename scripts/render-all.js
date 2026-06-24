const { spawnSync } = require("node:child_process");
const { mkdirSync } = require("node:fs");
const { dirname, join } = require("node:path");

const entry = "src/index.ts";
const renderConfigs = [
  { name: "InfoExplosion", compositionId: "AppCardPriceFactory-info" },
  { name: "Minimal", compositionId: "AppCardPriceFactory-minimal" },
  { name: "Map", compositionId: "AppCardPriceFactory-map" },
  { name: "AI", compositionId: "AppCardPriceFactory-ai" },
  { name: "Shock", compositionId: "AppCardPriceFactory-shock" },
  { name: "Dashboard", compositionId: "AppCardPriceFactory-dashboard" },
  { name: "Parallax", compositionId: "AppCardPriceFactory-parallax" },
  { name: "Narrative", compositionId: "AppCardPriceFactory-narrative" },
  { name: "Realtime", compositionId: "AppCardPriceFactory-realtime" },
  { name: "Walkthrough", compositionId: "AppCardPriceFactory-walkthrough" },
];

const args = new Set(process.argv.slice(2));
const isPreview = args.has("--preview");
const isList = args.has("--list");
const isDryRun = args.has("--dry-run");
const scaleArgs = isPreview ? ["--scale=0.5"] : [];

const outputFor = (config) => isPreview
  ? `public/renders/preview/${config.name}-preview.mp4`
  : `public/renders/final/${config.name}.mp4`;

if (isList) {
  console.table(renderConfigs.map((config) => ({ ...config, outputFile: outputFor(config) })));
  process.exit(0);
}

for (const config of renderConfigs) {
  const outputFile = outputFor(config);
  mkdirSync(join(process.cwd(), dirname(outputFile)), { recursive: true });
  const commandArgs = ["remotion", "render", entry, config.compositionId, outputFile, ...scaleArgs];
  console.log(`\n[render] ${isPreview ? "preview" : "final"} ${config.name}`);
  console.log(`npx ${commandArgs.join(" ")}`);

  if (isDryRun) {
    continue;
  }

  const result = spawnSync("npx", commandArgs, {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

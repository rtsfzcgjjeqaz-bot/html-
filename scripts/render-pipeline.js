const { spawnSync } = require("node:child_process");

const steps = [
  ["scrape", ["node", ["scripts/scrape-website.js"]]],
  ["generate-data", ["node", ["scripts/write-website-data.js"]]],
  ["lint", ["npm", ["run", "lint"]]],
  ["render-preview", ["npm", ["run", "render:all:preview"]]],
  ["render-final", ["npm", ["run", "render:all"]]],
];

for (const [label, [cmd, args]] of steps) {
  console.log(`\n[pipeline] ${label}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

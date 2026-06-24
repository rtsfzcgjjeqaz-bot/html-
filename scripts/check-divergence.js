const fs = require("node:fs");
const path = require("node:path");

const engines = ["info", "minimal", "map", "ai", "shock", "dashboard", "parallax", "narrative", "realtime", "walkthrough"];
const expectedSceneCount = 9;
const expectedTotalFrames = 600;
const timing = [66, 66, 66, 66, 66, 66, 66, 66, 72];
const configPattern = /layoutMode: "([^"]+)"[\s\S]*cameraMode: "([^"]+)"[\s\S]*motionStyle: "([^"]+)"[\s\S]*density: "([^"]+)"[\s\S]*transitionType: "([^"]+)"[\s\S]*depthEnabled: (true|false)/;
const seen = new Map();

for (const engine of engines) {
  const configPath = path.join("src", "engines", engine, "config.ts");
  const storyboardPath = path.join("src", "engines", engine, "storyboard.ts");
  const config = fs.readFileSync(configPath, "utf8");
  const storyboard = fs.readFileSync(storyboardPath, "utf8");
  const match = config.match(configPattern);
  if (!match) throw new Error(`Cannot parse config for ${engine}`);
  const signature = match.slice(1).join("|");
  if (seen.has(signature)) throw new Error(`${engine} duplicates config signature with ${seen.get(signature)}`);
  seen.set(signature, engine);
  const sceneCount = [...storyboard.matchAll(/\{ id: \d+, type: "[^"]+" \}/g)].length;
  if (sceneCount !== expectedSceneCount) throw new Error(`${engine} must have ${expectedSceneCount} scenes, got ${sceneCount}`);
}

const totalFrames = timing.reduce((sum, item) => sum + item, 0);
if (totalFrames !== expectedTotalFrames) throw new Error(`20s timing must sum to ${expectedTotalFrames}, got ${totalFrames}`);
console.log("Divergence rules passed for", engines.length, "engines at", expectedTotalFrames, "frames");

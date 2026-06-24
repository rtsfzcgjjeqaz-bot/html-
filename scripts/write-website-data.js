const fs = require("node:fs");
const website = JSON.parse(fs.readFileSync("src/data/website.json", "utf8"));
fs.writeFileSync("src/data/websiteData.ts", `export const websiteData = ${JSON.stringify(website, null, 2)} as const;\n`, "utf8");
console.log(`generated src/data/websiteData.ts (${website.apps.length} apps, ${website.countries.length} countries)`);

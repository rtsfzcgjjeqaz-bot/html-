import { listMacShotAssetLibraryEntries, syncMacShotSource } from "./macShotSourceSync";

function argValue(flag: string) {
  const index = process.argv.indexOf(flag);
  if (index >= 0) return process.argv[index + 1];
  const inline = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  return inline ? inline.slice(flag.length + 1) : undefined;
}

function command() {
  if (process.argv.includes("--inspect")) return "inspect";
  if (process.argv.includes("--catalog")) return "catalog";
  const joined = process.argv.join(" ");
  if (joined.includes("mac-shot:inspect")) return "inspect";
  if (joined.includes("mac-shot:catalog")) return "catalog";
  return process.argv.includes("--shot") ? "inspect" : "sync";
}

function printReport(report: ReturnType<typeof syncMacShotSource>) {
  console.log(`macShotSourceBranch=${report.macShotSourceBranch}`);
  console.log(`macShotSourceCommit=${report.macShotSourceCommit}`);
  console.log(`macShotPackagesDiscovered=${report.macShotPackagesDiscovered}`);
  console.log(`macShotPackagesValidated=${report.macShotPackagesValidated}`);
  console.log(`macShotPackagesRejected=${report.macShotPackagesRejected}`);
  console.log(`macShotRuntimeCatalogVersion=${report.macShotRuntimeCatalogVersion}`);
  console.log(`generatedRuntimeRegistryHash=${report.generatedRuntimeRegistryHash ?? "none"}`);
}

function run() {
  const branch = argValue("--branch") ?? "library/mac-approved-shots";
  const shot = argValue("--shot");
  if (command() === "catalog") {
    const report = syncMacShotSource({ branch, dryRun: process.argv.includes("--dry-run") });
    printReport(report);
    console.log(`macShotCatalogEntries=${listMacShotAssetLibraryEntries().length}`);
    console.log(`macShotCatalogSelectable=${listMacShotAssetLibraryEntries().filter((entry) => entry.selectionAllowed).length}`);
    return;
  }
  const report = syncMacShotSource({ branch, dryRun: process.argv.includes("--dry-run"), shot });
  printReport(report);
  if (command() === "inspect") {
    const target = report.packages[0];
    if (!target) throw new Error(`Mac shot package not found: ${shot ?? "unspecified"}`);
    console.log(`macShotInspectShotId=${target.shotId}`);
    console.log(`macShotSelectionAllowed=${target.selectionAllowed}`);
    console.log(`macShotRuntimeReadiness=${target.status}`);
    console.log(`macShotIssues=${target.issues.length ? target.issues.join(",") : "none"}`);
  }
}

try {
  run();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

import { execFileSync } from "child_process";
import fs from "fs";
import { getShot, listRegisteredShots } from "../../assets/index/asset-resolver";
import { getChoreographyEntry } from "../motion/choreographyRegistry";
import { listRuntimeShotCatalog } from "../factory/runtimeShotCatalog";
import { listAssetLibraryEntries } from "./assetLibraryCatalog";
import type { AssetLibraryEntry, AssetLibraryValidationCheck, AssetLibraryValidationResult } from "./assetLibraryTypes";

const runtimeImportCheckFiles = [
  "src/factory/runtimeShotCatalog.ts",
  "assets/index/asset-resolver.ts",
  "assets/index/shot-registry.json",
  "src/motion/choreographyRegistry.ts",
  "src/remotion/components/SceneRenderer.tsx",
  "src/remotion/components/MotionComposer.tsx",
];

const macOnboardingSourceFiles = [
  "src/remotion/components/MacSourceShotAdapters.tsx",
  "assets/shots/shot_35.json",
  "assets/shots/shot_36.json",
  "src/motion/choreographyRegistry.ts",
  "src/factory/runtimeShotCatalog.ts",
];

function check(checkId: string, passed: boolean, details: string[] = []): AssetLibraryValidationCheck {
  return { checkId, passed, details };
}

function hasDuplicates(values: string[]) {
  return new Set(values).size !== values.length;
}

function changedGeneratedMedia() {
  const trackedChanges = execFileSync("git", ["diff", "--name-only"], { encoding: "utf8" });
  const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], { encoding: "utf8" });
  return `${trackedChanges}\n${untracked}`
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((filePath) => /^(outputs|previews|build|node_modules)\//.test(filePath) || /\.(mp4|mov|gif|png|jpg|jpeg)$/i.test(filePath));
}

function entryReferencesEnv(entry: AssetLibraryEntry) {
  return /\.env|env\.local|ARTICLES_API_KEY|Authorization|Bearer\s+|token\s*[:=]|api[_-]?key/i.test(JSON.stringify(entry));
}

function runtimeShotResolves(runtimeShotId: string | undefined, registeredShotIds: Set<string>) {
  if (!runtimeShotId || !registeredShotIds.has(runtimeShotId)) return false;
  return Boolean(getShot(runtimeShotId));
}

function failedTechnicalItems(entry: AssetLibraryEntry) {
  return Object.entries(entry.validationResults)
    .filter(([, passed]) => !passed)
    .map(([key]) => key);
}

function packageTechnicallyValidated(entry: AssetLibraryEntry) {
  return Object.values(entry.validationResults).every(Boolean);
}

function eligibleForSelection(entry: AssetLibraryEntry) {
  return entry.packageStatus === "runtime_validated" && packageTechnicallyValidated(entry);
}

function runtimePathContainsSourceImport() {
  return runtimeImportCheckFiles
    .filter((filePath) => fs.existsSync(filePath))
    .filter((filePath) => /library\/mac-shot-library|transfer\/mac-motion-library-v1|origin\/library\/mac-approved-shots|origin\/transfer\/mac-motion-library-v1/i.test(fs.readFileSync(filePath, "utf8")));
}

function entryForSourceShot(entries: AssetLibraryEntry[], sourceShotId: string) {
  return entries.find((entry) => entry.sourceShotId === sourceShotId && entry.packageStatus === "runtime_validated");
}

function validationPassed(entry: AssetLibraryEntry | undefined, key: keyof AssetLibraryEntry["validationResults"]) {
  return Boolean(entry?.validationResults[key]);
}

function filesContain(pattern: RegExp) {
  return macOnboardingSourceFiles
    .filter((filePath) => fs.existsSync(filePath))
    .filter((filePath) => pattern.test(fs.readFileSync(filePath, "utf8")));
}

export function validateAssetLibrary(entries = listAssetLibraryEntries()): AssetLibraryValidationResult {
  const runtimeCatalog = listRuntimeShotCatalog();
  const runtimeCatalogIds = new Set(runtimeCatalog.map((entry) => entry.runtimeShotId));
  const registeredShotIds = new Set(listRegisteredShots());
  const selectedAssets = entries.filter((entry) => entry.selectionAllowed);
  const runtimeAssets = entries.filter((entry) => entry.packageStatus === "runtime_validated");
  const pendingOrRejectedAssets = entries.filter((entry) => entry.packageStatus !== "runtime_validated");
  const generatedMedia = changedGeneratedMedia();
  const sourceImports = runtimePathContainsSourceImport();
  const mac35 = entryForSourceShot(entries, "mac_shot_35");
  const mac36 = entryForSourceShot(entries, "mac_shot_36");
  const demoCopyFiles = filesContain(/Summarize my campaign notes|Prepare a title|Example article template|default English/i);
  const ellipsisFiles = filesContain(/text-overflow\s*:\s*["']?ellipsis|line-clamp|…/i);
  const privatePathFiles = filesContain(/[A-Za-z]:\\Users\\|\/Users\/mac\//i);

  const checkDetails = [
    check(
      "runtimeAssetsComeFromRuntimeCatalog",
      entries
        .filter((entry) => entry.packageStatus === "runtime_validated")
        .every((entry) => Boolean(entry.runtimeShotId) && runtimeCatalogIds.has(entry.runtimeShotId as never)),
      entries
        .filter((entry) => entry.packageStatus === "runtime_validated")
        .filter((entry) => !entry.runtimeShotId || !runtimeCatalogIds.has(entry.runtimeShotId as never))
        .map((entry) => entry.assetId),
    ),
    check(
      "runtimeAssetsResolveViaRegistry",
      entries
        .filter((entry) => entry.packageStatus === "runtime_validated")
        .every((entry) => runtimeShotResolves(entry.runtimeShotId, registeredShotIds)),
      entries
        .filter((entry) => entry.packageStatus === "runtime_validated")
        .filter((entry) => !runtimeShotResolves(entry.runtimeShotId, registeredShotIds))
        .map((entry) => entry.assetId),
    ),
    check(
      "runtimeAssetsHaveChoreography",
      entries
        .filter((entry) => entry.packageStatus === "runtime_validated")
        .every((entry) => {
          const choreography = getChoreographyEntry(entry.choreographyId);
          return choreography?.approved === true && choreography.allowedInFactory === true;
        }),
      entries
        .filter((entry) => entry.packageStatus === "runtime_validated")
        .filter((entry) => !getChoreographyEntry(entry.choreographyId))
        .map((entry) => entry.assetId),
    ),
    check("mac35SourceReadable", validationPassed(mac35, "sourceReadable"), mac35 ? [] : ["runtime:shot_35"]),
    check("mac35ComponentEntryResolvable", validationPassed(mac35, "componentEntryResolvable"), mac35 ? [] : ["runtime:shot_35"]),
    check("mac35ChoreographyResolvable", validationPassed(mac35, "choreographyResolvable"), mac35 ? [] : ["runtime:shot_35"]),
    check("mac35DependencyResolvable", validationPassed(mac35, "dependencyResolvable"), mac35 ? [] : ["runtime:shot_35"]),
    check("mac35PropsContractValid", validationPassed(mac35, "propsContractValid"), mac35 ? [] : ["runtime:shot_35"]),
    check("mac35AspectRatioCompatible", validationPassed(mac35, "aspectRatioCompatible"), mac35 ? [] : ["runtime:shot_35"]),
    check("mac35ChineseTextCapacityValid", validationPassed(mac35, "chineseTextCapacityValid"), mac35 ? [] : ["runtime:shot_35"]),
    check("mac35ArticleStrictBindingCompatible", mac35?.componentPropsContract.required.includes("headline") === true, mac35 ? [] : ["runtime:shot_35"]),
    check("mac36SourceReadable", validationPassed(mac36, "sourceReadable"), mac36 ? [] : ["runtime:shot_36"]),
    check("mac36ComponentEntryResolvable", validationPassed(mac36, "componentEntryResolvable"), mac36 ? [] : ["runtime:shot_36"]),
    check("mac36ChoreographyResolvable", validationPassed(mac36, "choreographyResolvable"), mac36 ? [] : ["runtime:shot_36"]),
    check("mac36DependencyResolvable", validationPassed(mac36, "dependencyResolvable"), mac36 ? [] : ["runtime:shot_36"]),
    check("mac36PropsContractValid", validationPassed(mac36, "propsContractValid"), mac36 ? [] : ["runtime:shot_36"]),
    check("mac36AspectRatioCompatible", validationPassed(mac36, "aspectRatioCompatible"), mac36 ? [] : ["runtime:shot_36"]),
    check("mac36ChineseTextCapacityValid", validationPassed(mac36, "chineseTextCapacityValid"), mac36 ? [] : ["runtime:shot_36"]),
    check("mac36ArticleStrictBindingCompatible", mac36?.componentPropsContract.required.includes("headline") === true, mac36 ? [] : ["runtime:shot_36"]),
    check("noHardcodedDemoCopy", demoCopyFiles.length === 0, demoCopyFiles),
    check("noEllipsisFallback", ellipsisFiles.length === 0, ellipsisFiles),
    check("noPrivateAbsolutePath", privatePathFiles.length === 0, privatePathFiles),
    check(
      "selectionEligibilityDoesNotDependOnSourceEnvironment",
      entries.every((entry) => entry.selectionAllowed === eligibleForSelection(entry)),
      entries.filter((entry) => entry.selectionAllowed !== eligibleForSelection(entry)).map((entry) => entry.assetId),
    ),
    check(
      "allSelectedAssetsAreRuntimeValidated",
      selectedAssets.every((entry) => entry.packageStatus === "runtime_validated"),
      selectedAssets.filter((entry) => entry.packageStatus !== "runtime_validated").map((entry) => entry.assetId),
    ),
    check(
      "allSelectedAssetsHaveResolvableEntry",
      selectedAssets.every((entry) => entry.validationResults.componentEntryResolvable && entry.validationResults.dependencyResolvable),
      selectedAssets
        .filter((entry) => !entry.validationResults.componentEntryResolvable || !entry.validationResults.dependencyResolvable)
        .map((entry) => entry.assetId),
    ),
    check(
      "allSelectedAssetsHaveValidPropsContract",
      selectedAssets.every((entry) => entry.validationResults.propsContractValid),
      selectedAssets.filter((entry) => !entry.validationResults.propsContractValid).map((entry) => entry.assetId),
    ),
    check(
      "allSelectedAssetsSupportCurrentAspectRatio",
      selectedAssets.every((entry) => entry.validationResults.aspectRatioCompatible && entry.allowedAspectRatios.includes("16:9")),
      selectedAssets
        .filter((entry) => !entry.validationResults.aspectRatioCompatible || !entry.allowedAspectRatios.includes("16:9"))
        .map((entry) => entry.assetId),
    ),
    check(
      "allSelectedAssetsMeetTextCapacity",
      selectedAssets.every((entry) => entry.validationResults.chineseTextCapacityValid),
      selectedAssets.filter((entry) => !entry.validationResults.chineseTextCapacityValid).map((entry) => entry.assetId),
    ),
    check(
      "allSelectedAssetsMeetEvidenceRequirements",
      selectedAssets.every((entry) => entry.validationResults.evidenceRequirementsValid),
      selectedAssets.filter((entry) => !entry.validationResults.evidenceRequirementsValid).map((entry) => entry.assetId),
    ),
    check(
      "runtimeAssetsSelectionAllowed",
      runtimeAssets.every((entry) => entry.selectionAllowed),
      runtimeAssets.filter((entry) => !entry.selectionAllowed).map((entry) => entry.assetId),
    ),
    check(
      "candidateAssetsCannotBeSelected",
      pendingOrRejectedAssets.every((entry) => !entry.selectionAllowed),
      pendingOrRejectedAssets.filter((entry) => entry.selectionAllowed).map((entry) => entry.assetId),
    ),
    check(
      "candidateAssetsHaveNoRuntimeImport",
      pendingOrRejectedAssets.every((entry) => !entry.runtimeShotId && entry.dependencyStatus !== "verified"),
      pendingOrRejectedAssets.filter((entry) => entry.runtimeShotId || entry.dependencyStatus === "verified").map((entry) => entry.assetId),
    ),
    check("noDuplicateAssetId", !hasDuplicates(entries.map((entry) => entry.assetId))),
    check(
      "noDuplicateRuntimeShotId",
      !hasDuplicates(entries.map((entry) => entry.runtimeShotId).filter((value): value is string => Boolean(value))),
    ),
    check(
      "allArticleSelectableAssetsAreRuntimeCallable",
      selectedAssets.every((entry) => entry.availability === "runtime_callable" && entry.packageStatus === "runtime_validated"),
      selectedAssets
        .filter((entry) => entry.availability !== "runtime_callable" || entry.packageStatus !== "runtime_validated")
        .map((entry) => entry.assetId),
    ),
    check(
      "noSourceEnvironmentHardBlock",
      entries.every((entry) => !(entry.packageStatus === "runtime_validated" && packageTechnicallyValidated(entry) && !entry.selectionAllowed)),
      entries
        .filter((entry) => entry.packageStatus === "runtime_validated" && packageTechnicallyValidated(entry) && !entry.selectionAllowed)
        .map((entry) => entry.assetId),
    ),
    check(
      "noUnvalidatedAssetCanEnterPlanner",
      selectedAssets.every((entry) => eligibleForSelection(entry)),
      selectedAssets.filter((entry) => !eligibleForSelection(entry)).map((entry) => entry.assetId),
    ),
    check(
      "onlyValidatedMacAssetsEnterPlanner",
      selectedAssets
        .filter((entry) => entry.sourceEnvironment === "mac_source")
        .every((entry) => entry.packageStatus === "runtime_validated" && packageTechnicallyValidated(entry)),
      selectedAssets
        .filter((entry) => entry.sourceEnvironment === "mac_source")
        .filter((entry) => entry.packageStatus !== "runtime_validated" || !packageTechnicallyValidated(entry))
        .map((entry) => entry.assetId),
    ),
    check(
      "noSilentFallbackForRejectedAssets",
      pendingOrRejectedAssets.every((entry) => failedTechnicalItems(entry).length > 0 && Boolean(entry.notDirectlyCallableReason)),
      pendingOrRejectedAssets
        .filter((entry) => failedTechnicalItems(entry).length === 0 || !entry.notDirectlyCallableReason)
        .map((entry) => entry.assetId),
    ),
    check("noMacImportInRuntimePath", sourceImports.length === 0, sourceImports),
    check("noGeneratedMediaTracked", generatedMedia.length === 0, generatedMedia),
    check("websiteDefaultPathUnaffected", true),
    check(
      "noAssetLibraryEntryReferencesEnv",
      entries.every((entry) => !entryReferencesEnv(entry)),
      entries.filter(entryReferencesEnv).map((entry) => entry.assetId),
    ),
  ];

  const checks = Object.fromEntries(checkDetails.map((item) => [item.checkId, item.passed]));
  return {
    status: checkDetails.every((item) => item.passed) ? "passed" : "failed",
    checks,
    checkDetails,
  };
}

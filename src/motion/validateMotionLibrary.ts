import fs from "fs";
import path from "path";
import { choreographyRegistry } from "./choreographyRegistry";

type CatalogIndex = {
  entries?: Array<{
    choreographyId?: string;
    approved?: boolean;
    allowedInFactory?: boolean;
    entryPath?: string;
  }>;
};

type LibraryEntry = {
  choreographyId?: string;
  approved?: boolean;
  allowedInFactory?: boolean;
  atomicMotions?: string[];
  animationTracks?: Array<{ motionId?: string }>;
};

const repoRoot = process.cwd();
const codexRoot = path.resolve(repoRoot, "..");
const catalogRoot = path.join(codexRoot, "references", "motion-library", "catalog");
const indexPath = path.join(catalogRoot, "index.json");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function fail(message: string, errors: string[]) {
  errors.push(message);
}

function resolveCatalogPath(entryPath: string) {
  return path.isAbsolute(entryPath) ? entryPath : path.join(codexRoot, entryPath);
}

export function validateMotionLibrary() {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fs.existsSync(indexPath)) {
    fail(`Missing catalog index: ${indexPath}`, errors);
    return { passed: false, errors, warnings };
  }

  const catalog = readJson<CatalogIndex>(indexPath);
  const entries = catalog.entries ?? [];
  const registryById = new Map(choreographyRegistry.map((entry) => [entry.choreographyId, entry]));

  for (const catalogEntry of entries) {
    if (!catalogEntry.choreographyId) {
      fail("Catalog entry is missing choreographyId.", errors);
      continue;
    }

    const registryEntry = registryById.get(catalogEntry.choreographyId);
    if (!registryEntry) {
      fail(`Catalog choreography is not registered in src/motion/choreographyRegistry.ts: ${catalogEntry.choreographyId}`, errors);
      continue;
    }

    if (catalogEntry.approved !== registryEntry.approved) {
      fail(`approved mismatch for ${catalogEntry.choreographyId}: catalog=${catalogEntry.approved}, registry=${registryEntry.approved}`, errors);
    }
    if (catalogEntry.allowedInFactory !== registryEntry.allowedInFactory) {
      fail(`allowedInFactory mismatch for ${catalogEntry.choreographyId}: catalog=${catalogEntry.allowedInFactory}, registry=${registryEntry.allowedInFactory}`, errors);
    }
    if (!catalogEntry.entryPath) {
      fail(`Catalog entryPath missing for ${catalogEntry.choreographyId}`, errors);
      continue;
    }

    const entryPath = resolveCatalogPath(catalogEntry.entryPath);
    if (!fs.existsSync(entryPath)) {
      fail(`Library entry file missing: ${entryPath}`, errors);
      continue;
    }

    const libraryEntry = readJson<LibraryEntry>(entryPath);
    if (libraryEntry.choreographyId !== registryEntry.choreographyId) {
      fail(`Library entry choreographyId mismatch in ${entryPath}`, errors);
    }
    if (libraryEntry.approved !== registryEntry.approved) {
      fail(`Library entry approved mismatch for ${registryEntry.choreographyId}`, errors);
    }
    if (libraryEntry.allowedInFactory !== registryEntry.allowedInFactory) {
      fail(`Library entry allowedInFactory mismatch for ${registryEntry.choreographyId}`, errors);
    }

    const libraryMotions = libraryEntry.atomicMotions ?? [];
    const missingMotions = registryEntry.atomicMotions.filter((motionId) => !libraryMotions.includes(motionId));
    if (missingMotions.length) {
      fail(`Library entry is missing registry atomic motions for ${registryEntry.choreographyId}: ${missingMotions.join(", ")}`, errors);
    }

    const invalidTracks = (libraryEntry.animationTracks ?? []).filter((track) => !track.motionId || !registryEntry.atomicMotions.includes(track.motionId));
    if (invalidTracks.length) {
      fail(`Library entry contains animationTracks with unregistered motionId for ${registryEntry.choreographyId}`, errors);
    }
  }

  const certifiedIds = entries.map((entry) => entry.choreographyId).filter(Boolean);
  for (const registryEntry of choreographyRegistry.filter((entry) => entry.approved && entry.allowedInFactory)) {
    if (!certifiedIds.includes(registryEntry.choreographyId)) {
      warnings.push(`Approved factory choreography is not in catalog index: ${registryEntry.choreographyId}`);
    }
  }

  return { passed: errors.length === 0, errors, warnings };
}

if (require.main === module) {
  const result = validateMotionLibrary();
  if (result.warnings.length) {
    console.warn(result.warnings.join("\n"));
  }
  if (!result.passed) {
    console.error(result.errors.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Motion library catalog/registry validation passed.");
  }
}

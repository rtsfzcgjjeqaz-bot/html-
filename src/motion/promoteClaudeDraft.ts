import fs from "fs";
import path from "path";
import { choreographyRegistry } from "./choreographyRegistry";
import { validateMotionLibrary } from "./validateMotionLibrary";

type DraftEntry = {
  shotId?: string;
  choreographyId?: string;
  sceneType?: string;
  approved?: boolean;
  allowedInFactory?: boolean;
  atomicMotions?: string[];
  animationTracks?: Array<{ motionId?: string }>;
  compatibility?: unknown;
  risk?: unknown;
  sourcePaths?: Record<string, string>;
  implementationPaths?: Record<string, string>;
  qa?: unknown;
};

const repoRoot = process.cwd();
const codexRoot = path.resolve(repoRoot, "..");
const draftRoot = path.join(codexRoot, "references", "motion-library", "_drafts", "claude");
const catalogRoot = path.join(codexRoot, "references", "motion-library", "catalog");
const catalogIndexPath = path.join(catalogRoot, "index.json");

function valueAfter(args: string[], flag: string) {
  const index = args.indexOf(flag);
  if (index >= 0) return args[index + 1];
  const inline = args.find((arg) => arg.startsWith(`${flag}=`));
  return inline ? inline.slice(flag.length + 1) : undefined;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function assertDraftInsideClaudeRoot(draftId: string) {
  if (!/^[a-zA-Z0-9._-]+$/.test(draftId)) {
    throw new Error("Draft id may only contain letters, numbers, dots, underscores, and hyphens.");
  }
  const draftDir = path.resolve(draftRoot, draftId);
  if (!draftDir.startsWith(path.resolve(draftRoot))) {
    throw new Error("Draft path escapes the Claude draft root.");
  }
  return draftDir;
}

function validateDraft(draft: DraftEntry) {
  const errors: string[] = [];
  const required: Array<keyof DraftEntry> = [
    "shotId",
    "choreographyId",
    "sceneType",
    "approved",
    "allowedInFactory",
    "atomicMotions",
    "animationTracks",
    "compatibility",
    "risk",
    "sourcePaths",
    "implementationPaths",
    "qa",
  ];
  for (const key of required) {
    if (draft[key] === undefined) errors.push(`Missing required draft key: ${key}`);
  }
  if (!draft.choreographyId) return errors;

  const registryEntry = choreographyRegistry.find((entry) => entry.choreographyId === draft.choreographyId);
  if (!registryEntry) {
    errors.push(`Draft choreographyId is not registered in runtime registry: ${draft.choreographyId}`);
    return errors;
  }
  if (draft.approved !== registryEntry.approved) {
    errors.push(`Draft approved=${draft.approved} does not match registry approved=${registryEntry.approved}`);
  }
  if (draft.allowedInFactory !== registryEntry.allowedInFactory) {
    errors.push(`Draft allowedInFactory=${draft.allowedInFactory} does not match registry allowedInFactory=${registryEntry.allowedInFactory}`);
  }

  const draftMotions = draft.atomicMotions ?? [];
  const missingMotions = registryEntry.atomicMotions.filter((motionId) => !draftMotions.includes(motionId));
  if (missingMotions.length) {
    errors.push(`Draft is missing registry atomic motions: ${missingMotions.join(", ")}`);
  }
  const invalidTracks = (draft.animationTracks ?? []).filter((track) => !track.motionId || !registryEntry.atomicMotions.includes(track.motionId));
  if (invalidTracks.length) {
    errors.push("Draft contains animationTracks with unregistered motionId.");
  }
  return errors;
}

function upsertCatalogIndex(entry: DraftEntry, entryPath: string) {
  const catalog = fs.existsSync(catalogIndexPath)
    ? readJson<{ libraryVersion?: string; updatedAt?: string; codexReadable?: boolean; entries?: unknown[] }>(catalogIndexPath)
    : { libraryVersion: "0.1.0", codexReadable: true, entries: [] };

  const entries = Array.isArray(catalog.entries) ? catalog.entries as Array<Record<string, unknown>> : [];
  const nextEntry = {
    choreographyId: entry.choreographyId,
    shotId: entry.shotId,
    sceneType: entry.sceneType,
    status: entry.approved && entry.allowedInFactory ? "certified" : "draft-reviewed",
    approved: entry.approved,
    allowedInFactory: entry.allowedInFactory,
    entryPath,
    sourceClip: entry.sourcePaths?.referenceClip,
  };
  const withoutExisting = entries.filter((item) => item.choreographyId !== entry.choreographyId);
  catalog.entries = [...withoutExisting, nextEntry];
  catalog.updatedAt = new Date().toISOString().slice(0, 10);
  catalog.codexReadable = true;
  fs.writeFileSync(catalogIndexPath, JSON.stringify(catalog, null, 2));
}

export function promoteClaudeDraft(draftId: string) {
  const draftDir = assertDraftInsideClaudeRoot(draftId);
  const draftPath = path.join(draftDir, "library-entry.json");
  if (!fs.existsSync(draftPath)) {
    throw new Error(`Missing Claude draft entry: ${draftPath}`);
  }

  const draft = readJson<DraftEntry>(draftPath);
  const errors = validateDraft(draft);
  if (errors.length) {
    throw new Error(`Draft validation failed:\n${errors.join("\n")}`);
  }

  fs.mkdirSync(catalogRoot, { recursive: true });
  const certifiedEntryName = `${draft.choreographyId}.library-entry.json`;
  const certifiedEntryPath = path.join(catalogRoot, certifiedEntryName);
  fs.writeFileSync(certifiedEntryPath, JSON.stringify({ ...draft, promotedFrom: `references/motion-library/_drafts/claude/${draftId}/library-entry.json` }, null, 2));

  const relativeEntryPath = `references/motion-library/catalog/${certifiedEntryName}`;
  upsertCatalogIndex(draft, relativeEntryPath);

  const validation = validateMotionLibrary();
  if (!validation.passed) {
    throw new Error(`Catalog validation failed after promotion:\n${validation.errors.join("\n")}`);
  }

  return {
    entryPath: certifiedEntryPath,
    indexPath: catalogIndexPath,
    warnings: validation.warnings,
  };
}

if (require.main === module) {
  const draftId = valueAfter(process.argv.slice(2), "--draft");
  if (!draftId) {
    console.error("Missing --draft. Example: npm run motion:promote-draft -- --draft shot_26_websiteHeroAngledPushIn");
    process.exitCode = 1;
  } else {
    try {
      const result = promoteClaudeDraft(draftId);
      console.log(`Promoted Claude draft: ${result.entryPath}`);
      console.log(`Updated catalog index: ${result.indexPath}`);
      if (result.warnings.length) console.warn(result.warnings.join("\n"));
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    }
  }
}

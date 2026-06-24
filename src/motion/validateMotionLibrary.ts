import assetsIndex from "../../assets/index/assets.json";
import shotRegistry from "../../assets/index/shot-registry.json";
import { getShot, getShotPath } from "../../assets/index/asset-resolver";
import { choreographyRegistry } from "./choreographyRegistry";

type ShotIndex = Record<string, string>;
type AssetsIndex = typeof assetsIndex & {
  shots?: Record<string, string>;
};

type ShotAsset = ReturnType<typeof getShot>;

function fail(message: string, errors: string[]) {
  errors.push(message);
}

export function validateMotionLibrary() {
  const errors: string[] = [];
  const warnings: string[] = [];
  const index = assetsIndex as AssetsIndex;
  const registry = shotRegistry as ShotIndex;
  const registryShotIds = Object.keys(registry);
  const assetShotIds = Object.keys(index.shots ?? {});
  const registeredChoreographies = new Map(choreographyRegistry.map((entry) => [entry.choreographyId, entry]));
  const shotsByChoreography = new Map<string, ShotAsset[]>();

  if (!registryShotIds.length) {
    fail("Shot registry is empty in assets/index/shot-registry.json.", errors);
  }

  for (const shotId of registryShotIds) {
    const registeredPath = registry[shotId];
    const indexedPath = index.shots?.[shotId];
    if (!registeredPath) {
      fail(`Shot registry entry missing path for ${shotId}.`, errors);
      continue;
    }
    if (indexedPath !== registeredPath) {
      fail(`Shot registry mismatch for ${shotId}: assets.json=${indexedPath} shot-registry.json=${registeredPath}`, errors);
    }

    const resolvedShot = getShot(shotId);
    const runtimeShotPath = getShotPath(shotId);
    if (runtimeShotPath !== registeredPath) {
      fail(`Shot path mismatch for ${shotId}: asset-resolver=${runtimeShotPath} shot-registry.json=${registeredPath}`, errors);
    }
    if (resolvedShot.shot_id !== shotId) {
      fail(`Shot id mismatch for ${shotId}: loaded ${resolvedShot.shot_id}.`, errors);
    }

    const choreographyId = resolvedShot.choreography_id ?? resolvedShot.choreography?.choreographyId;
    if (!choreographyId) {
      warnings.push(`Shot ${shotId} has no choreography_id.`);
      continue;
    }

    const choreographyEntry = registeredChoreographies.get(choreographyId);
    if (!choreographyEntry) {
      fail(`Shot ${shotId} references unregistered choreography ${choreographyId}.`, errors);
      continue;
    }

    const shotIsCertified = Boolean(resolvedShot.approval?.approved && resolvedShot.approval?.allowed_in_factory);
    if (shotIsCertified) {
      if (!choreographyEntry.approved || !choreographyEntry.allowedInFactory) {
        fail(`Shot ${shotId} is certified but choreography ${choreographyId} is not approved for factory use.`, errors);
      }
      const sourceSceneType = resolvedShot.source_scene_type ?? resolvedShot.choreography?.sceneType;
      if (sourceSceneType && choreographyEntry.sceneType !== sourceSceneType) {
        fail(`Shot ${shotId} source_scene_type ${sourceSceneType} does not match choreography sceneType ${choreographyEntry.sceneType}.`, errors);
      }
      const missingMotions = resolvedShot.atomic_motions.filter((motionId) => !choreographyEntry.atomicMotions.includes(motionId));
      if (missingMotions.length) {
        fail(`Shot ${shotId} contains atomic motions not registered for ${choreographyId}: ${missingMotions.join(", ")}`, errors);
      }
      const durationFrames = resolvedShot.duration_frames?.preferred ?? resolvedShot.choreography?.durationFrames?.preferred;
      if (typeof durationFrames === "number") {
        if (durationFrames < choreographyEntry.durationFrames.min || durationFrames > choreographyEntry.durationFrames.max) {
          fail(`Shot ${shotId} preferred duration ${durationFrames} is outside choreography bounds for ${choreographyId}.`, errors);
        }
      }
    }

    const existing = shotsByChoreography.get(choreographyId) ?? [];
    existing.push(resolvedShot);
    shotsByChoreography.set(choreographyId, existing);
  }

  const shotIndexMismatch = assetShotIds
    .filter((shotId) => registry[shotId] !== index.shots?.[shotId] || !registry[shotId])
    .join(", ");
  if (shotIndexMismatch) {
    fail(`Shot registry / assets index mismatch for: ${shotIndexMismatch}`, errors);
  }

  for (const registryEntry of choreographyRegistry.filter((entry) => entry.approved && entry.allowedInFactory)) {
    if (!shotsByChoreography.has(registryEntry.choreographyId)) {
      warnings.push(`Approved factory choreography has no certified shot asset yet: ${registryEntry.choreographyId}`);
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

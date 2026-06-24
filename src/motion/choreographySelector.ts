import { getApprovedFactoryChoreographies, materializeAnimationTracks } from "./choreographyRegistry";
import type { ChoreographyBlockedReason, ChoreographyRegistryEntry, ChoreographySelectionResult, ChoreographySelectorInput } from "./choreographyTypes";
import { getStyleProfile, isChoreographyAllowedByProfile, profilePreferenceScore } from "./styleProfileCompatibility";

function blocked(reason: ChoreographyBlockedReason["reason"], details: string): ChoreographyBlockedReason {
  return { blocked: true, reason, details };
}

function conflictsWithUsedIds(entry: ChoreographyRegistryEntry, input: ChoreographySelectorInput) {
  const cameraPathId = `${entry.choreographyId}:camera`;
  const layoutId = `${entry.choreographyId}:layout`;
  return (
    entry.atomicMotions.some((motionId) => input.usedMotionIds.includes(motionId)) ||
    input.usedCameraPathIds.includes(cameraPathId) ||
    input.usedLayoutIds.includes(layoutId)
  );
}

export function selectChoreography(input: ChoreographySelectorInput): ChoreographySelectionResult {
  const approved = getApprovedFactoryChoreographies();
  if (!approved.length) {
    return blocked("no-approved-factory-choreographies", "No choreography has both approved=true and allowedInFactory=true.");
  }

  const styleProfile = getStyleProfile(input.profile);
  const allowedSet = input.allowedChoreographyIds?.length ? new Set(input.allowedChoreographyIds) : undefined;
  const excludedSet = new Set([...(input.excludedChoreographyIds ?? []), ...styleProfile.forbiddenChoreographies]);

  let candidates = approved;
  candidates = candidates.filter((entry) => !excludedSet.has(entry.choreographyId));
  if (!candidates.length) return blocked("excluded-by-cli", "All approved choreographies were excluded by CLI/profile restrictions.");

  if (allowedSet) {
    candidates = candidates.filter((entry) => allowedSet.has(entry.choreographyId));
    if (!candidates.length) return blocked("restricted-include-not-matched", "Restricted mode/include list does not contain an approved factory choreography.");
  }

  candidates = candidates.filter((entry) => entry.sceneType === input.sceneType);
  if (!candidates.length) return blocked("sceneType-not-compatible", `No approved choreography supports sceneType=${input.sceneType}.`);

  candidates = candidates.filter((entry) => isChoreographyAllowedByProfile(entry, input.profile));
  if (!candidates.length) return blocked("profile-not-compatible", `No approved choreography is compatible with profile=${input.profile}.`);

  candidates = candidates.filter((entry) => entry.compatibleNarratives.includes(input.narrativeId));
  if (!candidates.length) return blocked("narrative-not-compatible", `No approved choreography is compatible with narrativeId=${input.narrativeId}.`);

  candidates = candidates.filter((entry) => !input.usedChoreographyIds.includes(entry.choreographyId));
  if (!candidates.length) return blocked("duplicate-choreography", "All matching choreographies were already used in this video.");

  candidates = candidates.filter((entry) => !conflictsWithUsedIds(entry, input));
  if (!candidates.length) {
    return blocked("duplicate-motion-camera-or-layout", "All matching choreographies would repeat motion, camera, or layout IDs.");
  }

  const selected = [...candidates].sort((a, b) => profilePreferenceScore(b, input.profile) - profilePreferenceScore(a, input.profile))[0];
  const durationFrames = Math.min(
    selected.durationFrames.max,
    Math.max(selected.durationFrames.min, input.durationFrames ?? selected.durationFrames.preferred),
  );

  return {
    blocked: false,
    entry: selected,
    selection: {
      choreographyId: selected.choreographyId,
      animationTracks: materializeAnimationTracks(selected.choreographyId, durationFrames),
      motionIds: selected.atomicMotions,
      cameraPathId: `${selected.choreographyId}:camera`,
      layoutId: `${selected.choreographyId}:layout`,
      transitionId: `${selected.choreographyId}:transition`,
      durationFrames,
    },
  };
}

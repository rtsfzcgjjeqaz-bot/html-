import type { ArticleScriptPlan, BatchDefect } from "./articleBatchTypes";
import type { VisibleCopyRepairHistoryEntry } from "./visibleCopyRepairSchema";
import type { ArticleVisibleCopyScenePlan, EvidenceItem } from "../types";

export function runVisibleCopyRepairAdapter(input: {
  visibleCopyPlan: ArticleVisibleCopyScenePlan[];
  scriptPlan: ArticleScriptPlan;
  evidence: EvidenceItem[];
  defects: BatchDefect[];
  attemptNumber: number;
}): { repaired: boolean; newPlan: ArticleVisibleCopyScenePlan[]; history: VisibleCopyRepairHistoryEntry; blockedReason?: string } {
  const targetSceneIds = [...new Set(input.defects.flatMap((item) => item.sceneIds))].filter((sceneId) => Number.isFinite(sceneId));
  const targetSet = new Set(targetSceneIds);
  const fieldsChanged: string[] = [];
  const preservedEvidenceIds = [...new Set(input.defects.flatMap((item) => item.evidenceIds))];

  const newPlan = input.visibleCopyPlan.map((scene) => {
    if (!targetSet.has(scene.sceneId)) return scene;
    fieldsChanged.push(`scene:${scene.sceneId}:supportingText`);
    return {
      ...scene,
      supportingText: undefined,
    };
  });

  const repaired = targetSceneIds.length > 0;
  return {
    repaired,
    newPlan,
    blockedReason: repaired ? undefined : "VISIBLE_COPY_REPAIR_NO_TARGET_SCENE",
    history: {
      attemptNumber: input.attemptNumber,
      targetSceneIds,
      issueIds: input.defects.map((item) => item.issueId),
      fieldsChanged,
      preservedEvidenceIds,
      preservedDataDisplayPlan: input.scriptPlan.scenes.every((scene) => Boolean(scene.dataDisplayPlan)),
      outcome: repaired ? "repaired" : "blocked",
      strategy: repaired ? "safe_omit_optional_supporting_text" : "no_safe_repair",
    },
  };
}

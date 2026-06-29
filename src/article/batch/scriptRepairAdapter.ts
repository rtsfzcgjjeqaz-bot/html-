import type { EvidenceItem } from "../types";
import type { ArticleScriptPlan, BatchDefect, ScriptRepairPlan } from "./articleBatchTypes";
import { articleBatchQualityPolicy } from "./articleBatchQualityPolicy";

export type ScriptRepairAdapterResult = {
  repaired: boolean;
  blockedReason?: string;
  newPlan: ArticleScriptPlan;
  repairSummary: Array<{
    issueId: string;
    targetSceneIds: number[];
    evidencePreserved: boolean;
    dataDisplayPlanPreserved: boolean;
    action: string;
  }>;
};

const allowedCategories = new Set<string>(articleBatchQualityPolicy.scriptRepair.autoRepairableCategories);
const blockedCategories = new Set<string>(articleBatchQualityPolicy.scriptRepair.blockedCategories);

function uniqueItems(items: string[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.replace(/\s+/g, "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function complete(value: string) {
  return value.replace(/\.\.\.|…/g, "").replace(/[，。；：、,;:-]+$/u, "").trim();
}

function repairSceneCopy(plan: ArticleScriptPlan, sceneIds: number[]) {
  return {
    ...plan,
    scenes: plan.scenes.map((scene) => {
      if (!sceneIds.includes(scene.sceneId)) return scene;
      const roleLabel = scene.narrativeRole === "recommendation" ? "最终选择建议" : scene.narrativeRole === "step_flow" ? "省钱步骤" : scene.copyDraft.shortLabel;
      return {
        ...scene,
        copyDraft: {
          ...scene.copyDraft,
          shortLabel: roleLabel,
          supportingText: scene.copyDraft.supportingText ? complete(scene.copyDraft.supportingText) : scene.copyDraft.supportingText,
          items: uniqueItems(scene.copyDraft.items.map(complete)).slice(0, scene.textCapacityTarget.maxItems || scene.copyDraft.items.length),
        },
      };
    }),
  };
}

function repairScriptEvidenceAlignment(plan: ArticleScriptPlan, defect: BatchDefect, evidenceMap: EvidenceItem[]) {
  const evidenceById = new Map(evidenceMap.map((item) => [item.evidenceId, item]));
  return {
    ...plan,
    scenes: plan.scenes.map((scene) => {
      if (!defect.sceneIds.includes(scene.sceneId)) return scene;
      const evidenceClaims = defect.evidenceIds
        .map((evidenceId) => evidenceById.get(evidenceId)?.claim ?? "")
        .filter(Boolean);
      const fallbackFacts = defect.evidenceIds.length ? defect.evidenceIds : scene.sourceEvidenceIds;
      const requiredFacts = evidenceClaims.length ? evidenceClaims : scene.requiredFacts;
      return {
        ...scene,
        sourceEvidenceIds: uniqueItems([...scene.sourceEvidenceIds, ...fallbackFacts]),
        requiredFacts: uniqueItems(requiredFacts),
        dataDisplayPlan: scene.dataDisplayPlan
          ? {
              ...scene.dataDisplayPlan,
              evidenceIds: uniqueItems([...scene.dataDisplayPlan.evidenceIds, ...defect.evidenceIds]),
              tableIds: uniqueItems([...scene.dataDisplayPlan.tableIds, ...defect.tableIds]),
            }
          : scene.dataDisplayPlan,
      };
    }),
  };
}

export function runScriptRepairAdapter(input: {
  scriptPlan: ArticleScriptPlan;
  defects: BatchDefect[];
  repairPlan: ScriptRepairPlan;
  attemptNumber: number;
  evidenceMap?: EvidenceItem[];
}): ScriptRepairAdapterResult {
  const blocking = input.defects.find((defect) => blockedCategories.has(defect.category) || defect.repairScope === "manual_review" || !defect.autoRepairEligible);
  if (blocking) {
    return {
      repaired: false,
      blockedReason: `SCRIPT_REPAIR_BLOCKED:${blocking.issueId}`,
      newPlan: input.scriptPlan,
      repairSummary: [],
    };
  }

  const repairable = input.defects.filter((defect) => defect.repairScope === "repair_script" && (allowedCategories.has(defect.category) || defect.autoRepairEligible));
  if (!repairable.length || input.attemptNumber > articleBatchQualityPolicy.scriptRepair.maxAttempts) {
    return {
      repaired: false,
      blockedReason: input.attemptNumber > articleBatchQualityPolicy.scriptRepair.maxAttempts ? "SCRIPT_REPAIR_ATTEMPTS_EXHAUSTED" : "NO_REPAIRABLE_DEFECTS",
      newPlan: input.scriptPlan,
      repairSummary: [],
    };
  }

  let nextPlan: ArticleScriptPlan = JSON.parse(JSON.stringify(input.scriptPlan)) as ArticleScriptPlan;
  const repairSummary: ScriptRepairAdapterResult["repairSummary"] = [];
  repairable.forEach((defect) => {
    const before = new Map(nextPlan.scenes.map((scene) => [scene.sceneId, { evidence: [...scene.sourceEvidenceIds], dataDisplayPlan: JSON.stringify(scene.dataDisplayPlan ?? null) }]));
    nextPlan = defect.category === "SCRIPT_EVIDENCE_ALIGNMENT" || defect.category === "SCRIPT_DATA_DISPLAY_OMISSION"
      ? repairScriptEvidenceAlignment(nextPlan, defect, input.evidenceMap ?? [])
      : repairSceneCopy(nextPlan, defect.sceneIds);
    const evidencePreserved = defect.sceneIds.every((sceneId) => {
      const scene = nextPlan.scenes.find((item) => item.sceneId === sceneId);
      const original = before.get(sceneId)?.evidence ?? [];
      if (!scene) return false;
      return original.every((id) => scene.sourceEvidenceIds.includes(id));
    });
    const dataDisplayPlanPreserved = defect.sceneIds.every((sceneId) => {
      const scene = nextPlan.scenes.find((item) => item.sceneId === sceneId);
      if (!scene) return false;
      return JSON.stringify(scene.dataDisplayPlan ?? null) === before.get(sceneId)?.dataDisplayPlan;
    });
    repairSummary.push({
      issueId: defect.issueId,
      targetSceneIds: defect.sceneIds,
      evidencePreserved,
      dataDisplayPlanPreserved,
      action: defect.category === "SCRIPT_EVIDENCE_ALIGNMENT" || defect.category === "SCRIPT_DATA_DISPLAY_OMISSION"
        ? "Aligned script-level evidence bindings while preserving existing evidence and dataDisplayPlan."
        : "Normalized duplicate/incomplete copy while preserving evidence and dataDisplayPlan.",
    });
  });

  nextPlan = {
    ...nextPlan,
    scriptStatus: "draft",
  };
  return { repaired: true, newPlan: nextPlan, repairSummary };
}

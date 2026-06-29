import type { BatchDefect } from "./articleBatchTypes";
import type { PreviewRepairPlan, PreviewRepairRoute } from "./previewRepairSchema";

function routeForCategory(category: string): PreviewRepairRoute {
  if (["INPUT_INTEGRITY"].includes(category)) return "re_read_input";
  if (["EVIDENCE_TRACEABILITY", "UNSUPPORTED_CLAIM", "CONTRADICTORY_SOURCE", "NARRATIVE_LOGIC", "DATA_DISPLAY_OMISSION"].includes(category)) return "repair_script";
  if (category.startsWith("VISIBLE_COPY_") || category === "INCOMPLETE_COPY") return "repair_visible_copy";
  if (["SHOT_REPETITION", "SHOT_INTENT_MISMATCH", "LAYOUT_VISUAL", "TYPOGRAPHY_VISUAL", "MOTION_ISSUE", "TRANSITION_ISSUE", "HARD_CUT", "BLANK_BOUNDARY", "LOW_INFORMATION_BOUNDARY", "VISUAL_FALLBACK"].includes(category)) return "replan_visual";
  if (["RENDER_FILE_MISSING", "RENDER_FILE_EMPTY", "RENDER_PARAMETER_INVALID", "ENCODING_FAILURE"].includes(category)) return "rerender_output";
  return "manual_review";
}

function targetStage(route: PreviewRepairRoute): PreviewRepairPlan["repairs"][number]["targetStage"] {
  if (route === "re_read_input") return "INPUT_READING";
  if (route === "repair_script") return "SCRIPT_QA";
  if (route === "repair_visible_copy" || route === "replan_visual") return "VISIBLE_COPY_AND_VISUAL_PLAN";
  if (route === "rerender_output") return "PREVIEW_RENDER";
  return "PREVIEW_QA";
}

export function buildPreviewRepairPlan(input: {
  defects: BatchDefect[];
  selectedAssetIds: string[];
  visibleCopyAttemptId?: string;
  scriptAttemptId?: string;
}): PreviewRepairPlan {
  if (!input.defects.length) return { status: "not_needed", repairs: [] };
  const repairs = input.defects.map((defect) => {
    const repairRoute = routeForCategory(defect.category);
    return {
      repairId: `preview_repair_${defect.issueId}`,
      issueIds: [defect.issueId],
      repairRoute,
      targetStage: targetStage(repairRoute),
      targetSceneIds: defect.sceneIds,
      selectedAssetIds: input.selectedAssetIds,
      preserveEvidenceIds: defect.evidenceIds,
      preserveVisibleCopyAttemptId: input.visibleCopyAttemptId,
      preserveScriptAttemptId: input.scriptAttemptId,
      forbiddenChanges: [
        "modify_article_script_plan_facts",
        "modify_evidence_map",
        "modify_layout_motion_transition_contracts",
        "modify_scene_renderer",
        "introduce_demo_copy_or_fallback",
      ],
      requiredOutcome: defect.recommendedAction,
      maxAttempts: repairRoute === "rerender_output" ? 1 : 2,
    };
  });
  return {
    status: repairs.some((repair) => repair.repairRoute === "manual_review") ? "blocked_manual_review" : "planned",
    repairs,
  };
}

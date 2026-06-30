import crypto from "crypto";
import type { RuntimeVisualIntent } from "../factory/runtimeShotCatalog";
import { macShotCanonicalContractVersion, type CanonicalMacShotSelectionContract, type MacShotContractGap, type MacShotTextCapacity } from "./macShotPackageContract";

type NormalizeInput = {
  shotId: string;
  rawContract: unknown;
  libraryEntryHash?: string;
};

export type MacShotContractNormalizationResult =
  | { ok: true; contract: CanonicalMacShotSelectionContract; selectionContractHash: string; gaps: MacShotContractGap[] }
  | { ok: false; gaps: MacShotContractGap[]; missingFields: string[] };

const runtimeIntents: RuntimeVisualIntent[] = ["hook", "reason", "recommendation", "step_flow", "checklist", "price_comparison", "result_metric", "evidence", "brief_summary", "cta", "safe_end"];
const runtimeIntentSet = new Set<string>(runtimeIntents);

const intentAliases: Record<string, RuntimeVisualIntent[]> = {
  introduce_product_hero: ["hook", "brief_summary"],
  show_primary_interface: ["hook", "evidence"],
  demonstrate_prompt_or_search_flow: ["reason", "step_flow"],
  show_user_input_to_result: ["reason", "evidence"],
  compare_results: ["price_comparison", "result_metric"],
  highlight_metric_or_outcome: ["result_metric", "evidence"],
  close_with_brand_or_call_to_action: ["cta", "safe_end"],
  establish_brand_or_product_hook: ["hook", "brief_summary"],
  explain_workflow_steps: ["step_flow", "reason"],
  highlight_product_feature: ["reason", "evidence"],
  open_video: ["hook"],
  reveal_recommendation_or_suggestion: ["recommendation"],
  show_ai_assistance: ["recommendation", "reason"],
  show_focused_interaction: ["reason", "step_flow"],
  show_multi_panel_product_state: ["reason", "brief_summary"],
  show_process_progression: ["step_flow"],
  summarize_capabilities: ["brief_summary", "reason"],
  show_metric_insight: ["result_metric", "evidence"],
  explain_price_or_value_signal: ["price_comparison", "result_metric"],
  guide_step_flow: ["step_flow"],
  explain_workflow: ["reason", "step_flow"],
  recommend_ai_action: ["recommendation"],
  show_ai_recommendation: ["recommendation"],
  final_cta: ["cta"],
};

const sceneRoleIntentAliases: Record<string, RuntimeVisualIntent[]> = {
  websiteHero: ["hook", "brief_summary"],
  searchDemo: ["reason", "step_flow"],
  stepFlow: ["step_flow", "checklist"],
  priceInsight: ["price_comparison", "result_metric"],
  resultComparison: ["price_comparison", "result_metric"],
  coverHook: ["hook"],
  featureHighlight: ["reason", "evidence"],
  aiRecommendation: ["recommendation"],
  recommendationPanel: ["recommendation"],
  finalCTA: ["cta"],
  appGrid: ["reason", "brief_summary"],
  product_demo: ["recommendation"],
  workflow: ["step_flow", "reason"],
};

const evidenceAliases: Record<string, string> = {
  price: "currency",
  metric: "count",
  chart: "percentage",
  timeline: "date",
  website_screenshot: "text",
  product_surface: "text",
  headline: "text",
  prompt: "text",
  search_query: "text",
  input_text: "text",
  result_preview: "text",
  claim: "text",
  fact: "fact",
  step: "step",
  steps: "step",
  metrics: "count",
  before_after: "percentage",
  comparison_table: "currency",
  app_screens: "text",
  assistant_response: "text",
  brand: "text",
  cta_text: "text",
  dashboard_panels: "text",
  feature_label: "text",
  feature_list: "text",
  product_name: "text",
  recommendation_copy: "text",
  selected_text: "text",
  supporting_copy: "text",
  ui_state: "text",
  url: "text",
  workflow_nodes: "step",
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(asString).filter((item): item is string => Boolean(item));
  const single = asString(value);
  return single ? [single] : undefined;
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function gap(input: Omit<MacShotContractGap, "affectedShotIds"> & { shotId: string }): MacShotContractGap {
  return { ...input, affectedShotIds: [input.shotId] };
}

function normalizeIntentValue(value: string): RuntimeVisualIntent[] {
  if (runtimeIntentSet.has(value)) return [value as RuntimeVisualIntent];
  return intentAliases[value] ?? [];
}

function normalizeIntents(rawIntents: string[] | undefined, sceneRoles: string[] | undefined) {
  const fromIntents = (rawIntents ?? []).flatMap(normalizeIntentValue);
  const fromRoles = (sceneRoles ?? []).flatMap((role) => sceneRoleIntentAliases[role] ?? []);
  return unique([...fromIntents, ...fromRoles]);
}

function normalizeExcludedIntents(values: string[] | undefined) {
  return unique((values ?? []).flatMap(normalizeIntentValue));
}

function normalizeEvidenceTypes(values: string[] | undefined) {
  return unique((values ?? []).map((value) => evidenceAliases[value] ?? value));
}

function textLevel(chars: number | undefined, lines?: number): MacShotTextCapacity["headline"] {
  if (!chars || chars <= 0) return "medium";
  const effective = lines && lines > 1 ? chars * Math.min(lines, 3) : chars;
  if (effective >= 120) return "high";
  if (effective >= 42) return "medium";
  return "low";
}

function normalizeTextCapacity(value: unknown): MacShotTextCapacity | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  if (["low", "medium", "high"].includes(String(record.headline)) && ["low", "medium", "high"].includes(String(record.supportingText)) && ["low", "medium", "high"].includes(String(record.structuredItems))) {
    return record as MacShotTextCapacity;
  }
  const headlineMaxChars = typeof record.headlineMaxChars === "number" ? record.headlineMaxChars : undefined;
  const supportingLines = typeof record.supportingLines === "number" ? record.supportingLines : undefined;
  const bodyMaxChars = typeof record.bodyMaxChars === "number" ? record.bodyMaxChars : undefined;
  const labelMaxChars = typeof record.labelMaxChars === "number" ? record.labelMaxChars : undefined;
  if ([headlineMaxChars, supportingLines, bodyMaxChars, labelMaxChars].every((item) => item === undefined)) return undefined;
  return {
    headline: textLevel(headlineMaxChars),
    supportingText: textLevel(bodyMaxChars, supportingLines),
    structuredItems: textLevel(labelMaxChars, supportingLines),
  };
}

function normalizeDuration(value: unknown) {
  if (Array.isArray(value) && value.every((item) => typeof item === "number") && value.length >= 1) {
    const min = value[0];
    const max = value[value.length - 1] ?? min;
    const preferred = value[Math.floor(value.length / 2)] ?? min;
    return { minFrames: min, preferredFrames: preferred, maxFrames: max };
  }
  const record = asRecord(value);
  if (record && typeof record.minFrames === "number" && typeof record.preferredFrames === "number" && typeof record.maxFrames === "number") {
    return { minFrames: record.minFrames, preferredFrames: record.preferredFrames, maxFrames: record.maxFrames };
  }
  return undefined;
}

function normalizeDuplicateUsePolicy(value: unknown): CanonicalMacShotSelectionContract["duplicateUsePolicy"] | undefined {
  if (value === "avoid_repeat" || value === "allow_repeat") return value;
  if (value === "avoid_same_choreography_within_one_video") return "avoid_repeat";
  return undefined;
}

export function hashMacShotSelectionContract(value: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function normalizeMacShotSelectionContract(input: NormalizeInput): MacShotContractNormalizationResult {
  const raw = asRecord(input.rawContract);
  const gaps: MacShotContractGap[] = [];
  const missingFields: string[] = [];
  if (!raw) {
    return { ok: false, gaps: [gap({ shotId: input.shotId, contractFieldExpected: "selection-contract", actualFieldPath: "selection-contract.json", fieldTypeDifference: "non-object", safeAliasPossible: false, normalizationAllowed: false, trueDataMissing: true })], missingFields: ["selection-contract"] };
  }

  const shotId = asString(raw.shotId) ?? input.shotId;
  const sceneRoles = asStringArray(raw.sceneRoles);
  const rawIntents = asStringArray(raw.intents);
  const intents = normalizeIntents(rawIntents, sceneRoles);
  if (rawIntents?.some((intent) => !runtimeIntentSet.has(intent)) || sceneRoles?.some((role) => sceneRoleIntentAliases[role])) {
    gaps.push(gap({ shotId, contractFieldExpected: "intents: RuntimeVisualIntent[]", actualFieldPath: "intents / sceneRoles", fieldTypeDifference: "Mac domain intent aliases", safeAliasPossible: true, normalizationAllowed: true, trueDataMissing: false }));
  }
  const durationRangeFrames = normalizeDuration(raw.durationRangeFrames);
  if (Array.isArray(raw.durationRangeFrames)) gaps.push(gap({ shotId, contractFieldExpected: "durationRangeFrames object", actualFieldPath: "durationRangeFrames[]", fieldTypeDifference: "array tuple", safeAliasPossible: true, normalizationAllowed: true, trueDataMissing: false }));
  const textCapacityContract = normalizeTextCapacity(raw.textCapacityContract);
  if (textCapacityContract && asRecord(raw.textCapacityContract) && !("headline" in asRecord(raw.textCapacityContract)!)) gaps.push(gap({ shotId, contractFieldExpected: "textCapacityContract levels", actualFieldPath: "textCapacityContract numeric limits", fieldTypeDifference: "numeric capacity object", safeAliasPossible: true, normalizationAllowed: true, trueDataMissing: false }));
  const duplicateUsePolicy = normalizeDuplicateUsePolicy(raw.duplicateUsePolicy);
  if (raw.duplicateUsePolicy === "avoid_same_choreography_within_one_video") gaps.push(gap({ shotId, contractFieldExpected: "duplicateUsePolicy avoid_repeat", actualFieldPath: "duplicateUsePolicy", fieldTypeDifference: "Mac duplicate policy alias", safeAliasPossible: true, normalizationAllowed: true, trueDataMissing: false }));
  const sourceLibraryEntryHash = input.libraryEntryHash ?? asString(raw.sourceLibraryEntryHash) ?? asString(raw.sourceCatalogEntryHash);
  if (raw.sourceCatalogEntryHash && !raw.sourceLibraryEntryHash) gaps.push(gap({ shotId, contractFieldExpected: "sourceLibraryEntryHash", actualFieldPath: "sourceCatalogEntryHash", fieldTypeDifference: "field alias", safeAliasPossible: true, normalizationAllowed: true, trueDataMissing: false }));
  const sourceEnvironment = raw.sourceEnvironment === "mac_source" ? "mac_source" : raw.sourceEnvironment ? "mac_source" : undefined;
  if (raw.sourceEnvironment && raw.sourceEnvironment !== "mac_source") gaps.push(gap({ shotId, contractFieldExpected: "sourceEnvironment=mac_source", actualFieldPath: "sourceEnvironment", fieldTypeDifference: "Mac source label", safeAliasPossible: true, normalizationAllowed: true, trueDataMissing: false }));

  const required: Record<string, unknown> = {
    shotId,
    displayName: asString(raw.displayName),
    sourceEnvironment,
    intents,
    semanticTags: asStringArray(raw.semanticTags),
    sceneRoles,
    supportedEvidenceTypes: normalizeEvidenceTypes(asStringArray(raw.supportedEvidenceTypes)),
    excludedIntents: normalizeExcludedIntents(asStringArray(raw.excludedIntents)),
    durationRangeFrames,
    aspectRatio: raw.aspectRatio,
    textCapacityContract,
    selectionPriority: raw.selectionPriority,
    duplicateUsePolicy,
    runtimeEntry: asString(raw.runtimeEntry),
    runtimeExport: asString(raw.runtimeExport),
    choreographyEntry: asString(raw.choreographyEntry),
    choreographyExport: asString(raw.choreographyExport),
    requiredAssets: Array.isArray(raw.requiredAssets) ? raw.requiredAssets : undefined,
    visualEnergy: raw.visualEnergy === "low" || raw.visualEnergy === "medium" || raw.visualEnergy === "high" ? raw.visualEnergy : "medium",
    selectionAllowed: raw.selectionAllowed,
    sourceLibraryEntryHash,
  };

  for (const [key, value] of Object.entries(required)) {
    const missing = value === undefined || value === "" || (Array.isArray(value) && key !== "requiredAssets" && key !== "excludedIntents" && value.length === 0);
    if (missing) {
      missingFields.push(key);
      gaps.push(gap({ shotId, contractFieldExpected: key, actualFieldPath: key, fieldTypeDifference: "missing or empty", safeAliasPossible: false, normalizationAllowed: false, trueDataMissing: true }));
    }
  }

  if (missingFields.length) return { ok: false, gaps, missingFields };

  const canonical: CanonicalMacShotSelectionContract = {
    schemaVersion: macShotCanonicalContractVersion,
    shotId,
    displayName: required.displayName as string,
    sourceEnvironment: "mac_source",
    intents: required.intents as RuntimeVisualIntent[],
    semanticTags: required.semanticTags as string[],
    sceneRoles: required.sceneRoles as string[],
    supportedEvidenceTypes: required.supportedEvidenceTypes as string[],
    excludedIntents: required.excludedIntents as RuntimeVisualIntent[],
    durationRangeFrames: required.durationRangeFrames as CanonicalMacShotSelectionContract["durationRangeFrames"],
    aspectRatio: required.aspectRatio as CanonicalMacShotSelectionContract["aspectRatio"],
    textCapacityContract: required.textCapacityContract as MacShotTextCapacity,
    selectionPriority: required.selectionPriority as number,
    duplicateUsePolicy: required.duplicateUsePolicy as CanonicalMacShotSelectionContract["duplicateUsePolicy"],
    runtimeEntry: required.runtimeEntry as string,
    runtimeExport: required.runtimeExport as string,
    choreographyEntry: required.choreographyEntry as string,
    choreographyExport: required.choreographyExport as string,
    requiredAssets: required.requiredAssets as string[],
    visualEnergy: required.visualEnergy as CanonicalMacShotSelectionContract["visualEnergy"],
    selectionAllowed: required.selectionAllowed as boolean,
    sourceLibraryEntryHash: required.sourceLibraryEntryHash as string,
  };
  return { ok: true, contract: canonical, selectionContractHash: hashMacShotSelectionContract(canonical), gaps };
}

export function mergeContractGaps(gaps: MacShotContractGap[]) {
  const byKey = new Map<string, MacShotContractGap>();
  for (const item of gaps) {
    const key = [item.contractFieldExpected, item.actualFieldPath, item.fieldTypeDifference, item.safeAliasPossible, item.normalizationAllowed, item.trueDataMissing].join("|");
    const existing = byKey.get(key);
    if (existing) existing.affectedShotIds = [...new Set([...existing.affectedShotIds, ...item.affectedShotIds])].sort();
    else byKey.set(key, { ...item, affectedShotIds: [...item.affectedShotIds] });
  }
  return [...byKey.values()].sort((a, b) => a.contractFieldExpected.localeCompare(b.contractFieldExpected));
}

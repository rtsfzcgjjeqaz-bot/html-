import { getShot, listRegisteredShots } from "../../assets/index/asset-resolver";
import { getChoreographyEntry } from "../motion/choreographyRegistry";

export type RuntimeShotId =
  | "shot_01"
  | "shot_03"
  | "shot_15"
  | "shot_25"
  | "shot_27"
  | "shot_30"
  | "shot_35"
  | "shot_36"
  | "shot_50"
  | "shot_51";

export type RuntimeRenderMode = "atomic_tracks" | "component_choreography";

export type RuntimeVisualIntent =
  | "hook"
  | "reason"
  | "recommendation"
  | "step_flow"
  | "checklist"
  | "price_comparison"
  | "result_metric"
  | "evidence"
  | "brief_summary"
  | "cta"
  | "safe_end";

export type RuntimeShotCatalogEntry = {
  runtimeShotId: RuntimeShotId;
  choreographyId: string;
  sceneType: string;
  visualType: string;
  runtimeStatus: "runtime_callable";
  renderMode: RuntimeRenderMode;
  supportedVisualIntents: RuntimeVisualIntent[];
  allowedAspectRatios: Array<"16:9">;
  recommendedDurationRange: {
    minFrames: number;
    preferredFrames: number;
    maxFrames: number;
  };
  textCapacity: {
    headline: "low" | "medium" | "high";
    supportingText: "low" | "medium" | "high";
    structuredItems: "low" | "medium" | "high";
    notes: string[];
  };
  evidenceRequirements: {
    requiresTraceableEvidence: boolean;
    allowedValueTypes?: Array<"currency" | "percentage" | "count" | "duration" | "date" | "text" | "none">;
    minimumEvidenceCount?: number;
    notes: string[];
  };
  componentPropsContract: {
    required: string[];
    optional: string[];
  };
  transitionProfile?: {
    profileId: string;
    entryAnchors: string[];
    exitAnchors: string[];
    supportedTransitionPairs: string[];
    supportsContinuousBackground: boolean;
    supportsOverlap: boolean;
    minimumReadableFrames: number;
  };
  approvedInFactory: boolean;
  selectionPriority: number;
  notes: string[];
};

export type RuntimeCatalogAuditEntry = {
  runtimeShotId: RuntimeShotId;
  registeredInShotRegistry: boolean;
  resolvesViaAssetResolver: boolean;
  hasRegisteredChoreography: boolean;
  sceneRendererRenderable: boolean;
  motionRuntimeSupported: boolean;
  runtimeCallable: boolean;
};

const runtimeShotCatalog: RuntimeShotCatalogEntry[] = [
  {
    runtimeShotId: "shot_35",
    choreographyId: "websiteHeroAngledProductSurface",
    sceneType: "websiteHero",
    visualType: "websiteHeroAngledProductSurface",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["hook", "brief_summary"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 110, preferredFrames: 132, maxFrames: 150 },
    textCapacity: {
      headline: "medium",
      supportingText: "medium",
      structuredItems: "medium",
      notes: [
        "Chinese headline capacity: 2 lines x 18 characters with overflow blocked.",
        "Supporting rows must be article-derived and cannot use demo fallback text.",
      ],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: false,
      notes: ["May carry a source-backed hook/evidence card when evidence exists, but does not require a numeric claim."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "recommendationItems", "stepItems", "selectedEvidence"],
    },
    transitionProfile: {
      profileId: "mac_source_hero_surface_v1",
      entryAnchors: ["hero_surface", "headline"],
      exitAnchors: ["evidence_card", "support_panel"],
      supportedTransitionPairs: ["hook->reason", "hook->step_flow", "brief_summary->recommendation"],
      supportsContinuousBackground: true,
      supportsOverlap: true,
      minimumReadableFrames: 42,
    },
    approvedInFactory: true,
    selectionPriority: 88,
    notes: [
      "Onboarded from Mac source shot_35 through Windows Runtime Package Validation.",
      "Source environment is trace metadata only and does not affect selection eligibility.",
    ],
  },
  {
    runtimeShotId: "shot_01",
    choreographyId: "coverHookImpact",
    sceneType: "coverHook",
    visualType: "coverHook",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["hook"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 100, preferredFrames: 126, maxFrames: 145 },
    textCapacity: {
      headline: "medium",
      supportingText: "low",
      structuredItems: "low",
      notes: ["Best for one high-priority claim.", "Supporting copy must stay short."],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: false,
      notes: ["Can open with title-level claim before structured evidence enters later scenes."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "shortLabel"],
    },
    transitionProfile: {
      profileId: "article_hook_anchor_v1",
      entryAnchors: ["hook_text"],
      exitAnchors: ["evidence_card", "hook_text"],
      supportedTransitionPairs: ["hook->step_flow"],
      supportsContinuousBackground: true,
      supportsOverlap: true,
      minimumReadableFrames: 36,
    },
    approvedInFactory: true,
    selectionPriority: 100,
    notes: ["Primary article hook shot.", "Should not be reused as a generic metric or comparison scene."],
  },
  {
    runtimeShotId: "shot_03",
    choreographyId: "stepFlowRail",
    sceneType: "stepFlow",
    visualType: "stepFlowRail",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["step_flow", "checklist"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 120, preferredFrames: 144, maxFrames: 170 },
    textCapacity: {
      headline: "medium",
      supportingText: "low",
      structuredItems: "medium",
      notes: ["Supports 3-4 short steps.", "Best when each step is concise and ordered."],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: false,
      notes: ["May be used for ordered steps without numeric evidence.", "Not appropriate for price/result claims."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "stepItems", "selectedEvidence"],
    },
    transitionProfile: {
      profileId: "article_step_flow_anchor_v1",
      entryAnchors: ["rail", "first_step_card"],
      exitAnchors: ["rail", "active_step_card"],
      supportedTransitionPairs: ["hook->step_flow", "step_flow->recommendation"],
      supportsContinuousBackground: true,
      supportsOverlap: true,
      minimumReadableFrames: 36,
    },
    approvedInFactory: true,
    selectionPriority: 95,
    notes: ["Preferred article step-flow shot.", "Checklist use is allowed only when items remain short and ordered."],
  },
  {
    runtimeShotId: "shot_15",
    choreographyId: "dashboardGridOrbit",
    sceneType: "appGrid",
    visualType: "dashboardGrid",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["reason", "brief_summary"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 120, preferredFrames: 120, maxFrames: 170 },
    textCapacity: {
      headline: "low",
      supportingText: "low",
      structuredItems: "low",
      notes: ["Grid cells cannot safely carry dense Chinese step labels.", "Use only for conservative structured info layouts."],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: false,
      notes: ["Do not use as default for step_flow, checklist, price_comparison, or result_metric."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "stepItems", "selectedEvidence"],
    },
    approvedInFactory: true,
    selectionPriority: 20,
    notes: ["Conservative fallback for structured dashboard content only.", "Explicitly excluded from step_flow/checklist/result defaults."],
  },
  {
    runtimeShotId: "shot_25",
    choreographyId: "searchTypingThenRows",
    sceneType: "searchDemo",
    visualType: "searchRows",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["reason", "evidence", "brief_summary"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 120, preferredFrames: 120, maxFrames: 160 },
    textCapacity: {
      headline: "medium",
      supportingText: "medium",
      structuredItems: "medium",
      notes: ["Works with one short query and 3-4 evidence rows.", "Long prose must be compacted before selection."],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: false,
      minimumEvidenceCount: 1,
      notes: ["Best for explainable rows or traceable bullets.", "Can host reason/evidence scenes without numeric comparison semantics."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "recommendationItems", "selectedEvidence"],
    },
    approvedInFactory: true,
    selectionPriority: 85,
    notes: ["Preferred reason shot before any dashboard fallback.", "May carry evidence rows when comparison-specific shots are not required."],
  },
  {
    runtimeShotId: "shot_36",
    choreographyId: "emailDraftGenerationDemo",
    sceneType: "emailDraftDemo",
    visualType: "emailDraftGenerationDemo",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["reason", "evidence", "recommendation"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 120, preferredFrames: 144, maxFrames: 170 },
    textCapacity: {
      headline: "medium",
      supportingText: "medium",
      structuredItems: "medium",
      notes: [
        "Chinese prompt/headline capacity: 2 lines x 16 characters with overflow blocked.",
        "Rows support up to 3 article-derived items, 2 lines each, no ellipsis fallback.",
      ],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: false,
      minimumEvidenceCount: 1,
      notes: ["Reason/evidence rows may use traceable evidence, but generic demo copy is forbidden in strict article binding."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "recommendationItems", "stepItems", "selectedEvidence"],
    },
    transitionProfile: {
      profileId: "mac_source_email_demo_v1",
      entryAnchors: ["prompt_panel", "headline"],
      exitAnchors: ["result_rows", "support_panel"],
      supportedTransitionPairs: ["hook->reason", "reason->step_flow", "reason->recommendation", "evidence->recommendation"],
      supportsContinuousBackground: true,
      supportsOverlap: true,
      minimumReadableFrames: 42,
    },
    approvedInFactory: true,
    selectionPriority: 82,
    notes: [
      "Onboarded from Mac source shot_36 through Windows Runtime Package Validation.",
      "Source environment is trace metadata only and does not affect selection eligibility.",
    ],
  },
  {
    runtimeShotId: "shot_27",
    choreographyId: "splitCompareCards",
    sceneType: "resultComparison",
    visualType: "splitCompareCards",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["price_comparison", "evidence"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 120, preferredFrames: 120, maxFrames: 170 },
    textCapacity: {
      headline: "medium",
      supportingText: "low",
      structuredItems: "medium",
      notes: ["Supports two contrasted panels plus one winner proof.", "Best when before/after labels are short."],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: true,
      allowedValueTypes: ["currency", "percentage", "text"],
      minimumEvidenceCount: 1,
      notes: ["Requires traceable comparison evidence.", "Should not be selected without an explicit comparison claim."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "selectedEvidence"],
    },
    approvedInFactory: true,
    selectionPriority: 95,
    notes: ["Preferred price comparison shot.", "May also carry evidence when comparative framing is appropriate."],
  },
  {
    runtimeShotId: "shot_30",
    choreographyId: "finalCtaCardsConverge",
    sceneType: "finalCTA",
    visualType: "finalCTA",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["cta"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 110, preferredFrames: 132, maxFrames: 150 },
    textCapacity: {
      headline: "medium",
      supportingText: "low",
      structuredItems: "medium",
      notes: ["CTA copy must remain short and source-backed.", "Not safe for neutral safe_end output."],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: false,
      notes: ["CTA intent only when article provides a traceable CTA.", "Do not synthesize CTA copy."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["ctaText", "recommendationItems"],
    },
    approvedInFactory: true,
    selectionPriority: 90,
    notes: ["Formal CTA shot only.", "Excluded from safe_end to avoid fake CTA behavior."],
  },
  {
    runtimeShotId: "shot_50",
    choreographyId: "priceInsightSnap",
    sceneType: "priceInsight",
    visualType: "priceInsight",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["result_metric", "evidence"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 110, preferredFrames: 132, maxFrames: 150 },
    textCapacity: {
      headline: "medium",
      supportingText: "low",
      structuredItems: "medium",
      notes: ["Supports one primary metric plus a compact evidence panel.", "Metric copy must be concise and traceable."],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: true,
      allowedValueTypes: ["currency", "percentage", "count", "duration", "date"],
      minimumEvidenceCount: 1,
      notes: ["Result metric intent only with video-eligible traceable metric evidence."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "selectedEvidence"],
    },
    approvedInFactory: true,
    selectionPriority: 95,
    notes: ["Preferred result metric shot.", "May host evidence when the evidence is itself metric-shaped."],
  },
  {
    runtimeShotId: "shot_51",
    choreographyId: "aiRecommendationCursorPanelReveal",
    sceneType: "aiRecommendation",
    visualType: "recommendationPanel",
    runtimeStatus: "runtime_callable",
    renderMode: "component_choreography",
    supportedVisualIntents: ["recommendation"],
    allowedAspectRatios: ["16:9"],
    recommendedDurationRange: { minFrames: 132, preferredFrames: 140, maxFrames: 150 },
    textCapacity: {
      headline: "medium",
      supportingText: "medium",
      structuredItems: "medium",
      notes: ["Supports one recommendation title and up to three short rows.", "Not neutral enough for safe_end."],
    },
    evidenceRequirements: {
      requiresTraceableEvidence: false,
      notes: ["Recommendation rows may reference evidence, but recommendation intent itself does not require numeric proof."],
    },
    componentPropsContract: {
      required: ["headline"],
      optional: ["supportingText", "recommendationTitle", "recommendationItems", "selectedEvidence"],
    },
    transitionProfile: {
      profileId: "article_recommendation_anchor_v1",
      entryAnchors: ["recommendation_panel", "panel_header"],
      exitAnchors: ["recommendation_panel"],
      supportedTransitionPairs: ["step_flow->recommendation"],
      supportsContinuousBackground: true,
      supportsOverlap: true,
      minimumReadableFrames: 36,
    },
    approvedInFactory: true,
    selectionPriority: 100,
    notes: ["Primary recommendation shot.", "Do not silently reuse for safe_end or CTA."],
  },
];

const sceneRendererSupportedChoreographies = new Set([
  "websiteHeroAngledProductSurface",
  "emailDraftGenerationDemo",
  "coverHookImpact",
  "stepFlowRail",
  "dashboardGridOrbit",
  "searchTypingThenRows",
  "splitCompareCards",
  "finalCtaCardsConverge",
  "priceInsightSnap",
  "aiRecommendationCursorPanelReveal",
]);

const motionRuntimeSupportedChoreographies = new Set(sceneRendererSupportedChoreographies);

export function listRuntimeShotCatalog(): RuntimeShotCatalogEntry[] {
  return runtimeShotCatalog.map((entry) => ({ ...entry }));
}

export function getRuntimeShotCatalogEntry(runtimeShotId: RuntimeShotId) {
  return runtimeShotCatalog.find((entry) => entry.runtimeShotId === runtimeShotId);
}

export function getRuntimeShotsForIntent(intent: RuntimeVisualIntent) {
  return runtimeShotCatalog
    .filter((entry) => entry.supportedVisualIntents.includes(intent))
    .sort((a, b) => b.selectionPriority - a.selectionPriority);
}

export function auditRuntimeShotCatalog(): RuntimeCatalogAuditEntry[] {
  const registeredShots = new Set(listRegisteredShots());
  return runtimeShotCatalog.map((entry) => {
    const registeredInShotRegistry = registeredShots.has(entry.runtimeShotId);
    const shot = registeredInShotRegistry ? getShot(entry.runtimeShotId) : undefined;
    const resolvesViaAssetResolver = Boolean(shot);
    const choreographyEntry = getChoreographyEntry(entry.choreographyId);
    const hasRegisteredChoreography =
      Boolean(choreographyEntry) &&
      choreographyEntry?.approved === true &&
      choreographyEntry?.allowedInFactory === true;
    const sceneRendererRenderable = sceneRendererSupportedChoreographies.has(entry.choreographyId);
    const motionRuntimeSupported = motionRuntimeSupportedChoreographies.has(entry.choreographyId);
    return {
      runtimeShotId: entry.runtimeShotId,
      registeredInShotRegistry,
      resolvesViaAssetResolver,
      hasRegisteredChoreography,
      sceneRendererRenderable,
      motionRuntimeSupported,
      runtimeCallable:
        registeredInShotRegistry &&
        resolvesViaAssetResolver &&
        hasRegisteredChoreography &&
        sceneRendererRenderable &&
        motionRuntimeSupported,
    };
  });
}

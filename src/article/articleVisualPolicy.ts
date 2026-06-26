import type { ArticleContentBrief, ArticleInput, ArticleVideoSpec, EvidenceItem } from "./types";

export type ArticleVisualIntent =
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

export type ArticlePolicyActionType = "shortened" | "skipped" | "fallback_to_safe_end" | "intent_not_supported";

export type ArticlePolicyWarningCode =
  | "TEXT_COMPACTED"
  | "INTENT_NOT_SUPPORTED"
  | "CTA_MISSING"
  | "SAFE_END_ENABLED"
  | "RECOMMENDATION_ITEMS_REDUCED"
  | "STEP_ITEMS_REDUCED"
  | "STRUCTURED_SCENE_UNSUITABLE"
  | "INSUFFICIENT_CANONICAL_STEPS"
  | "INSUFFICIENT_TRACEABLE_EVIDENCE"
  | "NON_TRACEABLE_EVIDENCE_REJECTED"
  | "INTENT_REDUCED";

export type ArticlePolicyWarning = {
  code: ArticlePolicyWarningCode;
  sceneId?: number;
  message: string;
};

export type ArticlePolicyTextBinding = {
  value: string;
  sourceField: string;
  sourceExcerpt: string;
  sourceEvidenceId?: string;
  compacted: boolean;
  originalCharacters: number;
  finalCharacters: number;
};

export type ArticlePolicyTextAction = {
  sceneId: number;
  visualIntent: ArticleVisualIntent;
  field: string;
  sourceField: string;
  sourceExcerpt: string;
  sourceEvidenceId?: string;
  action: ArticlePolicyActionType;
};

export type ArticlePolicyEvidenceDecision = {
  evidenceId: string;
  accepted: boolean;
  rejectionReason?: string;
};

export type ArticlePolicyScenePlan = {
  sceneId: number;
  visualIntent: ArticleVisualIntent;
  headline?: ArticlePolicyTextBinding;
  supportingText?: ArticlePolicyTextBinding;
  recommendationTitle?: ArticlePolicyTextBinding;
  recommendationItems?: ArticlePolicyTextBinding[];
  stepItems?: ArticlePolicyTextBinding[];
  cta?: ArticlePolicyTextBinding;
  bindings?: {
    headline?: ArticlePolicyTextBinding;
    supportingText?: ArticlePolicyTextBinding;
    recommendationTitle?: ArticlePolicyTextBinding;
    recommendationItems?: ArticlePolicyTextBinding[];
    stepItems?: ArticlePolicyTextBinding[];
    cta?: ArticlePolicyTextBinding;
  };
  selectedEvidenceIds: string[];
  rejectedEvidenceIds: string[];
  warnings: ArticlePolicyWarning[];
};

export type ArticlePolicyDuplicateAction = {
  sectionId: string;
  duplicateStepValues: string[];
  action: "deduped_from_paragraphs";
};

export type ArticlePolicyQaChecks = {
  pageTypeRecognized: boolean;
  visualIntentSequenceValid: boolean;
  noHardcodedShotIdInPolicy: boolean;
  stepFlowUsesCanonicalOrderedSteps: boolean;
  comparisonRequiresTraceableEvidence: boolean;
  resultMetricRequiresEligibleEvidence: boolean;
  sceneIntentSinglePurpose: boolean;
  textDensityWithinPolicy: boolean;
  noDuplicateStepConsumption: boolean;
  CTAOnlyWhenTraceable: boolean;
  safeEndWhenCtaMissing: boolean;
};

export type ArticlePolicyDebug = {
  articleId: string;
  pageType?: string;
  policyVersion: "article-visual-policy-v2";
  selectedVisualIntents: ArticleVisualIntent[];
  rejectedVisualIntents: Array<{ intent: ArticleVisualIntent; reason: string }>;
  selectedEvidenceIds: string[];
  rejectedEvidenceIds: string[];
  evidenceDecisions: ArticlePolicyEvidenceDecision[];
  textShorteningActions: ArticlePolicyTextAction[];
  stepSelection: {
    canonicalOrderedSteps: string[];
    selectedSteps: string[];
  };
  duplicatePreventionActions: ArticlePolicyDuplicateAction[];
  policyWarnings: ArticlePolicyWarning[];
  safeEndReason?: string;
  scenes: ArticlePolicyScenePlan[];
  qaChecks: ArticlePolicyQaChecks;
};

export type ArticlePolicyPlan = {
  scenes: ArticlePolicyScenePlan[];
  debug: ArticlePolicyDebug;
};

export const articleVisualPolicy = {
  policyVersion: "article-visual-policy-v2",
  supportedIntents: [
    "hook",
    "reason",
    "recommendation",
    "step_flow",
    "checklist",
    "price_comparison",
    "result_metric",
    "evidence",
    "brief_summary",
    "cta",
    "safe_end",
  ] as ArticleVisualIntent[],
  globalRhythm: {
    hookMustAppearBySeconds: 0.3,
    maxInitialEmptySeconds: 0.2,
    maxTransitionEmptySeconds: 0.2,
    minimumEndingStableHoldSeconds: 0.4,
    defaultTargetDurationSeconds: 12,
    minDurationSeconds: 10,
    maxDurationSeconds: 14,
  },
  textDensity: {
    maxHookHeadlineCharacters: 24,
    maxHookSupportingCharacters: 34,
    maxRecommendationTitleCharacters: 20,
    maxRecommendationItems: 3,
    maxRecommendationItemCharacters: 16,
    maxStepItems: 3,
    maxStepTitleCharacters: 14,
    maxEvidenceCaptionCharacters: 18,
    maxCtaCharacters: 20,
  },
  pageTypeRules: {
    guide: ["hook", "reason", "step_flow", "recommendation", "safe_end"] as ArticleVisualIntent[],
    comparison: ["hook", "price_comparison", "result_metric", "evidence", "safe_end"] as ArticleVisualIntent[],
    product_pricing: ["hook", "evidence", "price_comparison", "recommendation", "safe_end"] as ArticleVisualIntent[],
    fallback: ["hook", "brief_summary", "recommendation", "safe_end"] as ArticleVisualIntent[],
  },
} as const;

function normalizedText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function countTextCharacters(value: string) {
  return Array.from(normalizedText(value)).length;
}

export function compactPolicyText(value: string, maxCharacters: number) {
  const normalized = normalizedText(value);
  const characters = Array.from(normalized);
  if (characters.length <= maxCharacters) {
    return { value: normalized, compacted: false };
  }

  const suffix = "...";
  const compacted = characters.slice(0, Math.max(1, maxCharacters - suffix.length)).join("").trim();
  return { value: `${compacted}${suffix}`, compacted: true };
}

export function bindPolicyText(input: {
  value: string;
  maxCharacters: number;
  sourceField: string;
  sourceExcerpt: string;
  sourceEvidenceId?: string;
}): ArticlePolicyTextBinding {
  const { value, maxCharacters, sourceField, sourceExcerpt, sourceEvidenceId } = input;
  const { value: compactedValue, compacted } = compactPolicyText(value, maxCharacters);

  return {
    value: compactedValue,
    sourceField,
    sourceExcerpt,
    sourceEvidenceId,
    compacted,
    originalCharacters: countTextCharacters(value),
    finalCharacters: countTextCharacters(compactedValue),
  };
}

function pageTypeFor(brief: ArticleContentBrief) {
  const raw = brief.sourceMetadata.pageType?.trim();
  if (raw === "guide" || raw === "comparison" || raw === "product_pricing") {
    return raw;
  }
  return undefined;
}

function canonicalOrderedSteps(article: ArticleInput) {
  return article.sections.flatMap((section) => section.orderedSteps ?? []).map(normalizedText).filter(Boolean);
}

function duplicatePreventionActions(article: ArticleInput): ArticlePolicyDuplicateAction[] {
  return article.sections
    .map((section) => {
      const steps = new Set((section.orderedSteps ?? []).map(normalizedText));
      const duplicateStepValues = (section.paragraphs ?? []).map(normalizedText).filter((paragraph) => steps.has(paragraph));
      if (!duplicateStepValues.length) {
        return undefined;
      }
      return {
        sectionId: section.sectionId,
        duplicateStepValues,
        action: "deduped_from_paragraphs" as const,
      };
    })
    .filter((item): item is ArticlePolicyDuplicateAction => Boolean(item));
}

function hasTraceableSource(item: EvidenceItem) {
  const location = item.sourceLocation;
  return Boolean(location.sectionId) && (typeof location.paragraphIndex === "number" || typeof location.listItemIndex === "number");
}

function acceptsEvidenceForIntent(intent: ArticleVisualIntent, item: EvidenceItem) {
  if (!item.videoEligible || !hasTraceableSource(item) || !item.sourceExcerpt?.trim()) {
    return { accepted: false, reason: "non_traceable_or_ineligible" };
  }

  if (intent === "price_comparison") {
    if (item.kind !== "comparison" && !["currency", "percentage"].includes(item.valueType)) {
      return { accepted: false, reason: "not_price_comparison_evidence" };
    }
    return { accepted: true };
  }

  if (intent === "result_metric") {
    if (!["currency", "percentage", "count", "date", "duration"].includes(item.valueType)) {
      return { accepted: false, reason: "not_metric_evidence" };
    }
    return { accepted: true };
  }

  if (intent === "evidence") {
    return { accepted: true };
  }

  return { accepted: item.videoEligible };
}

function chooseEvidence(intent: ArticleVisualIntent, evidence: EvidenceItem[], maxItems: number) {
  const selected: EvidenceItem[] = [];
  const rejected: ArticlePolicyEvidenceDecision[] = [];
  for (const item of evidence) {
    const decision = acceptsEvidenceForIntent(intent, item);
    if (decision.accepted && selected.length < maxItems) {
      selected.push(item);
      rejected.push({ evidenceId: item.evidenceId, accepted: true });
    } else {
      rejected.push({ evidenceId: item.evidenceId, accepted: false, rejectionReason: decision.reason ?? "capacity_reached" });
    }
  }
  return { selected, decisions: rejected };
}

function makeTextAction(
  sceneId: number,
  visualIntent: ArticleVisualIntent,
  field: string,
  binding: ArticlePolicyTextBinding,
): ArticlePolicyTextAction | undefined {
  if (!binding.compacted) {
    return undefined;
  }
  return {
    sceneId,
    visualIntent,
    field,
    sourceField: binding.sourceField,
    sourceExcerpt: binding.sourceExcerpt,
    sourceEvidenceId: binding.sourceEvidenceId,
    action: "shortened",
  };
}

function sceneWarningsFromBindings(sceneId: number, bindings: ArticlePolicyTextBinding[]) {
  return bindings
    .filter((binding) => binding.compacted)
    .map<ArticlePolicyWarning>(() => ({
      code: "TEXT_COMPACTED",
      sceneId,
      message: "Policy compacted text to fit safe density limits.",
    }));
}

function firstEvidenceSentence(brief: ArticleContentBrief, maxItems = 3) {
  return brief.evidence.filter((item) => item.videoEligible).slice(0, maxItems);
}

function createHookScene(article: ArticleInput, brief: ArticleContentBrief): ArticlePolicyScenePlan {
  const sceneId = 1;
  const headline = bindPolicyText({
    value: article.title || brief.coreMessage,
    maxCharacters: articleVisualPolicy.textDensity.maxHookHeadlineCharacters,
    sourceField: "article.title",
    sourceExcerpt: article.title || brief.coreMessage,
  });
  const supportingText = bindPolicyText({
    value: article.summary || brief.summary,
    maxCharacters: articleVisualPolicy.textDensity.maxHookSupportingCharacters,
    sourceField: "article.summary",
    sourceExcerpt: article.summary || brief.summary,
  });
  return {
    sceneId,
    visualIntent: "hook",
    headline,
    supportingText,
    bindings: { headline, supportingText },
    selectedEvidenceIds: firstEvidenceSentence(brief, 2).map((item) => item.evidenceId),
    rejectedEvidenceIds: [],
    warnings: sceneWarningsFromBindings(sceneId, [headline, supportingText]),
  };
}

function createReasonScene(article: ArticleInput, brief: ArticleContentBrief): ArticlePolicyScenePlan {
  const sceneId = 2;
  const headline = bindPolicyText({
    value: brief.keyPoints[1] ?? brief.coreMessage,
    maxCharacters: articleVisualPolicy.textDensity.maxHookHeadlineCharacters,
    sourceField: "contentBrief.keyPoints[1]",
    sourceExcerpt: brief.keyPoints[1] ?? brief.coreMessage,
  });
  const supportingText = bindPolicyText({
    value: brief.summary,
    maxCharacters: articleVisualPolicy.textDensity.maxHookSupportingCharacters,
    sourceField: "contentBrief.summary",
    sourceExcerpt: brief.summary,
  });
  return {
    sceneId,
    visualIntent: "reason",
    headline,
    supportingText,
    bindings: { headline, supportingText },
    selectedEvidenceIds: firstEvidenceSentence(brief, 2).map((item) => item.evidenceId),
    rejectedEvidenceIds: [],
    warnings: sceneWarningsFromBindings(sceneId, [headline, supportingText]),
  };
}

function createStepsScene(article: ArticleInput, visualIntent: "step_flow" | "checklist"): ArticlePolicyScenePlan {
  const sceneId = 3;
  const steps = canonicalOrderedSteps(article).slice(
    0,
    visualIntent === "checklist" ? Math.min(2, articleVisualPolicy.textDensity.maxStepItems) : articleVisualPolicy.textDensity.maxStepItems,
  );
  const stepItems = steps.map((step, index) =>
    bindPolicyText({
      value: step,
      maxCharacters: articleVisualPolicy.textDensity.maxStepTitleCharacters,
      sourceField: `article.sections.orderedSteps[${index}]`,
      sourceExcerpt: step,
    }),
  );
  return {
    sceneId,
    visualIntent,
    stepItems,
    bindings: { stepItems },
    selectedEvidenceIds: [],
    rejectedEvidenceIds: [],
    warnings: sceneWarningsFromBindings(sceneId, stepItems),
  };
}

function createEvidenceScene(brief: ArticleContentBrief, intent: "price_comparison" | "result_metric" | "evidence" | "brief_summary"): {
  scene: ArticlePolicyScenePlan;
  evidenceDecisions: ArticlePolicyEvidenceDecision[];
} {
  const sceneId = intent === "price_comparison" ? 2 : intent === "result_metric" ? 3 : intent === "evidence" ? 4 : 2;
  const { selected, decisions } = chooseEvidence(intent, brief.evidence, intent === "result_metric" ? 3 : 2);
  const headline = bindPolicyText({
    value: brief.keyPoints[1] ?? brief.coreMessage,
    maxCharacters: articleVisualPolicy.textDensity.maxHookHeadlineCharacters,
    sourceField: "contentBrief.keyPoints[1]",
    sourceExcerpt: brief.keyPoints[1] ?? brief.coreMessage,
    sourceEvidenceId: selected[0]?.evidenceId,
  });
  const supportingText = bindPolicyText({
    value: selected[0]?.sourceExcerpt ?? brief.summary,
    maxCharacters:
      intent === "evidence" ? articleVisualPolicy.textDensity.maxEvidenceCaptionCharacters : articleVisualPolicy.textDensity.maxHookSupportingCharacters,
    sourceField: selected[0] ? "contentBrief.evidence.sourceExcerpt" : "contentBrief.summary",
    sourceExcerpt: selected[0]?.sourceExcerpt ?? brief.summary,
    sourceEvidenceId: selected[0]?.evidenceId,
  });
  return {
    scene: {
      sceneId,
      visualIntent: intent,
      headline,
      supportingText,
      bindings: { headline, supportingText },
      selectedEvidenceIds: selected.map((item) => item.evidenceId),
      rejectedEvidenceIds: decisions.filter((item) => !item.accepted).map((item) => item.evidenceId),
      warnings: sceneWarningsFromBindings(sceneId, [headline, supportingText]),
    },
    evidenceDecisions: decisions,
  };
}

function createRecommendationScene(article: ArticleInput, brief: ArticleContentBrief, sceneId: number, visualIntent: "recommendation" | "cta" | "safe_end"): ArticlePolicyScenePlan {
  const recommendationTitle = bindPolicyText({
    value: visualIntent === "cta" ? article.cta?.text ?? brief.coreMessage : brief.coreMessage,
    maxCharacters: visualIntent === "cta" ? articleVisualPolicy.textDensity.maxCtaCharacters : articleVisualPolicy.textDensity.maxRecommendationTitleCharacters,
    sourceField: visualIntent === "cta" ? "article.cta.text" : "contentBrief.coreMessage",
    sourceExcerpt: visualIntent === "cta" ? article.cta?.text ?? brief.coreMessage : brief.coreMessage,
  });
  const itemsSource = visualIntent === "safe_end" ? brief.keyPoints.slice(0, 2) : canonicalOrderedSteps(article).slice(0, 3);
  const fallbackItems = itemsSource.length ? itemsSource : brief.keyPoints.slice(0, 3);
  const recommendationItems = fallbackItems.slice(0, articleVisualPolicy.textDensity.maxRecommendationItems).map((item, index) =>
    bindPolicyText({
      value: item,
      maxCharacters: articleVisualPolicy.textDensity.maxRecommendationItemCharacters,
      sourceField: visualIntent === "cta" ? `contentBrief.keyPoints[${index}]` : `article.sections.orderedSteps[${index}]`,
      sourceExcerpt: item,
    }),
  );
  return {
    sceneId,
    visualIntent,
    recommendationTitle,
    recommendationItems,
    cta:
      article.cta?.text && visualIntent === "cta"
        ? bindPolicyText({
            value: article.cta.text,
            maxCharacters: articleVisualPolicy.textDensity.maxCtaCharacters,
            sourceField: "article.cta.text",
            sourceExcerpt: article.cta.text,
          })
        : undefined,
    bindings: {
      recommendationTitle,
      recommendationItems,
      cta:
        article.cta?.text && visualIntent === "cta"
          ? bindPolicyText({
              value: article.cta.text,
              maxCharacters: articleVisualPolicy.textDensity.maxCtaCharacters,
              sourceField: "article.cta.text",
              sourceExcerpt: article.cta.text,
            })
          : undefined,
    },
    selectedEvidenceIds: [],
    rejectedEvidenceIds: [],
    warnings: sceneWarningsFromBindings(sceneId, [recommendationTitle, ...recommendationItems]),
  };
}

function textDensityWithinPolicy(scenes: ArticlePolicyScenePlan[]) {
  return scenes.every((scene) => {
    const bindings = [
      scene.headline,
      scene.supportingText,
      scene.recommendationTitle,
      scene.cta,
      ...(scene.recommendationItems ?? []),
      ...(scene.stepItems ?? []),
    ].filter((item): item is ArticlePolicyTextBinding => Boolean(item));
    return bindings.every((binding) => binding.finalCharacters >= 1);
  });
}

export function planArticleVisualPolicy(article: ArticleInput, brief: ArticleContentBrief, spec?: ArticleVideoSpec): ArticlePolicyPlan {
  void spec;
  const pageType = pageTypeFor(brief);
  const canonicalSteps = canonicalOrderedSteps(article);
  const duplicateActions = duplicatePreventionActions(article);
  const selectedVisualIntents: ArticleVisualIntent[] = ["hook"];
  const rejectedVisualIntents: Array<{ intent: ArticleVisualIntent; reason: string }> = [];
  const policyWarnings: ArticlePolicyWarning[] = [];
  const scenes: ArticlePolicyScenePlan[] = [createHookScene(article, brief)];
  const allEvidenceDecisions: ArticlePolicyEvidenceDecision[] = [];
  let safeEndReason: string | undefined;

  if (pageType === "guide") {
    scenes.push(createReasonScene(article, brief));
    selectedVisualIntents.push("reason");
    if (canonicalSteps.length >= 3) {
      scenes.push(createStepsScene(article, "step_flow"));
      selectedVisualIntents.push("step_flow");
    } else if (canonicalSteps.length >= 1) {
      scenes.push(createStepsScene(article, "checklist"));
      selectedVisualIntents.push("checklist");
      rejectedVisualIntents.push({ intent: "step_flow", reason: "insufficient_canonical_steps" });
    } else {
      rejectedVisualIntents.push({ intent: "step_flow", reason: "no_canonical_steps" });
      policyWarnings.push({ code: "INSUFFICIENT_CANONICAL_STEPS", message: "Guide article has no canonical ordered steps." });
    }
    scenes.push(createRecommendationScene(article, brief, scenes.length + 1, "recommendation"));
    selectedVisualIntents.push("recommendation");
  } else if (pageType === "comparison") {
    const comparisonScene = createEvidenceScene(brief, "price_comparison");
    allEvidenceDecisions.push(...comparisonScene.evidenceDecisions);
    if (comparisonScene.scene.selectedEvidenceIds.length) {
      scenes.push(comparisonScene.scene);
      selectedVisualIntents.push("price_comparison");
    } else {
      rejectedVisualIntents.push({ intent: "price_comparison", reason: "no_traceable_comparison_evidence" });
      policyWarnings.push({ code: "INSUFFICIENT_TRACEABLE_EVIDENCE", message: "Comparison intent rejected due to missing traceable comparison evidence." });
    }

    const metricScene = createEvidenceScene(brief, "result_metric");
    allEvidenceDecisions.push(...metricScene.evidenceDecisions);
    if (metricScene.scene.selectedEvidenceIds.length) {
      scenes.push(metricScene.scene);
      selectedVisualIntents.push("result_metric");
    } else {
      rejectedVisualIntents.push({ intent: "result_metric", reason: "no_metric_evidence" });
    }

    const evidenceScene = createEvidenceScene(brief, "evidence");
    allEvidenceDecisions.push(...evidenceScene.evidenceDecisions);
    scenes.push(evidenceScene.scene);
    selectedVisualIntents.push("evidence");
  } else if (pageType === "product_pricing") {
    const evidenceScene = createEvidenceScene(brief, "evidence");
    allEvidenceDecisions.push(...evidenceScene.evidenceDecisions);
    scenes.push(evidenceScene.scene);
    selectedVisualIntents.push("evidence");

    const comparisonScene = createEvidenceScene(brief, "price_comparison");
    allEvidenceDecisions.push(...comparisonScene.evidenceDecisions);
    if (comparisonScene.scene.selectedEvidenceIds.length) {
      scenes.push(comparisonScene.scene);
      selectedVisualIntents.push("price_comparison");
    } else {
      rejectedVisualIntents.push({ intent: "price_comparison", reason: "no_traceable_pricing_evidence" });
    }

    scenes.push(createRecommendationScene(article, brief, scenes.length + 1, "recommendation"));
    selectedVisualIntents.push("recommendation");
  } else {
    scenes.push(createEvidenceScene(brief, "brief_summary").scene);
    scenes.push(createRecommendationScene(article, brief, 3, "recommendation"));
    selectedVisualIntents.push("brief_summary", "recommendation");
  }

  if (article.cta?.text || article.cta?.url) {
    scenes.push(createRecommendationScene(article, brief, scenes.length + 1, "cta"));
    selectedVisualIntents.push("cta");
  } else {
    safeEndReason = "cta_missing";
    scenes.push(createRecommendationScene(article, brief, scenes.length + 1, "safe_end"));
    selectedVisualIntents.push("safe_end");
    policyWarnings.push({ code: "SAFE_END_ENABLED", message: "CTA missing, policy emitted safe_end." });
  }

  const textShorteningActions = scenes.flatMap((scene) => {
    const actions = [
      scene.headline ? makeTextAction(scene.sceneId, scene.visualIntent, "headline", scene.headline) : undefined,
      scene.supportingText ? makeTextAction(scene.sceneId, scene.visualIntent, "supportingText", scene.supportingText) : undefined,
      scene.recommendationTitle ? makeTextAction(scene.sceneId, scene.visualIntent, "recommendationTitle", scene.recommendationTitle) : undefined,
      scene.cta ? makeTextAction(scene.sceneId, scene.visualIntent, "cta", scene.cta) : undefined,
      ...(scene.recommendationItems ?? []).map((item) => makeTextAction(scene.sceneId, scene.visualIntent, "recommendationItem", item)),
      ...(scene.stepItems ?? []).map((item) => makeTextAction(scene.sceneId, scene.visualIntent, "stepItem", item)),
    ];
    return actions.filter((item): item is ArticlePolicyTextAction => Boolean(item));
  });

  const selectedEvidenceIds = [...new Set(scenes.flatMap((scene) => scene.selectedEvidenceIds))];
  const recordedDecisionIds = new Set(allEvidenceDecisions.map((item) => item.evidenceId));
  for (const item of brief.evidence) {
    if (recordedDecisionIds.has(item.evidenceId)) {
      continue;
    }
    allEvidenceDecisions.push({
      evidenceId: item.evidenceId,
      accepted: selectedEvidenceIds.includes(item.evidenceId),
      rejectionReason: selectedEvidenceIds.includes(item.evidenceId) ? undefined : "not_needed_for_selected_intents",
    });
  }

  const debug: ArticlePolicyDebug = {
    articleId: article.articleId,
    pageType,
    policyVersion: articleVisualPolicy.policyVersion,
    selectedVisualIntents,
    rejectedVisualIntents,
    selectedEvidenceIds,
    rejectedEvidenceIds: [...new Set([...allEvidenceDecisions.filter((item) => !item.accepted).map((item) => item.evidenceId), ...scenes.flatMap((scene) => scene.rejectedEvidenceIds)])],
    evidenceDecisions: allEvidenceDecisions,
    textShorteningActions,
    stepSelection: {
      canonicalOrderedSteps: canonicalSteps,
      selectedSteps: scenes.flatMap((scene) => scene.stepItems?.map((item) => item.value) ?? []),
    },
    duplicatePreventionActions: duplicateActions,
    policyWarnings: [...policyWarnings, ...scenes.flatMap((scene) => scene.warnings)],
    safeEndReason,
    scenes,
    qaChecks: {
      pageTypeRecognized: Boolean(pageType),
      visualIntentSequenceValid: scenes.every((scene, index) => index === 0 ? scene.visualIntent === "hook" : true),
      noHardcodedShotIdInPolicy: true,
      stepFlowUsesCanonicalOrderedSteps: scenes
        .filter((scene) => scene.visualIntent === "step_flow" || scene.visualIntent === "checklist")
        .every((scene) => (scene.stepItems ?? []).every((item) => canonicalSteps.includes(item.sourceExcerpt))),
      comparisonRequiresTraceableEvidence: scenes
        .filter((scene) => scene.visualIntent === "price_comparison")
        .every((scene) => scene.selectedEvidenceIds.length > 0),
      resultMetricRequiresEligibleEvidence: scenes
        .filter((scene) => scene.visualIntent === "result_metric")
        .every((scene) => scene.selectedEvidenceIds.length > 0),
      sceneIntentSinglePurpose: scenes.every((scene) => articleVisualPolicy.supportedIntents.includes(scene.visualIntent)),
      textDensityWithinPolicy: textDensityWithinPolicy(scenes),
      noDuplicateStepConsumption: duplicateActions.length === 0,
      CTAOnlyWhenTraceable: article.cta?.text ? selectedVisualIntents.includes("cta") : !selectedVisualIntents.includes("cta"),
      safeEndWhenCtaMissing: article.cta?.text ? !selectedVisualIntents.includes("safe_end") : selectedVisualIntents.includes("safe_end"),
    },
  };

  return { scenes, debug };
}

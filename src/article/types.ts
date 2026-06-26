import type { ResolvedScene } from "../factory/shotPlanner";

export type ArticleSourceType = "markdown" | "text" | "html" | "api_html";
export type ArticleApiLocale = "zh" | "en";

export type ArticleCta = {
  text?: string;
  url?: string;
};

export type ArticleSourceLocation = {
  lineStart?: number;
  lineEnd?: number;
  paragraphIndex?: number;
  sectionIndex?: number;
  headingPath?: string[];
  listIndex?: number;
  listItemIndex?: number;
};

export type ArticleLink = {
  href: string;
  anchorText: string;
  sourceLocation: ArticleSourceLocation;
};

export type ArticleSection = {
  sectionId: string;
  heading?: string;
  paragraphs: string[];
  orderedSteps?: string[];
  links?: ArticleLink[];
  sourceLocation: ArticleSourceLocation;
};

export type ArticleInput = {
  articleId: string;
  sourceType: ArticleSourceType;
  title: string;
  summary: string;
  rawContent: string;
  sections: ArticleSection[];
  sourceUrl?: string;
  publishedAt?: string;
  cta?: ArticleCta;
  metadata: Record<string, string>;
};

export type ApiArticleRecord = {
  slug: string;
  locale: ArticleApiLocale;
  title: string;
  page_type: string;
  published_at: string;
  content_html: string;
};

export type ApiArticleBatch = {
  date: string;
  count: number;
  items: ApiArticleRecord[];
};

export type EvidenceKind = "fact" | "instruction" | "quote" | "comparison";
export type EvidenceValueType = "currency" | "percentage" | "date" | "count" | "duration" | "text" | "none";

export type EvidenceItem = {
  evidenceId: string;
  claim: string;
  sourceExcerpt: string;
  sourceLocation: ArticleSourceLocation & {
    sectionId: string;
  };
  kind: EvidenceKind;
  valueType: EvidenceValueType;
  value?: number | string;
  unit?: string;
  videoEligible: boolean;
};

export type ArticleContentBrief = {
  articleId: string;
  title: string;
  coreMessage: string;
  summary: string;
  keyPoints: string[];
  evidence: EvidenceItem[];
  factConstraints: string[];
  recommendedVisualIntents: string[];
  cta?: ArticleCta;
  sourceMetadata: {
    sourceType: ArticleSourceType;
    slug?: string;
    locale?: string;
    pageType?: string;
    sourceUrl?: string;
    publishedAt?: string;
    titleSource: "heading" | "frontmatter" | "api_record" | "fallback";
    summarySource: "paragraph" | "frontmatter" | "fallback";
  };
};

export type ArticlePreviewQaResult = {
  status: "passed" | "warning" | "failed";
  errors: string[];
  warnings: string[];
  checks: Record<string, string | boolean | number>;
};

export type ArticleVideoSpec = {
  profileId: "article-landscape-preview-v1";
  purpose: "\u7f51\u7ad9\u6587\u7ae0\u6a2a\u7248\u77ed\u89c6\u9891\u9884\u89c8";
  aspectRatio: "16:9";
  previewWidth: number;
  previewHeight: number;
  fps: number;
  targetDurationSeconds: 12;
  minDurationSeconds: 10;
  maxDurationSeconds: 14;
  audioMode: "none";
  autoTts: false;
  autoBgm: false;
  outputMode: "preview";
};

export type ArticleSceneSchedule = {
  sceneId: number;
  selectedShotId?: string;
  choreographyId?: string;
  startFrame: number;
  durationInFrames: number;
  endFrame: number;
};

export type ArticleSceneEvidenceRef = {
  evidenceId: string;
  evidenceText: string;
  sourceLocation: ArticleSourceLocation & {
    sectionId: string;
  };
};

export type ArticleBindingMode = "strict" | "default";
export type ArticleVisibleCopyDisplayMode = "full" | "condensed" | "skipped";

export type ArticleVisibleCopyTrace = {
  sourceField: string;
  sourceExcerpt: string;
  sourceLocation?: ArticleSourceLocation & {
    sectionId?: string;
  };
  sourceEvidenceIds: string[];
};

export type ArticleVisibleCopyTextValue = ArticleVisibleCopyTrace & {
  value: string;
  displayMode: Exclude<ArticleVisibleCopyDisplayMode, "skipped">;
  textCapacityDecision: "full" | "condensed";
  compactionReason?: string;
};

export type ArticleVisibleCopyListValue = ArticleVisibleCopyTrace & {
  value: string;
  displayMode: ArticleVisibleCopyDisplayMode;
  textCapacityDecision: "full" | "condensed" | "skipped";
  compactionReason?: string;
};

export type ArticleVisibleCopyScenePlan = {
  sceneId: number;
  runtimeShotId: string;
  choreographyId: string;
  visualIntent: string;
  contentRole: "hook" | "body" | "step_flow" | "recommendation" | "safe_end";
  articleBindingRequired: true;
  articleBindingMode: "strict";
  noPlaceholderFallback: true;
  visibleAtFrame: number;
  headline?: ArticleVisibleCopyTextValue;
  supportingText?: ArticleVisibleCopyTextValue;
  shortLabel?: ArticleVisibleCopyTextValue;
  recommendationTitle?: ArticleVisibleCopyTextValue;
  recommendationItems?: ArticleVisibleCopyListValue[];
  stepItems?: ArticleVisibleCopyListValue[];
  cards?: ArticleVisibleCopyListValue[];
  evidenceCaption?: ArticleVisibleCopyTextValue;
  selectedEvidenceIds: string[];
};

export type ArticleSceneComponentProps = {
  contentSource: "article" | "website";
  articleId?: string;
  articleBindingMode?: ArticleBindingMode;
  articleBindingRequired?: boolean;
  headline?: string;
  supportingText?: string;
  shortLabel?: string;
  evidenceId?: string;
  evidenceText?: string;
  stepItems?: string[];
  recommendationTitle?: string;
  recommendationItems?: string[];
  ctaText?: string;
  ctaUrl?: string;
  visualIntent?: string;
  selectedEvidence?: ArticleSceneEvidenceRef[];
  headlineSource?: string;
  supportingTextSource?: string;
  contentIntent?: string;
  policyWarnings?: string[];
  visibleCopyPlan?: ArticleVisibleCopyScenePlan;
};

export type ArticleRenderInputProps = {
  structure: {
    meta: {
      fps: number;
      width: number;
      height: number;
      durationFrames: number;
    };
    renderConfig: {
      duration: number;
    };
    scenes: ResolvedScene[];
    batchVideos?: Array<{
      strategyId?: string;
      scenes?: ResolvedScene[];
    }>;
    articleJob?: {
      jobId: string;
      articleId: string;
      articleBindingMode?: ArticleBindingMode;
      selectedEvidenceIds: string[];
      selectedShotIds: string[];
      selectedChoreographyIds: string[];
      policyWarnings?: string[];
      visibleCopyPlan?: ArticleVisibleCopyScenePlan[];
    };
  };
};

export type ArticleVideoJob = {
  jobId: string;
  articleId: string;
  videoSpec: ArticleVideoSpec;
  targetDurationFrames: number;
  actualDurationFrames: number;
  actualDurationSeconds: number;
  sceneSchedule: ArticleSceneSchedule[];
  selectedSceneIds: number[];
  selectedChoreographyIds: string[];
  contentBrief: ArticleContentBrief;
  selectedEvidenceIds: string[];
  resolvedScenes: ResolvedScene[];
  remotionInputProps: ArticleRenderInputProps;
  outputDirectory: string;
  policyDebug?: Record<string, unknown>;
  qaResult?: ArticlePreviewQaResult;
  visibleCopyPlan?: ArticleVisibleCopyScenePlan[];
};

import { emailDraftGenerationDemoAtomicMotions } from "../../atomic/emailDraftGenerationDemo";

export type EmailDraftGenerationDemoTrack = {
  trackId: string;
  motionId: (typeof emailDraftGenerationDemoAtomicMotions)[number];
  target: string;
  layer: "search" | "title" | "website" | "results" | "semantic" | "camera";
  startPercent: number;
  endPercent: number;
  role: string;
  purpose: string;
  semanticTarget?: string;
};

export const emailDraftGenerationDemoTracks: EmailDraftGenerationDemoTrack[] = [
  {
    trackId: "track-macEmailPromptEmerge",
    motionId: "macEmailPromptEmerge",
    target: "promptPanel",
    layer: "search",
    startPercent: 0,
    endPercent: 24,
    role: "entry",
    purpose: "Introduce the article-backed prompt field.",
    semanticTarget: "article.prompt",
  },
  {
    trackId: "track-macEmailQueryReveal",
    motionId: "macEmailQueryReveal",
    target: "headline",
    layer: "title",
    startPercent: 10,
    endPercent: 36,
    role: "message-hierarchy",
    purpose: "Reveal the main article claim without demo fallback copy.",
    semanticTarget: "article.headline",
  },
  {
    trackId: "track-macEmailWorkspaceEnter",
    motionId: "macEmailWorkspaceEnter",
    target: "workspace",
    layer: "website",
    startPercent: 26,
    endPercent: 54,
    role: "build",
    purpose: "Move into the generated workspace panel.",
    semanticTarget: "macSource.workspace",
  },
  {
    trackId: "track-macEmailRowsGenerate",
    motionId: "macEmailRowsGenerate",
    target: "resultRows",
    layer: "results",
    startPercent: 44,
    endPercent: 76,
    role: "supporting-value-proof",
    purpose: "Show article-derived rows in a readable sequence.",
    semanticTarget: "article.rows",
  },
  {
    trackId: "track-macEmailSuggestionSettle",
    motionId: "macEmailSuggestionSettle",
    target: "supportPanel",
    layer: "semantic",
    startPercent: 62,
    endPercent: 88,
    role: "emphasis",
    purpose: "Settle a secondary article-backed recommendation panel.",
    semanticTarget: "article.recommendation",
  },
  {
    trackId: "track-macEmailReadableHold",
    motionId: "macEmailReadableHold",
    target: "fullComposition",
    layer: "camera",
    startPercent: 84,
    endPercent: 100,
    role: "settle",
    purpose: "Hold the completed composition for readability.",
  },
];
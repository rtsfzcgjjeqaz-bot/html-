import crypto from "crypto";
import type { ArticleInput, ArticleSourceLocation, EvidenceItem } from "../types";
import type { BatchDefect } from "./articleBatchTypes";

export type InputIntegrityCheckName =
  | "evidenceSourceExcerptPresent"
  | "evidenceSourceLocationPresent"
  | "evidenceSourceLocationResolvable"
  | "evidenceExcerptReproducibleFromCanonicalSource"
  | "evidenceNoReplacementCharacter"
  | "evidenceNoParserTruncationFlag"
  | "evidenceNoMalformedSourceSpan"
  | "evidenceNoUnexpectedEmptyCanonicalSegment";

export type InputIntegrityEvidenceResult = {
  evidenceId: string;
  sourceSnapshotId: string;
  sourceExcerptHash: string;
  checks: Record<InputIntegrityCheckName, boolean>;
  status: "passed" | "failed";
  failureCategories: string[];
};

export type InputIntegrityReport = {
  status: "passed" | "rejected";
  sourceSnapshotId: string;
  sourceContentHash: string;
  evidenceCount: number;
  checks: Record<InputIntegrityCheckName, boolean>;
  defects: BatchDefect[];
  evidenceResults: InputIntegrityEvidenceResult[];
};

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").toUpperCase();
}

function normalizedText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function hasReplacementCharacter(value: string | undefined) {
  return Boolean(value?.includes("\uFFFD"));
}

function hasParserTruncationFlag(evidence: EvidenceItem) {
  const values = [evidence.claim, evidence.sourceExcerpt].map((value) => normalizedText(value));
  return values.some((value) => /(?:\.\.\.|…)$/.test(value));
}

function resolveCanonicalSegment(article: ArticleInput, sourceLocation: EvidenceItem["sourceLocation"]) {
  const section = article.sections.find((item) => item.sectionId === sourceLocation.sectionId);
  if (!section) {
    return undefined;
  }
  if (typeof sourceLocation.listItemIndex === "number") {
    return section.orderedSteps?.[sourceLocation.listItemIndex];
  }
  if (typeof sourceLocation.paragraphIndex === "number") {
    return section.paragraphs[sourceLocation.paragraphIndex];
  }
  return undefined;
}

function sourceLocationPresent(sourceLocation: ArticleSourceLocation & { sectionId?: string }) {
  return Boolean(sourceLocation.sectionId) && (typeof sourceLocation.paragraphIndex === "number" || typeof sourceLocation.listItemIndex === "number");
}

function malformedSourceSpan(sourceLocation: EvidenceItem["sourceLocation"]) {
  if (typeof sourceLocation.paragraphIndex === "number" && sourceLocation.paragraphIndex < 0) return true;
  if (typeof sourceLocation.listItemIndex === "number" && sourceLocation.listItemIndex < 0) return true;
  if (typeof sourceLocation.lineStart === "number" && sourceLocation.lineStart < 0) return true;
  if (typeof sourceLocation.lineEnd === "number" && sourceLocation.lineEnd < 0) return true;
  if (typeof sourceLocation.lineStart === "number" && typeof sourceLocation.lineEnd === "number" && sourceLocation.lineEnd < sourceLocation.lineStart) return true;
  return false;
}

function defectForEvidence(evidence: EvidenceItem, failedChecks: InputIntegrityCheckName[]): BatchDefect {
  return {
    issueId: `input_integrity_${evidence.evidenceId}`,
    severity: "BLOCKER",
    category: "INPUT_INTEGRITY",
    sceneIds: [],
    evidenceIds: [evidence.evidenceId],
    tableIds: [],
    message: `Evidence failed input integrity checks: ${failedChecks.join(", ")}.`,
    detectedBy: "inputIntegrityGate",
    repairScope: "re_read_input",
    recommendedAction: "Re-read and re-parse the canonical article source before script generation.",
    autoRepairEligible: true,
  };
}

export function runInputIntegrityGate(input: {
  article: ArticleInput;
  evidence: EvidenceItem[];
  sourceSnapshotId: string;
  sourceContentHash: string;
}): InputIntegrityReport {
  const evidenceResults = input.evidence.map((evidence) => {
    const canonicalSegment = resolveCanonicalSegment(input.article, evidence.sourceLocation);
    const sourceExcerpt = normalizedText(evidence.sourceExcerpt);
    const canonical = normalizedText(canonicalSegment ?? "");
    const checks: Record<InputIntegrityCheckName, boolean> = {
      evidenceSourceExcerptPresent: sourceExcerpt.length > 0,
      evidenceSourceLocationPresent: sourceLocationPresent(evidence.sourceLocation),
      evidenceSourceLocationResolvable: canonicalSegment !== undefined,
      evidenceExcerptReproducibleFromCanonicalSource: Boolean(sourceExcerpt) && Boolean(canonical) && canonical.includes(sourceExcerpt),
      evidenceNoReplacementCharacter: !hasReplacementCharacter(evidence.claim) && !hasReplacementCharacter(evidence.sourceExcerpt) && !hasReplacementCharacter(canonicalSegment),
      evidenceNoParserTruncationFlag: !hasParserTruncationFlag(evidence),
      evidenceNoMalformedSourceSpan: !malformedSourceSpan(evidence.sourceLocation),
      evidenceNoUnexpectedEmptyCanonicalSegment: canonicalSegment !== undefined && canonical.length > 0,
    };
    const failedChecks = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([check]) => check as InputIntegrityCheckName);
    return {
      evidenceId: evidence.evidenceId,
      sourceSnapshotId: input.sourceSnapshotId,
      sourceExcerptHash: sha256(evidence.sourceExcerpt),
      checks,
      status: failedChecks.length ? "failed" as const : "passed" as const,
      failureCategories: failedChecks,
    };
  });

  const defects = evidenceResults
    .filter((result) => result.status === "failed")
    .map((result) => {
      const evidence = input.evidence.find((item) => item.evidenceId === result.evidenceId)!;
      return defectForEvidence(evidence, result.failureCategories as InputIntegrityCheckName[]);
    });

  const checkNames: InputIntegrityCheckName[] = [
    "evidenceSourceExcerptPresent",
    "evidenceSourceLocationPresent",
    "evidenceSourceLocationResolvable",
    "evidenceExcerptReproducibleFromCanonicalSource",
    "evidenceNoReplacementCharacter",
    "evidenceNoParserTruncationFlag",
    "evidenceNoMalformedSourceSpan",
    "evidenceNoUnexpectedEmptyCanonicalSegment",
  ];
  const checks = Object.fromEntries(
    checkNames.map((check) => [check, evidenceResults.every((result) => result.checks[check])]),
  ) as Record<InputIntegrityCheckName, boolean>;

  return {
    status: defects.length ? "rejected" : "passed",
    sourceSnapshotId: input.sourceSnapshotId,
    sourceContentHash: input.sourceContentHash,
    evidenceCount: input.evidence.length,
    checks,
    defects,
    evidenceResults,
  };
}

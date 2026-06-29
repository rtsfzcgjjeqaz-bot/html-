export type SemanticReviewNormalizationDiagnostics = {
  normalizationApplied: boolean;
  normalizedFieldCount: number;
  normalizedPaths: string[];
  originalTypeSummary: Record<string, string>;
  normalizedTypeSummary: Record<string, string>;
  rejectedFieldPaths: string[];
  validationOutcome: "not_validated" | "passed" | "failed";
  providerId?: string;
  modelId?: string;
  reviewVersion?: string;
};

const normalizableFields = ["sceneIds", "evidenceIds", "tableIds"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isFiniteInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && Number.isInteger(value);
}

function typeSummary(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) {
    if (value.length === 0) return "empty_array";
    if (value.every((item) => typeof item === "string")) return "string[]";
    if (value.every((item) => isFiniteInteger(item))) return "integer[]";
    if (value.every((item) => typeof item === "string" || isFiniteInteger(item))) return "string_or_integer[]";
    if (value.some((item) => Array.isArray(item))) return "array_with_nested_array";
    return "mixed_array";
  }
  if (isFiniteInteger(value)) return "integer";
  if (typeof value === "number") return "number";
  return typeof value;
}

function normalizeIdList(value: unknown): { normalized: true; value: string[] } | { normalized: false } {
  if (typeof value === "string") {
    if (value.length === 0) return { normalized: false };
    return { normalized: true, value: [value] };
  }
  if (isFiniteInteger(value)) return { normalized: true, value: [String(value)] };
  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string" && item.length > 0)) return { normalized: true, value: [...value] };
    if (value.every((item) => (typeof item === "string" && item.length > 0) || isFiniteInteger(item))) {
      return { normalized: true, value: value.map((item) => String(item)) };
    }
  }
  return { normalized: false };
}

export function normalizeSemanticReviewProviderPayload(value: unknown): {
  value: unknown;
  diagnostics: SemanticReviewNormalizationDiagnostics;
} {
  const diagnostics: SemanticReviewNormalizationDiagnostics = {
    normalizationApplied: false,
    normalizedFieldCount: 0,
    normalizedPaths: [],
    originalTypeSummary: {},
    normalizedTypeSummary: {},
    rejectedFieldPaths: [],
    validationOutcome: "not_validated",
  };

  if (!isRecord(value)) return { value, diagnostics };

  if (isRecord(value.reviewer)) {
    if (typeof value.reviewer.providerId === "string") diagnostics.providerId = value.reviewer.providerId;
    if (typeof value.reviewer.modelId === "string") diagnostics.modelId = value.reviewer.modelId;
    if (typeof value.reviewer.reviewVersion === "string") diagnostics.reviewVersion = value.reviewer.reviewVersion;
  }

  if (!Array.isArray(value.issues)) return { value, diagnostics };

  const normalizedValue = {
    ...value,
    issues: value.issues.map((issue, index) => {
      if (!isRecord(issue)) return issue;
      const normalizedIssue: Record<string, unknown> = { ...issue };
      for (const field of normalizableFields) {
        const path = `issues[${index}].${field}`;
        const original = issue[field];
        diagnostics.originalTypeSummary[path] = typeSummary(original);
        const normalized = normalizeIdList(original);
        if (!normalized.normalized) {
          diagnostics.rejectedFieldPaths.push(path);
          diagnostics.normalizedTypeSummary[path] = typeSummary(original);
          continue;
        }
        normalizedIssue[field] = normalized.value;
        diagnostics.normalizedTypeSummary[path] = typeSummary(normalized.value);
        if (typeSummary(original) !== typeSummary(normalized.value)) {
          diagnostics.normalizationApplied = true;
          diagnostics.normalizedFieldCount += 1;
          diagnostics.normalizedPaths.push(path);
        }
      }
      return normalizedIssue;
    }),
  };

  return { value: normalizedValue, diagnostics };
}

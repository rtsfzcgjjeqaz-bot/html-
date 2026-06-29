import { chatJsonStrict, getOpenAIProviderStatus } from "../../lib/openai";

export type SemanticProviderPreflightStatus =
  | "passed"
  | "credentials_missing"
  | "config_invalid"
  | "provider_unreachable"
  | "provider_response_invalid";

export type SemanticProviderPreflightResult = {
  status: SemanticProviderPreflightStatus;
  providerId: "openai";
  modelId: string;
  modelSource: "explicit_semantic_config" | "inherited_default" | "missing";
  requiredEnvVariableNames: string[];
  optionalEnvVariableNames: string[];
  environmentConfigResolved: boolean;
  requiredCredentialFieldsPresent: boolean;
  providerClientConstructed: boolean;
  semanticReviewModelResolved: boolean;
  strictJsonModeSupportedOrAdapted: boolean;
  providerReachabilityChecked: boolean;
  configResolved: boolean;
  credentialsPresent: boolean;
  clientConstructed: boolean;
  remoteReachable: boolean;
  strictJsonSupported: boolean;
  sanitizedFailureCategory?: SemanticProviderPreflightStatus;
  checkedAt: string;
};

function baseResult(): SemanticProviderPreflightResult {
  const provider = getOpenAIProviderStatus();
  const modelSource = provider.semanticReviewModelId
    ? provider.semanticReviewModelSource === "explicit_semantic_config"
      ? "explicit_semantic_config"
      : "inherited_default"
    : "missing";
  return {
    status: "config_invalid",
    providerId: "openai",
    modelId: provider.semanticReviewModelId || provider.modelId,
    modelSource,
    requiredEnvVariableNames: provider.requiredEnvVariableNames,
    optionalEnvVariableNames: provider.optionalEnvVariableNames,
    environmentConfigResolved: provider.configResolved,
    requiredCredentialFieldsPresent: provider.credentialsPresent,
    providerClientConstructed: true,
    semanticReviewModelResolved: Boolean(provider.semanticReviewModelId),
    strictJsonModeSupportedOrAdapted: true,
    providerReachabilityChecked: false,
    configResolved: provider.configResolved,
    credentialsPresent: provider.credentialsPresent,
    clientConstructed: true,
    remoteReachable: false,
    strictJsonSupported: true,
    checkedAt: new Date().toISOString(),
  };
}

export async function runSemanticProviderPreflight(): Promise<SemanticProviderPreflightResult> {
  const result = baseResult();
  if (!result.environmentConfigResolved || !result.semanticReviewModelResolved) {
    return { ...result, status: "config_invalid", sanitizedFailureCategory: "config_invalid" };
  }
  if (!result.requiredCredentialFieldsPresent) {
    return { ...result, status: "credentials_missing", sanitizedFailureCategory: "credentials_missing" };
  }

  const health = await chatJsonStrict<{ ok: true }>(
    [
      { role: "system", content: "Return strict JSON only." },
      { role: "user", content: "Return {\"ok\":true} exactly as JSON." },
    ],
    0,
    result.modelId,
  );

  if (health.status !== "passed") {
    const category = health.status === "response_invalid" && health.errorType === "request_failed" ? "provider_unreachable" : "provider_response_invalid";
    return {
      ...result,
      status: category,
      providerReachabilityChecked: true,
      sanitizedFailureCategory: category,
    };
  }

  if (health.value?.ok !== true) {
    return {
      ...result,
      status: "provider_response_invalid",
      providerReachabilityChecked: true,
      sanitizedFailureCategory: "provider_response_invalid",
    };
  }

  return {
    ...result,
    status: "passed",
    providerReachabilityChecked: true,
    remoteReachable: true,
  };
}

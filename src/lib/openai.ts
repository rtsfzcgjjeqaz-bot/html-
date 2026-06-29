import axios from "axios";
import { openAIConfig } from "./config";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatJsonStrictResult<T> =
  | { status: "provider_unavailable"; providerId: "openai"; modelId: string }
  | { status: "response_invalid"; providerId: "openai"; modelId: string; errorType: "request_failed" | "empty_response" | "json_parse_failed" }
  | { status: "passed"; providerId: "openai"; modelId: string; value: T };

export function getOpenAIProviderStatus() {
  return {
    providerId: "openai" as const,
    modelId: openAIConfig.model,
    semanticReviewModelId: openAIConfig.semanticReviewModel,
    semanticReviewModelSource: openAIConfig.semanticReviewModelSource,
    scriptRepairModelId: openAIConfig.scriptRepairModel,
    scriptRepairModelSource: openAIConfig.scriptRepairModelSource,
    requiredEnvVariableNames: ["OPENAI_API_KEY"],
    optionalEnvVariableNames: ["OPENAI_BASE_URL", "OPENAI_MODEL", "OPENAI_SEMANTIC_REVIEW_MODEL", "OPENAI_SCRIPT_REPAIR_MODEL"],
    configResolved: Boolean(openAIConfig.baseUrl && openAIConfig.model && openAIConfig.semanticReviewModel),
    credentialsPresent: Boolean(openAIConfig.apiKey),
    available: Boolean(openAIConfig.apiKey),
  };
}

export async function chatJson<T>(messages: ChatMessage[], fallback: T, temperature = 0.65): Promise<T> {
  if (!openAIConfig.apiKey) {
    return fallback;
  }

  try {
    const res = await axios.post(
      `${openAIConfig.baseUrl}/v1/chat/completions`,
      {
        model: openAIConfig.model,
        messages,
        temperature,
      },
      {
        headers: {
          Authorization: `Bearer ${openAIConfig.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      },
    );

    const content = res.data.choices?.[0]?.message?.content;
    if (!content) {
      return fallback;
    }

    const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("OpenAI JSON call failed:", message);
    return fallback;
  }
}

export async function chatJsonStrict<T>(messages: ChatMessage[], temperature = 0.2, modelId = openAIConfig.model): Promise<ChatJsonStrictResult<T>> {
  if (!openAIConfig.apiKey) {
    return { status: "provider_unavailable", providerId: "openai", modelId };
  }

  try {
    const res = await axios.post(
      `${openAIConfig.baseUrl}/v1/chat/completions`,
      {
        model: modelId,
        messages,
        temperature,
      },
      {
        headers: {
          Authorization: `Bearer ${openAIConfig.apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      },
    );

    const content = res.data.choices?.[0]?.message?.content;
    if (!content) {
      return { status: "response_invalid", providerId: "openai", modelId, errorType: "empty_response" };
    }

    try {
      const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();
      return { status: "passed", providerId: "openai", modelId, value: JSON.parse(cleaned) as T };
    } catch {
      return { status: "response_invalid", providerId: "openai", modelId, errorType: "json_parse_failed" };
    }
  } catch {
    return { status: "response_invalid", providerId: "openai", modelId, errorType: "request_failed" };
  }
}

import axios from "axios";
import { openAIConfig } from "./config";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

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

import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

const modelName = "gemini-1.5-flash";

export async function generateAI(prompt: string, fallback: string) {
  if (!process.env.GEMINI_API_KEY) return fallback;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction:
      "You are Revamp Digital's senior website strategist. Be practical, specific, ethical, concise, and conversion-focused. Return professional structured output."
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export function extractJson<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text) as T;
  } catch {
    return fallback;
  }
}

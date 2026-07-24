import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn(
    "⚠️ GEMINI_API_KEY is not set in environment variables. " +
    "Get a key at https://aistudio.google.com and set GEMINI_API_KEY in .env.local"
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

function checkApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing. Please configure your API key in .env.local to use AI features."
    );
  }
}

// Resilient list of Gemini model identifiers supported across API tiers
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
];

// Helper to format user-friendly AI error messages
function formatAiError(err: any): string {
  const msg = err?.message || String(err);
  if (msg.includes("429") || msg.includes("Quota exceeded") || msg.includes("rate-limits")) {
    return "Gemini API rate limit reached. Please wait ~30 seconds and try again, or check your API key quota at https://aistudio.google.com";
  }
  if (msg.includes("API_KEY") || msg.includes("API key")) {
    return "Invalid or missing GEMINI_API_KEY in .env.local.";
  }
  return "AI service temporarily unavailable. Please try again in a moment.";
}

// ── Embedding ──────────────────────────────────────────────────────────────────

/**
 * Embed a piece of text using Google's text-embedding-004 model.
 * Returns a 768-dimensional vector.
 */
export async function embedText(text: string): Promise<number[]> {
  checkApiKey();
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text.slice(0, 10000));
    return result.embedding.values;
  } catch (err: any) {
    console.error("❌ embedText error:", err?.message || err);
    throw new Error(formatAiError(err));
  }
}

// ── Text generation (streaming) ────────────────────────────────────────────────

/**
 * Async generator that streams answer chunks from Gemini with fallback model support.
 */
export async function* streamAnswer(prompt: string): AsyncGenerator<string> {
  checkApiKey();
  let lastErr: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction:
          "You are a concise study assistant for engineering students. " +
          "Answer questions using ONLY the provided context. " +
          "If the context doesn't contain enough information, say so clearly — do not guess.",
      });
      const result = await model.generateContentStream(prompt);
      for await (const chunk of result.stream) {
        yield chunk.text();
      }
      return; // Stream succeeded
    } catch (err: any) {
      console.warn(`⚠️ Model ${modelName} stream failed: ${err?.message || err}`);
      lastErr = err;
      // Continue trying next candidate model regardless of whether it's 404 or 429
    }
  }

  if (lastErr) {
    throw new Error(formatAiError(lastErr));
  }
}

// ── Structured JSON generation ─────────────────────────────────────────────────

/**
 * Generate a response strictly in JSON format (for quiz/flashcard generation).
 * Strips markdown fences if present and returns clean JSON string.
 */
export async function generateJSON(prompt: string): Promise<string> {
  checkApiKey();
  let lastErr: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" },
      });
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();

      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      return cleaned;
    } catch (err: any) {
      console.warn(`⚠️ Model ${modelName} JSON generation failed: ${err?.message || err}`);
      lastErr = err;
    }
  }

  if (lastErr) {
    throw new Error(formatAiError(lastErr));
  }

  return "{}";
}

// ── Vector math ────────────────────────────────────────────────────────────────

/**
 * Compute cosine similarity between two equal-length embedding vectors.
 * Returns a value in [0, 1] where 1 = identical direction.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a?.length || a.length !== b?.length) return 0;
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// app/api/ai/generate/route.ts
import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '', // Fallback to empty string if not set
});

// Define expected request body type
interface GenerateRequest {
  prompt: string;
  context: string;
  maxTokens?: number; // Optional for future flexibility
}


export async function POST(req: Request) {
  try {
    const body = await req.json() as GenerateRequest;
    const { prompt, context, maxTokens = 1000 } = body; // Default maxTokens if not provided

    if (!prompt || typeof prompt !== 'string' || !context || typeof context !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: prompt and context must be non-empty strings' },
        { status: 400 }
      );
    }

    // Combine context and prompt for Cohere
    const fullPrompt = `Context: ${context}\n\nTask: ${prompt}`;

    // Call Cohere API
    const response = await cohere.generate({
      prompt: fullPrompt,
      maxTokens, // Use client-provided value or default
      temperature: 0.7, // Optional: adjust creativity (customize as needed)
    });

    // Extract the generated text
    const generatedText = response.generations[0]?.text || '';

    // Check if the response was truncated
    const isTruncated = detectTruncation(generatedText);

    // Return the result with a professional message if truncated
    if (isTruncated) {
      return NextResponse.json(
        {
          result: `${generatedText.trim()}... Limit reached. The response has been truncated due to the maximum token limit.`,
        },
        { status: 200 }
      );
    }

    // Return the full result if not truncated
    return NextResponse.json({ result: generatedText.trim() }, { status: 200 });
  } catch (error) {
    console.error('Error in Cohere generation:', error);
    return NextResponse.json(
      { error: 'Failed to generate text' },
      { status: 500 }
    );
  }
}

/**
 * Detects if the generated text is truncated based on common signs of truncation.
 * @param text - The generated text to check.
 * @returns True if the text appears truncated, false otherwise.
 */
function detectTruncation(text: string): boolean {
  const truncationPatterns = [
    /\b\w+$/,   // Word cut off mid-sentence
    /\.$/,      // Single period at the end (could indicate incomplete sentence)
    /[\s\n]$/,  // Ends with whitespace or newline
  ];
  return truncationPatterns.some((pattern) => pattern.test(text));
}
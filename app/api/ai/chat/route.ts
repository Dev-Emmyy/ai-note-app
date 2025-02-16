import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Prepare the prompt for Cohere
    const prompt = messages
      .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Call Cohere API
    const response = await cohere.generate({
      prompt: prompt,
      maxTokens: 600, // Adjust as needed
    });

    // Extract the AI's response
    const aiResponse = response.generations[0]?.text || '';

    // Check if the response was truncated
    const isTruncated = detectTruncation(aiResponse);

    // Return the result with a professional message if truncated
    if (isTruncated) {
      return NextResponse.json(
        {
          result: `${aiResponse.trim()}... Limit reached. The response has been truncated due to the maximum token limit.`,
        },
        { status: 200 }
      );
    }

    // Return the full result if not truncated
    return NextResponse.json({ result: aiResponse }, { status: 200 });
  } catch (error) {
    console.error('Error in Cohere chat:', error);
    return NextResponse.json(
      { error: 'Failed to generate chat response' },
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
  // Define patterns that indicate truncation (e.g., incomplete sentences, abrupt endings)
  const truncationPatterns = [
    /\b\w+$/, // Word cut off mid-sentence
    /\.$/,    // Single period at the end (could indicate an incomplete sentence)
    /[\s\n]$/, // Ends with whitespace or newline
  ];

  // Check if any pattern matches
  return truncationPatterns.some((pattern) => pattern.test(text));
}
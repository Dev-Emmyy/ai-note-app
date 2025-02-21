// app/api/ai/chat/route.ts
import { NextResponse } from 'next/server';
import { CohereClient } from 'cohere-ai';

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || '',
});

interface ChatRequest {
  messages: { role: string; content: string }[];
}


export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as ChatRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid request: messages array is required' }, { status: 400 });
    }

    // Format chat history as a conversational prompt
    const prompt = messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n') + '\nAI:';

    // Call Cohere API
    const response = await cohere.generate({
      prompt,
      maxTokens: 1000, // Reduced for chatting; adjust as needed
      temperature: 0.7, // Moderate creativity for conversational tone
    });

    const aiResponse = response.generations[0]?.text.trim() || '';

    // Check for truncation
    const isTruncated = detectTruncation(aiResponse);

    if (isTruncated) {
      return NextResponse.json(
        {
          result: `${aiResponse}... (Response truncated due to token limit)`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ result: aiResponse }, { status: 200 });
  } catch (error) {
    console.error('Error in Cohere chat:', error);
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 });
  }
}

function detectTruncation(text: string): boolean {
  const truncationPatterns = [
    /\b\w+$/,
    /\.$/,
    /[\s\n]$/,
  ];
  return truncationPatterns.some((pattern) => pattern.test(text));
}
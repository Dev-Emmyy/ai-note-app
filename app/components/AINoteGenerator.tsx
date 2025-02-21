// app/components/AINoteGenerator.tsx
"use client";

import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../../context/notesStore'; // Adjust path
import { Box, TextField, Button, Typography } from '@mui/material';

interface GenerateResponse {
  result: string;
}

async function generateText({ prompt, context }: { prompt: string; context: string }): Promise<GenerateResponse> {
  console.log('Sending to /api/ai/generate:', { prompt, context });
  const response = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, context }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate text');
  }
  return response.json();
}

const AINoteGenerator = () => {
  const { notes, prompt, result, setPrompt, setResult, resetAIGenerator } = useAppStore();

  const mutation = useMutation({
    mutationFn: generateText,
    onSuccess: (data) => {
      setResult(data.result);
    },
    onError: (error) => {
      console.error('Error:', error);
      setResult(`Failed to generate text: ${error.message}. Please try again.`);
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    const context = notes.length > 0
      ? notes.map((note) => note.content).join('\n\n')
      : 'No notes available. Please add some notes first.';
    const summarizedPrompt = `Summarize or generate content based on the following notes: ${prompt}`;
    mutation.mutate({ prompt: summarizedPrompt, context });
  };

  const handleReset = () => {
    resetAIGenerator();
  };

  if (notes.length === 0 && !result) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontFamily: 'Product Sans' }}>
          No notes available. Please add some notes to generate content.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask me to summarize or generate ideas from your notes..."
        disabled={mutation.isPending}
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          onClick={handleGenerate}
          variant="contained"
          sx={{ fontFamily: 'Product Sans' }}
          disabled={mutation.isPending || !prompt.trim()}
        >
          {mutation.isPending ? 'Generating...' : 'Generate'}
        </Button>
        {result && (
          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{ fontFamily: 'Product Sans' }}
            disabled={mutation.isPending}
          >
            Clear
          </Button>
        )}
      </Box>

      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ fontFamily: 'Merriweather' }}>
            {result}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AINoteGenerator;
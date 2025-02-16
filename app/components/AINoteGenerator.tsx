"use client";
import { useState } from 'react';
import { Box, TextField, Button, Typography} from '@mui/material';

interface AIGenerateProps {
  notes: { content: string }[];
}

const AIGenerate = ({ notes }: AIGenerateProps) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const context = notes.map((note) => note.content).join('\n\n');

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          context: context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      setResult('Failed to generate text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask me to generate ideas from your notes..."
        disabled={isLoading}
      />
      <Button
        onClick={handleGenerate}
        variant="contained"
        sx={{ mt: 2, fontFamily: 'Product sans' }}
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>

      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{fontFamily: 'Merriweather'}}>{result}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AIGenerate;
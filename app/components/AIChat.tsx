// app/components/AIChat.tsx
"use client";

import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../../context/notesStore'; // Adjust path
import { Box, TextField, Button, Paper, Typography, CircularProgress, SxProps, Theme } from '@mui/material';

interface ChatResponse {
  result: string;
}

async function sendChatMessage(messages: { role: string; content: string }[]): Promise<ChatResponse> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get AI response');
  }
  return response.json();
}

const AIChat = ({ sx }: { sx?: SxProps<Theme> }) => {
  const { chatMessage, chatHistory, setChatMessage, addChatMessage, resetChat } = useAppStore();

  const mutation = useMutation({
    mutationFn: sendChatMessage,
    onMutate: () => {
      // Optimistically add user message
      addChatMessage({ role: 'user', content: chatMessage });
    },
    onSuccess: (data) => {
      // Add AI response
      addChatMessage({ role: 'ai', content: data.result });
      setChatMessage(''); // Clear input
    },
    onError: (error) => {
      console.error('Error:', error);
      addChatMessage({
        role: 'ai',
        content: 'Sorry, something went wrong. Please try again or rephrase your request.',
      });
    },
  });

  const handleSend = () => {
    if (!chatMessage.trim()) return;
    mutation.mutate([...chatHistory, { role: 'user', content: chatMessage }]);
  };

  const handleReset = () => {
    resetChat();
  };

  return (
    <Box sx={{ p: 2, ...sx, '& .MuiTextField-root': { mb: { xs: 1, sm: 2 } } }}>
      {/* Chat History */}
      <Box sx={{ mb: 2, maxHeight: '60vh', overflowY: 'auto' }}>
        {chatHistory.map((msg, i) => (
          <Paper
            key={i}
            sx={{
              p: 2,
              mb: 1,
              fontFamily: 'Merriweather',
              bgcolor: msg.role === 'user' ? 'grey.100' : 'primary.light',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              ml: msg.role === 'ai' ? 0 : 'auto',
            }}
          >
            <Typography variant="body1" sx={{ fontFamily: 'Merriweather' }}>
              {msg.content}
            </Typography>
          </Paper>
        ))}
        {mutation.isPending && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Input Field and Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Ask me anything..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={mutation.isPending}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={handleSend}
            variant="contained"
            sx={{ fontFamily: 'Product Sans' }}
            disabled={mutation.isPending || !chatMessage.trim()}
          >
            {mutation.isPending ? 'Sending...' : 'Send'}
          </Button>
          {chatHistory.length > 0 && (
            <Button
              onClick={handleReset}
              variant="outlined"
              sx={{ fontFamily: 'Product Sans' }}
              disabled={mutation.isPending}
            >
              Clear Chat
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AIChat;
// app/components/NoteForm.tsx
"use client";

import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../../context/notesStore'; // Adjust path
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { TextField, Button, Box, Paper, Typography, IconButton } from '@mui/material';
import { AddCircleOutline, ArrowBack } from '@mui/icons-material';

async function createNote({ title, content }: { title: string; content: string }) {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
}

const NoteForm = () => {
  const router = useRouter();
  const { title, content, setTitle, setContent, addNote, resetNoteForm } = useAppStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      addNote(newNote); // Sync with Zustand store
      resetNoteForm(); // Clear form
      router.push('/'); // Redirect
    },
    onError: (error) => {
      console.error('Error creating note:', error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    mutation.mutate({ title, content });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 800,
        mx: 'auto',
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.push('/')} sx={{ mr: 1 }}>
          <ArrowBack sx={{ color: 'primary.main' }} />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Alkalami',
          }}
        >
          New Note
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, fontFamily: 'Product Sans' }}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={mutation.isPending}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&.Mui-focused fieldset': { borderWidth: 2, borderColor: 'primary.main' },
            },
          }}
          InputLabelProps={{ sx: { fontWeight: 500, color: 'text.secondary' } }}
        />

        <TextField
          label="Content"
          variant="outlined"
          multiline
          rows={6}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={mutation.isPending}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&.Mui-focused fieldset': { borderWidth: 2, borderColor: 'primary.main' },
            },
          }}
          InputLabelProps={{ sx: { fontWeight: 500, color: 'text.secondary' } }}
        />

        <Button
          type="submit"
          variant="contained"
          startIcon={<AddCircleOutline />}
          disabled={mutation.isPending || !title.trim() || !content.trim()}
          sx={{
            fontFamily: 'Product Sans',
            mt: 2,
            py: 1.5,
            borderRadius: 2,
            fontSize: 16,
            fontWeight: 700,
            textTransform: 'uppercase',
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 16px rgba(79, 172, 254, 0.4)',
              background: 'linear-gradient(45deg, #3ca0e6 0%, #00d9e4 100%)',
            },
          }}
        >
          {mutation.isPending ? 'Creating...' : 'Create Note'}
        </Button>
      </Box>
    </Paper>
  );
};

export default NoteForm;
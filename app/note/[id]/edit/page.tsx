// app/note/[id]/edit/page.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../../../../context/notesStore'; // Adjust path
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import React from 'react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

async function fetchNote(id: string): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch note');
  return res.json();
}

async function updateNoteApi({ id, title, content }: { id: string; title: string; content: string }): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

const EditNote = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params); // Unwrap params with React.use()
  const id = resolvedParams.id;
  const router = useRouter();
  const { title, content, setTitle, setContent, updateNote, resetNoteForm } = useAppStore();
  const queryClient = useQueryClient();

  const { data: note, isLoading } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNote(id),
  });

  const mutation = useMutation({
    mutationFn: updateNoteApi,
    onSuccess: (updatedNote) => {
      updateNote(id, updatedNote); // Update store with API response
      queryClient.invalidateQueries({ queryKey: ['notes'] }); // Refresh NotesList
      resetNoteForm(); // Clear form state
      router.push(`/note/${id}`); // Redirect to detail page
    },
    onError: (error) => {
      console.error('Failed to update note:', error);
    },
  });

  // Pre-fill form only if title and content are empty (initial load)
  useEffect(() => {
    if (note && !title && !content) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note, title, content, setTitle, setContent]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    mutation.mutate({ id, title, content });
  };

  if (isLoading || !note) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading note...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <IconButton
            onClick={() => router.back()}
            sx={{ mb: 2, color: 'primary.main', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}
          >
            <ArrowBack />
          </IconButton>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Alkalami',
            }}
          >
            Edit Note
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, fontFamily: 'Product Sans' }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={6}
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
            startIcon={<Save />}
            disabled={mutation.isPending || !title.trim() || !content.trim()}
            sx={{
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
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditNote;
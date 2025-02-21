// app/components/NotesList.tsx
"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../../context/notesStore';
import { format } from 'date-fns';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color?: string;
}

async function fetchNotes(): Promise<Note[]> {
  const response = await fetch('/api/notes');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to fetch notes (status: ${response.status})`);
  }
  const data = await response.json();
  console.log('Raw API response:', data);
  if (!Array.isArray(data)) {
    console.error('Expected an array, got:', data);
    return [];
  }
  return data;
}

async function deleteNote(id: string) {
  const response = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete note');
  return response.json();
}

const NotesList = () => {
  const {
    notes,
    deleteCandidate,
    isDeleting,
    setNotes,
    deleteNote: removeNoteFromStore,
    setDeleteCandidate,
    setIsDeleting,
  } = useAppStore();

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  const [isShowingLoader, setIsShowingLoader] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isLoading && data) {
      console.log('Data fetched, setting notes:', data);
      setNotes(data);
      // Ensure loader shows for at least 4 seconds from component mount
      timeout = setTimeout(() => {
        setIsShowingLoader(false);
      }, 4000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading, data, setNotes]);

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onMutate: (id) => {
      removeNoteFromStore(id);
      setIsDeleting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onSettled: () => {
      setIsDeleting(false);
      setDeleteCandidate(null);
    },
  });

  const getNoteColor = (id: string) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)',
      'linear-gradient(135deg, #743ad5 0%, #d53a9d 100%)',
      'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
      'linear-gradient(135deg, #9f7aea 0%, #667eea 100%)',
      'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)',
      'linear-gradient(135deg, #ff5858 0%, #f09819 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    ];
    const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  const handleDeleteInit = (id: string) => {
    setDeleteCandidate(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteCandidate) return;
    deleteMutation.mutate(deleteCandidate);
  };

  // Show loader until both data is fetched and 4 seconds have passed
  if (isShowingLoader) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress
          size={80}
          thickness={5}
          sx={{
            color: '#42a5f5', // Lighter blue
            animationDuration: '1s',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: '#42a5f5',
            fontFamily: 'Product Sans',
            fontWeight: 600,
          }}
        >
          Loading Your Notes...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading notes: {(error as Error).message}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Dialog
        open={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        PaperProps={{ sx: { borderRadius: 3, background: 'linear-gradient(145deg, #ffffff, #f8f9fa)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Product Sans',
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontFamily: 'Product Sans' }}>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 2 }}>
          <Button
            onClick={() => setDeleteCandidate(null)}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none', px: 3, fontFamily: 'Product Sans', color: 'text.secondary' }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={isDeleting}
            sx={{
              borderRadius: 2,
              fontFamily: 'Product Sans',
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(45deg, #ff6b6b 0%, #ff8787 100%)',
              '&:hover': { boxShadow: '0 4px 16px rgba(255,107,107,0.4)' },
            }}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: 700, fontFamily: 'Product Sans', color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}
      >
        Your Notes
        <Chip
          label={`${notes.length} items`}
          variant="outlined"
          sx={{ borderRadius: 1, fontFamily: 'Product Sans', borderColor: 'primary.main', color: 'primary.main' }}
        />
      </Typography>

      <Grid container spacing={3}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id} sx={{ mb: { xs: 5, sm: 4 } }}>
              <Paper
                elevation={2}
                sx={{
                  p: 2.5,
                  height: '100%',
                  borderRadius: 3,
                  background: note.color || getNoteColor(note.id),
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.15)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, zIndex: 2 }}>
                  <Chip
                    label="Note Management"
                    size="small"
                    sx={{ bgcolor: 'rgba(0,0,0, 0.3)', color: 'common.white', fontWeight: 600, fontFamily: 'Product Sans', borderRadius: 1, backdropFilter: 'blur(4px)' }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'Product Sans', mb: 1, color: 'common.black', zIndex: 2 }}>
                  {note.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 2, fontFamily: 'Merriweather', color: 'grey.800', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', zIndex: 2 }}
                >
                  {note.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)', zIndex: 2 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(0, 0, 0, 0.6)', fontFamily: 'Alkalami', fontSize: 12 }}>
                    {format(new Date(note.createdAt), 'MMM dd, yyyy - HH:mm')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Link href={`/note/${note.id}`} passHref>
                      <IconButton sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' } }}>
                        <Edit sx={{ color: 'common.black' }} />
                      </IconButton>
                    </Link>
                    <IconButton
                      onClick={() => handleDeleteInit(note.id)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' } }}
                      disabled={isDeleting}
                    >
                      <Delete sx={{ color: 'common.black' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', textAlign: 'center', p: 4, color: 'text.secondary' }}>
              <Typography variant="h6" sx={{ fontFamily: 'Product Sans' }}>
                No notes found
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontFamily: 'Product Sans' }}>
                Create your first note using the &quot;+&quot; button above
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default NotesList;
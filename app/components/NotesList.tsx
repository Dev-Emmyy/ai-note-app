"use client";
import { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Chip, IconButton, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button 
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  color?: string;
}

const noteColors = [
  'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
  'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
  'linear-gradient(120deg, #f6d365 0%, #fda085 100%)'
];

const getNoteColor = (id: string) => {
  const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return noteColors[hash % noteColors.length];
};

const NotesList = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data: Note[]) => {
        const notesWithColors = data.map(note => ({
          ...note,
          color: getNoteColor(note.id)
        }));
        setNotes(notesWithColors);
      })
      .catch(console.error);
  };

  const handleDeleteInit = (id: string) => {
    setDeleteCandidate(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/notes/${deleteCandidate}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter(note => note.id !== deleteCandidate));
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setDeleteCandidate(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete this note? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 2 }}>
          <Button 
            onClick={() => setDeleteCandidate(null)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              color: 'text.secondary'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={isDeleting}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(45deg, #ff6b6b 0%, #ff8787 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(255,107,107,0.4)'
              }
            }}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notes List */}
      <Typography variant="h4" sx={{ 
        mb: 4,
        fontWeight: 700,
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        Your Notes
        <Chip label={`${notes.length} items`} variant="outlined" sx={{ 
          borderRadius: 1,
          borderColor: 'primary.main',
          color: 'primary.main'
        }} />
      </Typography>

      <Grid container spacing={3}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Paper elevation={2} sx={{
                p: 2.5,
                height: '100%',
                borderRadius: 3,
                background: note.color,
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255, 255, 255, 0.15)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }
              }}>
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  position: 'relative',
                  zIndex: 2
                }}>
                  <Chip
                    label="Note Management"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      color: 'common.white',
                      fontWeight: 600,
                      borderRadius: 1,
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  mb: 1,
                  color: 'common.black',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {note.title}
                </Typography>

                <Typography variant="body2" sx={{
                  mb: 2,
                  color: 'grey.800',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {note.content}
                </Typography>

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                  pt: 2,
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  zIndex: 2
                }}>
                  <Typography variant="caption" sx={{ 
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontSize: 12
                  }}>
                    {format(new Date(note.createdAt), "MMM dd, yyyy - HH:mm")}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Link href={`/note/${note.id}`}>
                      <IconButton sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                        }
                      }}>
                        <Edit sx={{ color: 'common.black' }}/>
                      </IconButton>
                    </Link>
                    <IconButton 
                      onClick={() => handleDeleteInit(note.id)}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                        }
                      }}
                    >
                      <Delete sx={{ color: 'common.black' }} />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ 
              width: '100%', 
              textAlign: 'center', 
              p: 4,
              color: 'text.secondary'
            }}>
              <Typography variant="h6">No notes found</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
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
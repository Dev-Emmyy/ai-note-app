"use client";
import { useState} from "react";
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


interface NotesListProps {
  notes: Note[];
}

const NotesList = ({ notes }: NotesListProps) => {
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const getNoteColor = (id: string) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple to pink
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue to teal
      'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)', // Coral to pink
      'linear-gradient(135deg, #743ad5 0%, #d53a9d 100%)', // Deep purple to magenta
      'linear-gradient(135deg, #f83600 0%, #f9d423 100%)', // Fiery orange to yellow
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Mint to aqua
      'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)', // Coral to peach
      'linear-gradient(135deg, #9f7aea 0%, #667eea 100%)', // Lavender to periwinkle
      'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)', // Sky to periwinkle
      'linear-gradient(135deg, #ff5858 0%, #f09819 100%)', // Red to orange
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Ice to pink
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'  // Pink to coral
    ];
  const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
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
        // Refresh the page to reflect changes
        window.location.reload();
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
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Product sans',
        }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary', fontFamily: 'Product sans', }}>
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
              fontFamily: 'Product sans',
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
              fontFamily: 'Product sans',
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
        fontFamily: 'Product sans',
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        Your Notes
        <Chip label={`${notes.length} items`} variant="outlined" sx={{ 
          borderRadius: 1,
          fontFamily: 'Product sans',
          borderColor: 'primary.main',
          color: 'primary.main'
        }} />
      </Typography>

      <Grid container spacing={3}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id} sx={{ mb: { xs: 5, sm: 0 }}}>
              <Paper elevation={2} sx={{
                p: 2.5,
                height: '100%',
                borderRadius: 3,
                background: getNoteColor(note.id),
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
                      bgcolor: 'rgba(0,0,0, 0.3)',
                      color: 'common.white',
                      fontWeight: 600,
                      fontFamily: 'Product sans',
                      borderRadius: 1,
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontFamily: 'Product sans',
                  mb: 1,
                  color: 'common.black',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {note.title}
                </Typography>

                <Typography variant="body2" sx={{
                  mb: 2,
                  fontFamily: 'Alkalami',
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
                    fontFamily: 'Alkalami',
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
          <Grid 
            item 
            xs={12} 
            sx={{ 
              minHeight: '50vh',  // Add minimum height to ensure vertical centering works
              display: 'flex',    // Make the Grid item itself a flex container
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                textAlign: 'center',
                p: 4,
                color: 'text.secondary',
              }}
            >
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
import { Box, Typography, Button, Paper, IconButton, Chip } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Edit, Delete, ArrowBack } from "@mui/icons-material";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default async function NoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  if (resolvedParams.id === "new") {
    redirect("/note/new");
    return null;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/notes/${resolvedParams.id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Paper elevation={3} sx={{ 
          p: 4,
          borderRadius: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Note not found
          </Typography>
          <Link href="/" passHref>
            <Button 
              variant="contained" 
              startIcon={<ArrowBack />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1
              }}
            >
              Back to Home
            </Button>
          </Link>
        </Paper>
      </Box>
    );
  }

  const note: Note = await res.json();

  return (
    <Box sx={{ 
      maxWidth: 800,
      mx: 'auto',
      p: 3
    }}>
      <Paper elevation={3} sx={{ 
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ mb: 3 }}>
          <Link href="/" passHref>
            <IconButton sx={{ 
              mb: 2,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)'
              }
            }}>
              <ArrowBack />
            </IconButton>
          </Link>
          
          <Chip
            label="Product Management"
            size="medium"
            sx={{
              bgcolor: '#e8f4ff',
              color: 'primary.dark',
              fontWeight: 600,
              borderRadius: 1,
              mb: 2
            }}
          />

          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {note.title}
          </Typography>

          <Typography variant="caption" sx={{ 
            color: 'text.secondary',
            fontSize: 14
          }}>
            Created: {format(new Date(note.createdAt), "MMM dd, yyyy - HH:mm")}
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ 
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          mb: 3
        }}>
          <Typography variant="body1" sx={{ 
            lineHeight: 1.8,
            color: 'text.primary',
            whiteSpace: 'pre-wrap'
          }}>
            {note.content}
          </Typography>
        </Paper>

        <Box sx={{ 
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-end',
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: 3
        }}>
          <Link href={`/note/${note.id}/edit`} passHref>
            <Button
              variant="contained"
              startIcon={<Edit />}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(79, 172, 254, 0.4)'
                }
              }}
            >
              Edit Note
            </Button>
          </Link>
          
          <Button
            variant="outlined"
            startIcon={<Delete />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.08)',
                borderColor: 'error.dark'
              }
            }}
          >
            Delete
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
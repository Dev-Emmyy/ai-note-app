import { Box, Typography, Button, Paper, IconButton, Chip } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Edit, Delete, ArrowBack, AccessTime } from "@mui/icons-material";
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
          <Typography variant="h5" sx={{ mb: 2 , fontFamily: "Product Sans", }}>
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
                py: 1,
                fontFamily: "Product Sans", 
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
  maxWidth: { xs: '100%', md: 800 },
  mx: 'auto',
  p: { xs: 2, md: 3 },
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center'
}}>
  <Paper elevation={3} sx={{ 
    p: { xs: 2, md: 4 },
    borderRadius: 4,
    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: -20,
      right: -20,
      width: 120,
      height: 120,
      background: 'linear-gradient(45deg, #4facfe30 0%, #00f2fe30 100%)',
      borderRadius: '50%',
      filter: 'blur(40px)'
    }
  }}>
    {/* Header Section */}
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2
      }}>
        <Link href="/" passHref>
          <IconButton sx={{ 
            color: 'primary.main',
            p: 1,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)'
            }
          }}>
            <ArrowBack />
            <Typography variant="body2" sx={{ 
              ml: 1,
              display: { xs: 'none', sm: 'block' },
              fontFamily: 'Product Sans',
              fontWeight: 500
            }}>
              Back to Notes
            </Typography>
          </IconButton>
        </Link>
        
        <Chip
          label="Personal Note"
          size="medium"
          sx={{
            bgcolor: '#f0f4ff',
            color: 'primary.dark',
            fontWeight: 600,
            borderRadius: 2,
            height: 32,
            fontFamily: 'Product Sans'
          }}
        />
      </Box>

      <Typography variant="h1" sx={{ 
        fontWeight: 800,
        fontSize: { xs: '1.75rem', md: '2.5rem' },
        fontFamily: "Product Sans",
        mb: 1,
        background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1.2
      }}>
        {note.title}
      </Typography>

      <Typography variant="caption" sx={{ 
        color: 'text.secondary',
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        fontFamily: 'Product Sans'
      }}>
        <AccessTime fontSize="small" sx={{ fontSize: 16 }} />
        {format(new Date(note.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
      </Typography>
    </Box>

    {/* Content Section */}
    <Paper elevation={0} sx={{ 
      p: { xs: 2, md: 3 },
      borderRadius: 3,
      bgcolor: 'background.paper',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      minHeight: 200,
      mb: 3,
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-2px)',
        transition: 'transform 0.3s ease'
      }
    }}>
      <Typography variant="body1" sx={{ 
        lineHeight: 1.8,
        color: 'text.primary',
        whiteSpace: 'pre-wrap',
        fontFamily: 'Merriweather',
        fontSize: { xs: 16, md: 17 },
        '&:first-letter': {
          initialLetter: 2,
          fontWeight: 700,
          color: 'primary.main',
          mr: 0.5
        }
      }}>
        {note.content}
      </Typography>
    </Paper>

    {/* Action Buttons */}
    <Box sx={{ 
      display: 'flex',
      gap: 2,
      flexDirection: { xs: 'column', sm: 'row' },
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
            fontFamily: "Product Sans",
            borderRadius: 2,
            px: 4,
            py: 1.5,
            textTransform: 'none',
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(79, 172, 254, 0.3)',
              transition: 'all 0.3s ease'
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
          fontFamily: "Product Sans",
          borderRadius: 2,
          px: 4,
          py: 1.5,
          textTransform: 'none',
          borderWidth: 2,
          borderColor: 'error.main',
          color: 'error.main',
          width: { xs: '100%', sm: 'auto' },
          '&:hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.08)',
            borderColor: 'error.dark',
            borderWidth: 2
          }
        }}
      >
        Delete Note
      </Button>
    </Box>
  </Paper>
</Box>
  );
}
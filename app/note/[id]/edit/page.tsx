"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, TextField, Button, Typography, Paper, IconButton } from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const EditNote = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/notes/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch note");
        const data: Note = await res.json();
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error("Failed to fetch note:", error);
      }
    };

    fetchNote();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/notes/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error("Failed to update note");
      router.push(`/note/${params.id}`);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  if (!note) {
    return (
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Typography>Loading note...</Typography>
      </Box>
    );
  }

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
          <IconButton 
            onClick={() => router.back()}
            sx={{ 
              mb: 2,
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)'
              }
            }}
          >
            <ArrowBack />
          </IconButton>

          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            mb: 3,
            background: 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Edit Note
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleUpdate} sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 3 
        }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderWidth: 2,
                  borderColor: 'primary.main',
                },
              },
            }}
            InputLabelProps={{
              sx: {
                fontWeight: 500,
                color: 'text.secondary',
              }
            }}
          />

          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={6}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderWidth: 2,
                  borderColor: 'primary.main',
                },
              },
            }}
            InputLabelProps={{
              sx: {
                fontWeight: 500,
                color: 'text.secondary',
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
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
              }
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditNote;
"use client";
import { useState } from "react";
import { Box, TextField, Button, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // Add createdAt property
}

const NoteForm = ({ onNoteCreated }: { onNoteCreated: (note: Note) => void }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim() || !content.trim()) return;

  const newNote: Note = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString(), // Ensure createdAt is added
  };

  const response = await fetch("/api/notes", {
    method: "POST",
    body: JSON.stringify(newNote),
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    onNoteCreated(newNote); // Pass complete Note object
    setTitle("");
    setContent("");
    setOpen(false);
  }
};


  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
      <Fab color="primary" onClick={() => setOpen(true)}>
        <AddIcon />
      </Fab>

      {open && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            bottom: 70,
            right: 0,
            width: 300,
            p: 2,
            bgcolor: "white",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Create Note
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NoteForm;

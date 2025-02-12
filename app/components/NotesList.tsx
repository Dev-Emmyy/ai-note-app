"use client";
import { useEffect, useState } from "react";
import NoteCard from "./NoteCard";
import NoteForm from "./NoteForm";
import { Box, Typography } from "@mui/material";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // Ensure createdAt is included
}

const NotesList = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch('/api/notes')
      .then((res: Response) => res.json())
      .then((data: Note[]) => setNotes(data))
      .catch((err: Error) => console.error("Failed to fetch notes:", err));
  }, []);

  const handleNewNote = (newNote: Note) => {
    setNotes((prev: Note[]) => [newNote, ...prev]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your Notes
      </Typography>
      {notes.length > 0 ? (
        notes.map((note) => <NoteCard key={note.id} note={note} />)
      ) : (
        <Typography>No notes available</Typography>
      )}
      <NoteForm onNoteCreated={handleNewNote} />
    </Box>
  );
};

export default NotesList;

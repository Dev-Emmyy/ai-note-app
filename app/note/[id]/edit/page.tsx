"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button } from "@mui/material";

const EditNote = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [note, setNote] = useState({ title: "", content: "" });

  useEffect(() => {
    fetch(`/api/note/${params.id}`)
      .then((res) => res.json())
      .then((data) => setNote(data));
  }, [params.id]);

  const handleUpdate = async () => {
    await fetch(`/api/note/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(note),
    });
    router.push(`/note/${params.id}`);
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Content"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        fullWidth
        multiline
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleUpdate}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditNote;

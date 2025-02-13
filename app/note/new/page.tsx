"use client";

import NoteForm from "../../components/NoteForm";
import { Box } from "@mui/material";

const NewNotePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <NoteForm />
    </Box>
  );
};

export default NewNotePage;
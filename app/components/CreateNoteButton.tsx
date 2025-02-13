"use client";

import { useRouter } from "next/navigation";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";

const CreateNoteButton: React.FC = () => {
  const router = useRouter();

  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
      <Fab color="primary" onClick={() => router.push("/note/new")}>
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default CreateNoteButton;



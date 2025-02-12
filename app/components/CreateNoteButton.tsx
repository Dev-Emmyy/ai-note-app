"use client";

import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";

const CreateNoteButton: React.FC = () => {
  return (
    <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
      <Fab color="primary">
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default CreateNoteButton;


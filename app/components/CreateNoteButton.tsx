"use client";
import { useRouter } from "next/navigation";
import { Box, Fab, SxProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React from "react";


interface CreateNoteButtonProps {
  sx?: SxProps;
}

const CreateNoteButton: React.FC<CreateNoteButtonProps> = ({ sx }) => {
  const router = useRouter();

  const handleCreateNote = () => {
    
    router.push(`/note/new`);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 32,
        right: 32,
        ...sx, // Merge custom styles
      }}
    >
      <Fab
        color="primary"
        onClick={handleCreateNote}
        sx={{
          background:
            "linear-gradient(135deg, #4a90e2 0%, #9013fe 100%)",
          color: "white",
          width: 56,
          height: 56,
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 8px 24px rgba(148, 66, 255, 0.3)",
            background:
              "linear-gradient(135deg, #3b7dcc 0%, #7e0ed9 100%)",
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>
    </Box>
  );
};

export default CreateNoteButton;
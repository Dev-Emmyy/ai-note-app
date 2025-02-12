"use client";

import { Box, IconButton, InputBase, Paper } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import React, { useState } from "react";

const HomeHeader: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
      {/* Search Bar */}
      <Paper
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          px: 2,
          py: 1,
          borderRadius: "20px",
          backgroundColor: "grey.100",
        }}
      >
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Search for notes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      {/* Notification Icon */}
      <IconButton sx={{ ml: 2 }}>
        <NotificationsNoneIcon />
      </IconButton>
    </Box>
  );
};

export default HomeHeader;

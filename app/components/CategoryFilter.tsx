"use client";

import { Box, Button } from "@mui/material";
import React, { useState } from "react";

const categories = ["All", "Important", "Lecture notes", "To-do lists", "Shopping"];

const CategoryFilter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <Box sx={{ display: "flex", gap: 1, overflowX: "auto", px: 2, py: 1 }}>
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => setActiveCategory(category)}
          sx={{
            px: 2,
            py: 1,
            borderRadius: 5,
            fontSize: "0.8rem",
            backgroundColor: activeCategory === category ? "black" : "grey.200",
            color: activeCategory === category ? "white" : "black",
          }}
        >
          {category}
        </Button>
      ))}
    </Box>
  );
};

export default CategoryFilter;

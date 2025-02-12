"use client";

import { Box, Button } from "@mui/material";
import React, { useState } from "react";

const days = [
  { day: "Tue", date: 23 },
  { day: "Wed", date: 24 },
  { day: "Thu", date: 25 },
  { day: "Fri", date: 26 },
  { day: "Sat", date: 27 },
  { day: "Sun", date: 28 },
];

const DateSelector: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(23);

  return (
    <Box sx={{ display: "flex", gap: 1, overflowX: "auto", px: 2, py: 1 }}>
      {days.map((d) => (
        <Button
          key={d.date}
          onClick={() => setSelectedDate(d.date)}
          sx={{
            flexDirection: "column",
            minWidth: 60,
            borderRadius: 2,
            backgroundColor: selectedDate === d.date ? "black" : "grey.200",
            color: selectedDate === d.date ? "white" : "black",
          }}
        >
          <span style={{ fontSize: "0.8rem" }}>{d.day}</span>
          <span style={{ fontWeight: "bold" }}>{d.date}</span>
        </Button>
      ))}
    </Box>
  );
};

export default DateSelector;

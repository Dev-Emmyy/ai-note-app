"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  SxProps,
  Theme
} from "@mui/material";


interface ChatMessage {
  role: string; // 'user' or 'ai'
  content: string;
}


const AIChat = ({ sx }: { sx?: SxProps<Theme> }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      // Add user message to chat history
      const updatedHistory = [
        ...chatHistory,
        { role: "user", content: message },
      ];

      // Call the chat API with a prompt for note-writing ideas
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory,
          context: "Provide creative and concise ideas for writing notes.", // Optional context for note-writing
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      const aiResponse = data.result;

      // Add AI response to chat history
      setChatHistory([
        ...updatedHistory,
        { role: "ai", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory([
        ...chatHistory,
        { role: "user", content: message },
        {
          role: "ai",
          content:
            "Sorry, something went wrong. Please try again or rephrase your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <Box sx={{ p: 2 ,...sx,
    '& .MuiTextField-root': {
      mb: { xs: 1, sm: 2 }
    } }}>
      {/* Chat History */}
      <Box sx={{ mb: 2, maxHeight: "60vh", overflowY: "auto" }}>
        {chatHistory.map((msg, i) => (
          <Paper
            key={i}
            sx={{
              p: 2,
              mb: 1,
              bgcolor: msg.role === "user" ? "grey.100" : "primary.light",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              ml: msg.role === "ai" ? 0 : "auto",
            }}
          >
            <Typography variant="body1">{msg.content}</Typography>
          </Paper>
        ))}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Input Field */}
      <TextField
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything... or get note-writing ideas!"
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        disabled={isLoading}
      />

      {/* Send Button */}
      <Button
        onClick={handleSend}
        variant="contained"
        sx={{ mt: 2 }}
        disabled={isLoading || !message.trim()}
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </Box>
  );
};

export default AIChat;
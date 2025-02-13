// components/NoteCard.tsx
"use client";

import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  // Truncate content to a snippet (e.g., first 50 characters)
  const snippet = note.content.length > 50 ? note.content.slice(0, 50) + "..." : note.content;

  return (
    <Link href={`/note/${note.id}`}>
      <Card sx={{ mb: 2 }}>
        <CardActionArea>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {note.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {snippet}
            </Typography>
            <Typography variant="caption" color="grey.600" sx={{ mt: 1, display: "block" }}>
              {new Date(note.createdAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default NoteCard;

import { Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  createdAt: string;
}

const NoteCard = ({ note }: { note: Note }) => {
  return (
    <Link href={`/note/${note.id}`} passHref>
      <Card sx={{ mb: 2, cursor: "pointer" }}>
        <CardContent>
          <Typography variant="h6">{note.title}</Typography>
          <Typography sx={{ color: "gray", fontSize: "14px" }}>
            {new Date(note.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NoteCard;

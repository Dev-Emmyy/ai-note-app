import { Box, Typography } from "@mui/material";

const NoteDetail = async ({ params }: { params: { id: string } }) => {
  const res = await fetch(`/api/note/${params.id}`);
  const note = await res.json();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4">{note.title}</Typography>
      <Typography sx={{ mt: 2 }}>{note.content}</Typography>
    </Box>
  );
};

export default NoteDetail;

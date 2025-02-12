import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

// GET Single Note
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(note);
}

// PUT - Update Note
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, content } = await req.json();
  const updatedNote = await prisma.note.update({
    where: { id: params.id },
    data: { title, content },
  });
  return NextResponse.json(updatedNote);
}

import { NextResponse } from "next/server";
import prisma from "@/libs/prisma"; // Assuming prisma is set up in /libs/prisma.ts

// GET all notes sorted by created date
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

// POST - Create a new note
export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();
    const newNote = await prisma.note.create({
      data: { title, content },
    });
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

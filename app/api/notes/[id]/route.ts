import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Await the params object to access its properties
    const resolvedParams = await params;

    // Use the resolved ID in the query
    const note = await prisma.note.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
 ) {
  try {
    // Await the params object to access its properties
    const resolvedParams = await params;

    // Parse the request body
    const { title, content } = await req.json();

    // Update the note in the database
    const updatedNote = await prisma.note.update({
      where: { id: resolvedParams.id },
      data: { title, content },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object to access its properties
    const resolvedParams = await params;

    // Delete the note from the database
    await prisma.note.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // adjust path if needed



export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("POST body:", body);

    if (!body || typeof body !== "object") {
      console.error("Invalid request body received:", body);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { title, content } = body;
    if (!title || !content) {
      console.error("Missing fields. Received:", body);
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Create the note associated with the logged-in user
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        user: { connect: { id: session.user.id } },
      },
    });

    console.log("Created note:", newNote);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in POST /api/notes:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


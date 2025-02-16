import prisma from "@/libs/prisma";
import bcrypt from "bcryptjs";

interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Add logging to debug request
    console.log('Received signup request');
    
    if (!req.body) {
      console.error('Request body is null');
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }

    const body = await req.json().catch(e => {
      console.error('JSON parsing error:', e);
      return null;
    });

    if (!body) {
      return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
        status: 400,
      });
    }

    const { name, email, password } = body as SignupRequest;

    // Validate required fields
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields",
          missingFields: {
            name: !name,
            email: !email,
            password: !password
          }
        }), 
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify({ success: true, user }), { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Server error", 
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
      }), 
      { status: 500 }
    );
  }
}
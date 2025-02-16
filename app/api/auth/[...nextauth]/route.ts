// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/auth"; // Update path to your auth.ts file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
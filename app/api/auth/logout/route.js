import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  // The actual logout is handled by NextAuth.js client-side
  return new NextResponse(
    JSON.stringify({ message: "Logged out successfully" }),
    { status: 200 }
  );
}

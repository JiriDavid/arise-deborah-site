// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../[...nextauth]/route";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
//       status: 401,
//     });
//   }

//   return new NextResponse(
//     JSON.stringify({ authenticated: true, user: session.user }),
//     { status: 200 }
//   );
// }

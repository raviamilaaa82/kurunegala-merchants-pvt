import { sql } from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("uname")?.trim().toLowerCase();

    if (!userName) return Response.json({ exists: false });

    const result = await sql`
    SELECT 1 FROM users 
    WHERE LOWER(user_name) = ${userName}
    LIMIT 1
  `;

    return Response.json({ exists: result.length > 0 });
}
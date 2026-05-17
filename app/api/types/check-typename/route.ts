import { sql } from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const typeName = searchParams.get("type")?.trim().toLowerCase();

    if (!typeName) return Response.json({ exists: false });

    const result = await sql`
    SELECT 1 FROM types 
    WHERE LOWER(type) = ${typeName}
    LIMIT 1
  `;

    return Response.json({ exists: result.length > 0 });
}
import { sql } from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const branchName = searchParams.get("branch")?.trim().toLowerCase();

    if (!branchName) return Response.json({ exists: false });

    const result = await sql`
    SELECT 1 FROM branches 
    WHERE LOWER(branch) = ${branchName}
    LIMIT 1
  `;

    return Response.json({ exists: result.length > 0 });
}
import { sql } from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim().toLowerCase();
    console.log("code" + code);
    if (!code) return Response.json({ exists: false });

    const result = await sql`
    SELECT 1 FROM customers 
    WHERE LOWER(cust_code) = ${code}
    LIMIT 1
  `;

    return Response.json({ exists: result.length > 0 });
}
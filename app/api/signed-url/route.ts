import { NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("file");

    if (!key) return NextResponse.json({ error: "No file" }, { status: 400 });

    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,

    });

    const signedUrl = await getSignedUrl(r2 as unknown as S3Client, command, {
        expiresIn: 600,
    });

    //new code to 
    // Proxy the image bytes — Next.js Image component fetches from localhost
    // const r2Response = await fetch(signedUrl);
    // const buffer = await r2Response.arrayBuffer(); // this is via server brower so i am going get direct from r2

    return NextResponse.json({ url: signedUrl });
    // return new Response(buffer, {
    //     headers: {
    //         "Content-Type": r2Response.headers.get("Content-Type") || "image/jpeg",
    //         "Cache-Control": "private, max-age=300", // cache for 5 min
    //     },
    // });
}
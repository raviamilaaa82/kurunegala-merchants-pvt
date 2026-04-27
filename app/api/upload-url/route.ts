import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
    const { documentId, fileName, fileType } = await req.json();

    if (!documentId || !fileName || !fileType) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // const key = `documents/${documentId}/${randomUUID()}-${fileName}`;
    const key = `temp/${documentId}/${randomUUID()}-${fileName}`;
    const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
            ContentType: fileType,
        }),
        { expiresIn: 60 }
    );
    return NextResponse.json({ signedUrl, key });
}
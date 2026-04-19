import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
    const form = await req.formData();
    const file = form.get("file") as File;
    const documentId = form.get("documentId") as string;

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());

    const key = `documents/${documentId}/${randomUUID()}-${file.name}`;

    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        })
    );

    return NextResponse.json({
        key,
        url: `/api/signed-url?file=${encodeURIComponent(key)}`,
    });

}
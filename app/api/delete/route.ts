import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function DELETE(req: Request) {
    const { key } = await req.json();

    if (!key) return NextResponse.json({ error: "No key" }, { status: 400 });

    await r2.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,

        })
    );
    return NextResponse.json({ success: true });
}
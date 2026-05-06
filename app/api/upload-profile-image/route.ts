
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from 'crypto';
// import { saveProfileImageUrl } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 1 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        // const userId = formData.get("userId") as string | null;

        if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });
        // if (!userId) return NextResponse.json({ error: "No userId provided." }, { status: 400 });
        if (!ALLOWED_TYPES.includes(file.type))
            return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
        if (file.size > MAX_SIZE)
            return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });

        function shortUUID() {
            return Buffer.from(randomUUID()).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12).toLowerCase();
        }
        const uniqueId = shortUUID(); //creating uniqueid for image
        const ext = file.name.split(".").pop() ?? "jpg";
        //const filename = `${uniqueId}-${Date.now()}.${ext}`;
        const filename = `${uniqueId}.${ext}`;

        await mkdir(UPLOAD_DIR, { recursive: true });
        await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

        const publicUrl = `/uploads/${filename}`;

        // await saveProfileImageUrl(userId, publicUrl);

        return NextResponse.json({ url: publicUrl, message: "Profile picture updated." });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}







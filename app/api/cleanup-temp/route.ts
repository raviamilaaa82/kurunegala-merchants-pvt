import { NextResponse } from "next/server";
import { r2 } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

type FileMapping = {
    documentId: string;
    keys: string[]; // ← keys is string[], so key is inferred as string
};
export async function POST(request: Request) {
    try {
        // const { keys } = await request.json();
        const { mappings } = await request.json();


        if (!mappings || !Array.isArray(mappings)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }




        for (const mapping of mappings as FileMapping[]) {
            const { keys } = mapping;
            if (!keys?.length) continue; // ← skip empty mappings

            await Promise.all(
                keys.map(async (key) => {
                    try {
                        await r2.send(new DeleteObjectCommand({
                            Bucket: process.env.R2_BUCKET!,
                            Key: key,
                        }));
                    } catch (err) {
                        console.error("Error deleting key:", key, err);
                        // continues deleting others even if one fails
                    }
                })
            );
        }

        return NextResponse.json({ success: true });
        // return NextResponse.json({ success: true, deleted: keys.length });
    } catch (err) {
        console.error("cleanup-temp error", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

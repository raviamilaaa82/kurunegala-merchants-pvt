
import { NextResponse } from "next/server";
import { r2 } from "@/lib/r2"; // your R2 client
import postgres from 'postgres';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fetchImageListFromLocalDb, fetchImagesKeysbWithSubmission } from "@/app/lib/data";

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    // const masterId = searchParams.get("masterId");
    // original code is above
    const submissionId = searchParams.get("submissionId");

    // if (!masterId) {
    //     return NextResponse.json({ error: "Missing masterId" }, { status: 400 });
    // }
    if (!submissionId) {
        return NextResponse.json({ error: "Missing submissionId" }, { status: 400 });
    }
    try {

        // const files = await fetchImageListFromLocalDb(masterId);
        const filesWithSubmi = await fetchImagesKeysbWithSubmission(submissionId);

        // Filter out any records without a file_key
        // const validFiles = filesWithSubmi.filter((file: any) => file?.file_key);
        const validFiles = filesWithSubmi.filter((file: any) => file?.file_key && file.file_key.trim() !== '');
        if (validFiles.length === 0) {
            return NextResponse.json({ images: [] });
        }

        const results = await Promise.allSettled(
            validFiles.map(async (file: any) => {
                const command = new GetObjectCommand({
                    Bucket: process.env.R2_BUCKET!,
                    Key: file.file_key,
                });
                const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600 });
                return {
                    file_key: file.file_key,
                    file_url: signedUrl,
                    file_name: file.file_name,
                    doc_id: file.document_id,
                    doc_type: file.document_type,
                };
            })
        );

        const images = results
            .filter((r) => r.status === 'fulfilled')
            .map((r) => (r as PromiseFulfilledResult<any>).value);

        return NextResponse.json({ images });
    } catch (error) {

    }

}
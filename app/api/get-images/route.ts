
import { NextResponse } from "next/server";
import { r2 } from "@/lib/r2"; // your R2 client
import postgres from 'postgres';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fetchImageListFromLocalDb } from "@/app/lib/data";

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const masterId = searchParams.get("masterId");

    if (!masterId) {
        return NextResponse.json({ error: "Missing masterId" }, { status: 400 });
    }
    try {
        //need to get from lib/data
        // const files = await sql`SELECT cd.id, cd.document_id AS document_id, cd.file_key AS file_key, cd.file_name AS file_name,doc.document AS document_type
        //      FROM public.customer_details cd inner join tbl_documents doc on cd.document_id=doc.id  WHERE cd.master_id = ${masterId}`;
        const files = await fetchImageListFromLocalDb(masterId);

        // const s3 = new S3Client({
        //     region: "auto",
        //     endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
        //     credentials: {
        //         accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        //         secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        //     },
        // });


        // const imagesWithUrls = await Promise.all(
        //     images.map(async (img) => {
        //         const signedUrl = await getSignedUrl(
        //             s3,
        //             new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: img.file_key }),
        //             { expiresIn: 3600 } // 1 hour
        //         );
        //         return { ...img, signedUrl };
        //     })
        // );

        const images = await Promise.all(files.map(async (file: any) => {
            const command = new GetObjectCommand({
                Bucket: process.env.R2_BUCKET!,
                Key: file.file_key,
            });

            const signedUrl = await getSignedUrl(r2, command, { expiresIn: 600, });
            return {
                file_key: file.file_key,
                file_url: signedUrl,
                file_name: file.file_name,
                doc_id: file.document_id,
                doc_type: file.document_type,
                // file_url: `/api/signed-url?file=${encodeURIComponent(file.file_key)}`,
            }

        }));



        return NextResponse.json({ images });
    } catch (error) {

    }

}
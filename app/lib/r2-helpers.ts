import { r2 } from "@/lib/r2";
import { sql } from './db';
import { GetObjectCommand, CopyObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fetchImagesKeyForUploadFinalDoc } from "./data";
import { FinalUploadKey } from "./definitions";

export async function moveToFinal(submissionId: string) {

    // // 1. get all documents for this submission
    //   const docs = await sql`
    //     SELECT id, file_key, file_name 
    //     FROM document 
    //     WHERE submission_id = ${submissionId}
    //     AND deleted_at IS NULL
    //   `;
    const docs = await fetchImagesKeyForUploadFinalDoc(submissionId);
    console.log(docs);

    if (!docs || docs.length === 0) {
        console.warn("No documents found for submission:", submissionId);
        return;
    }

    // 2. move each file
    await Promise.all(
        docs.map(
            async (doc: FinalUploadKey) => {
                const newKey = doc.file_key.replace(/^temp\//, 'documents/');
                console.log(`moving: ${doc.file_key} → ${newKey}`);

                try { // 3. copy to documents/
                    await r2.send(new CopyObjectCommand({
                        Bucket: process.env.R2_BUCKET!,
                        CopySource: `${process.env.R2_BUCKET!}/${doc.file_key}`,
                        Key: newKey,
                    }));

                    // 4. delete from temp/
                    await r2.send(new DeleteObjectCommand({
                        Bucket: process.env.R2_BUCKET!,
                        Key: doc.file_key,
                    }));

                    // 5. update DB with new key
                    await sql`
                UPDATE document 
                SET file_key = ${newKey}
                WHERE id = ${doc.id}
                `;

                    console.log(`✅ moved: ${doc.file_key} → ${newKey}`);
                } catch (error) {
                    // ✅ log which file failed without stopping other files
                    console.error(`❌ failed to move ${doc.file_key}:`, error);
                    throw error; // re-throw so Promise.all catches it
                }
            }));




}
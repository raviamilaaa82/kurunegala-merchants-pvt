import Form from '@/app/ui/customers/upload-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { fetchCustomerById, fetchImageListFromLocalDb, fetchDocuments, fetchImagesKeysbWithSubmission } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { NextResponse } from "next/server";

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ submissionId?: string; name?: string; mode?: string }>;
}) {
    const { id } = await params;           // ✅ await
    const sp = await searchParams;         // ✅ await

    const submissionId = sp?.submissionId ?? undefined;
    const name = sp?.name ?? "";
    // const mode = sp?.mode === 'create' ? 'create' : 'edit';
    const mode = sp?.mode ?? "edit";

    // const [customers, documents] = await Promise.all([
    //     fetchCustomerById(id),

    //     fetchDocuments(),
    // ]);

    const rawFiles = mode === 'edit' && submissionId
        ? await fetchImagesKeysbWithSubmission(submissionId)
        : [];

    // // Log to see what's coming from DB
    // console.log('raw files:', JSON.stringify(rawFiles, null, 2));

    // const validFiles = rawFiles.filter((file: any) => file?.file_key && file.file_key.trim() !== '');
    // if (validFiles.length === 0) {
    //     return NextResponse.json({ images: [] });
    // }




    const [customers, documents, rawImages] = await Promise.all([
        fetchCustomerById(id),
        fetchDocuments(),
        mode === 'edit' && submissionId
            ? fetchImagesKeysbWithSubmission(submissionId)
            : Promise.resolve([]),
    ]);

    //filtering emty images
    const validImages = (rawImages as any[]).filter(
        (file) => file?.file_key && file.file_key.trim() !== ''
    );

    const existingImages = (
        await Promise.allSettled(
            validImages.map(async (file: any) => {
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
        )
    )
        .filter((r) => r.status === 'fulfilled')
        .map((r) => (r as PromiseFulfilledResult<any>).value);


    if (!documents) {
        notFound();
    }
    return (

        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                        label: 'Upload Documents',
                        href: `/dashboard/customers/${id}/upload`,

                        active: true,
                    },
                ]}
            />
            {/* images={images} */}
            <Form documents={documents} customerId={id} subminId={submissionId}
                name={decodeURIComponent(name)} existingImages={mode === 'edit' ? existingImages : []} />
        </main>
    );
}
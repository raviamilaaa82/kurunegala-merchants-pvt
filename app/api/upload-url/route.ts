import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import { randomUUID } from "crypto";
import { auth } from "@/auth";//newly added for creating submission id. for follow request flow
import { createSubmissionRecord, createDocumentRecord } from "@/app/lib/actions";

export async function POST(req: Request) {

    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }//newly added for creating submission id. for follow request flow
    const agentId = session.user.id;//newly added for creating submission id. for follow request flow
    // console.log("from upload-url/route agentid" + agentId);
    // const { documentId, fileName, fileType } = await req.json(); //this is existing code
    const { documentId, fileName, fileType, submissionId, customerId } = await req.json();////newly added for creating submission id. for follow request flow

    if (!documentId || !fileName || !fileType || !customerId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }


    // 2. create submission if first upload
    // let resolvedSubmissionId = submissionId;////newly added for creating submission id. for follow request flow
    // console.log("resolvedSubmissionId" + resolvedSubmissionId);
    //no need now submission id always exists. because its create when customer create
    // if (!resolvedSubmissionId) {
    //     console.log("submissionId" + "true");



    //     const result = await createSubmissionRecord(agentId, customerId, 'draft');
    //     console.log("result" + result);
    //     if (!result.success) {
    //         console.log("!result.success" + result);
    //         return NextResponse.json({ error: result.error }, { status: 500 });
    //     }
    //     resolvedSubmissionId = result.id;
    //     console.log("result.id" + result.id);
    //     // console.log("inside if(!resolvedSubmissionId) upload-url/route first time result.id" + result.id);
    // } else {
    //     console.log("submissionId" + "false");
    // }////newly added for creating submission id. for follow request flow

    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const safeExt = ['jpg', 'jpeg', 'png', 'pdf'].includes(fileExtension) ? fileExtension : 'jpg'; // whitelist
    const key = `temp/${agentId}/${submissionId}/${customerId}/${documentId}/${randomUUID()}.${safeExt}`;





    // const key = `temp/${agentId}/${resolvedSubmissionId}/${customerId}/${documentId}/${randomUUID()}-${fileName}`; //newly key newly added

    const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
            ContentType: fileType,
        }),
        { expiresIn: 60 }
    );


    // 5. save Document record ////newly added for creating submission id. for follow request flow
    // console.log("sending document tble record resolvedSubmissionId" + resolvedSubmissionId + "fileName" + fileName + "key" + key);
    // console.log("values", resolvedSubmissionId, key, fileName, documentId, customerId);
    await createDocumentRecord(submissionId, key, fileName, documentId, customerId);


    // return NextResponse.json({ signedUrl, key });//existing return statement 
    return NextResponse.json({
        signedUrl,
        key,
        submissionId, // ✅ client stores this for next uploads////newly added for creating submission id. for follow request flow
    });
}
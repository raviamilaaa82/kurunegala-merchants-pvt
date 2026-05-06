'use client';

import { CustomerField, Documents } from '@/app/lib/definitions';
import { deleteDocumentByUser, updateSubmissionStatus, SubmissionState } from '@/app/lib/actions';
import { useActionState, useState, useEffect, useRef, useCallback } from 'react';
import FileUploadProgress from "@/components/file-upload-progress-1";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Button } from '@/app/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CustomerErrors = {
    name?: string[];
    uploadedFilesByDocument?: string[];
};


const initialStateStatusUpdate: SubmissionState = { message: null, errors: {} };

export default function UploadForm({ documents, customerId, subminId, name, existingImages = [], roleSlug }: { documents: Documents[], customerId: string, subminId?: string, name: string, existingImages?: any[], roleSlug?: string }) {
    const [updateState, formUpdateAction] = useActionState(
        updateSubmissionStatus,
        initialStateStatusUpdate
    );

    const [submissionId, setSubmissionId] = useState<number | null>(Number(subminId)); //this id setting from fileUploader componente
    // const [custId, setCustId] = useState<string | null>(customerId);
    // const [custName, setCustName] = useState<string | null>(null);
    const [selectedDocumentId, setSelectedDocumentId] = useState('');
    const [selectedDocument, setSelectedDocument] = useState('');
    const [uploadedFilesByDocument, setUploadedFilesByDocument] = useState<
        Record<string, { name: string; key: string; url: string }[]>
    >({});
    const [processingDocs, setProcessingDocs] = useState<Record<string, boolean>>({});
    const [index, setIndex] = useState<number | null>(null);
    const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([]);
    const [rotation, setRotation] = useState(0);
    const [showPdf, setShowPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
    const [localErrors, setLocalErrors] = useState<CustomerErrors>({});
    //      const keptFilesMapping = Object.entries(uploadedFilesByDocument).map(([docId, files]) => ({
    //     documentId: docId,
    //     keys: files.map(f => f.key),
    //   }));

    //   const deletedFilesMapping = Object.entries(deleteQueueByDocument).map(([docId, keys]) => ({
    //     documentId: docId,
    //     keys: keys,
    //   }));
    const router = useRouter();
    //for submit button enable and disable
    useEffect(() => {
        const hasAnyFile = Object.values(uploadedFilesByDocument)
            .some((files: any) => files.length > 0);

        setIsSubmitButtonDisabled(!hasAnyFile);
    }, [uploadedFilesByDocument]);

    useEffect(() => {
        if (existingImages.length === 0) return;
        const grouped: Record<string, { name: string; key: string; url: string }[]> = {};
        existingImages.forEach((img: any) => {
            const docId = String(img.doc_id); // or img.document_id depending on actual key
            if (!grouped[docId]) {
                grouped[docId] = [];
            }
            grouped[docId].push({
                name: img.file_name,
                key: img.file_key,
                url: img.file_url,   // use the pre‑signed URL from the API
            });
        });

        setUploadedFilesByDocument(grouped);
    }, []);

    const clearError = (field: keyof CustomerErrors) => {
        setLocalErrors(prev => {
            const updated = { ...prev };
            delete updated[field];
            return updated;
        });
    };



    const handleDocumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;

        setSelectedDocument(selectedValue);
        setSelectedDocumentId(event.target.value);

    };


    async function handleUploadComplete(file: File, info: { key: string; url: string }) {

        if (!selectedDocumentId) return;
        setProcessingDocs(prev => ({ ...prev, [selectedDocumentId]: true })); // this is for showing loading spinner when adding uploaded files to below list

        //below code is for showing image
        const displayUrl = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : info.url;


        setUploadedFilesByDocument(prev => ({
            ...prev,
            [selectedDocumentId]: [
                ...(prev[selectedDocumentId] || []),
                {
                    name: file.name,
                    key: info.key,
                    url: displayUrl,
                    // url: info.url, // signed URL generator endpoint
                },
            ],
        }));

        await new Promise(resolve => setTimeout(resolve, 1000));
        setProcessingDocs(prev => ({ ...prev, [selectedDocumentId]: false }));// this is for showing loading spinner when adding uploaded files to below list
        // setIsSubmitButtonDisabled(false);

        clearError("uploadedFilesByDocument"); //clearing error


    };
    const getDocumentName = (id: string) =>
        documents.find((d) => d.id === Number(id))?.document || id;



    function getFileType(fileName: string) {
        const ext = fileName.split(".").pop()?.toLowerCase();

        if (!ext) return "unknown";

        if (["jpg", "jpeg", "png"].includes(ext)) return "image";
        if (ext === "pdf") return "pdf";

        return "other";
    }


    async function removeFile(docId: string, key: string) {

        //final code in here delete from r2 + db both
        await deleteDocumentByUser(key);



        setUploadedFilesByDocument((prev) => {
            const updatedFiles = prev[docId].filter(f => f.key !== key);

            const updated = { ...prev };

            if (updatedFiles.length === 0) {
                delete updated[docId]; // remove empty group
            } else {
                updated[docId] = updatedFiles;
            }

            return updated;
        });

    };




    const handleCancel = async () => {
        // if (keptFilesMapping.length > 0) {
        //   const res = await fetch("/api/cleanup-temp", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ mappings: keptFilesMapping }),
        //   });
        //   if (!res.ok) {
        //     console.error("Cleanup failed"); // don't block user, just log
        //   }
        // }

        // router.push('/dashboard/customers');
    }
    return (
        <form action={formUpdateAction} className="w-full sm:w-1/2 md:w-1/2 mx-auto">

            <input type="hidden" name="customerId" value={Number(customerId)} />

            {/* {state.id ? formValues.name : null} */}
            <div className="rounded-md bg-gray-50 p-4 md:p-6">

                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        {name}

                    </label>

                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Document type

                    </label>
                    <div className="relative">
                        <select
                            id="document"
                            name="document"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="document-error"
                            onChange={handleDocumentChange}
                        // disabled={isDropDownEnabled}
                        >
                            <option value="" disabled>
                                Select a document type
                            </option>
                            {documents.map((document) => (
                                <option key={document.id} value={document.id}>
                                    {document.document}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div id="document-error" aria-live="polite" aria-atomic="true">
                        {/* {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative mt-2 rounded-md flex justify-center">
                        <div className="relative">
                            {/* onFilesChange={handleFilesChange} */}
                            <FileUploadProgress key={selectedDocumentId || 'empty'}
                                uploadId={selectedDocumentId || ''}
                                onUploadComplete={handleUploadComplete} customerId={customerId || ''}
                                submissionId={submissionId}
                                onSubmissionCreated={(id) => setSubmissionId(id)} />

                            {submissionId != null && !isNaN(submissionId) && (
                                <input
                                    type="hidden"
                                    name="submissionId"
                                    value={submissionId}
                                    aria-describedby="uploaded-doc-error"
                                />
                            )}


                        </div>
                    </div>
                    <div id="uploaded-doc-error" aria-live="polite" aria-atomic="true">
                        {/* {localErrors?.uploadedFilesByDocument &&
                localErrors.uploadedFilesByDocument.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))} */}
                    </div>
                </div>
                <div className="mt-4">
                    <h3>Uploaded files:</h3>
                    <div className="mt-4 space-y-4">
                        {Object.entries(uploadedFilesByDocument).map(([docId, files]) => (
                            // border rounded-md p-3
                            <div key={docId} className="border rounded-md p-3 bg-white">
                                <div className="flex items-start">
                                    <h3 className="font-semibold text-sm mb-2">
                                        {getDocumentName(docId)}
                                    </h3>
                                    {processingDocs[docId] && (
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                            Processing file...
                                        </div>
                                    )}

                                    {/* <button
                    type="button"
                    className="text-red-500 hover:text-red-700 ml-auto"
                    aria-label="Remove file"
                    onClick={() => removeFile(docId)}
                  >
                    ✕
                  </button> */}
                                </div>

                                <ul className="space-y-1">
                                    {files.map((file, index) => {

                                        // console.log("file.key" + file.key);
                                        const fileType = getFileType(file.name);
                                        const slides =
                                            fileType === "image"
                                                ? files
                                                    .filter(f => getFileType(f.name) === "image")
                                                    .map(f => ({ src: f.url }))
                                                : [];

                                        return (
                                            <li
                                                key={index}
                                                className="text-sm text-gray-600 flex justify-between"
                                            ><ul className="w-full">

                                                    <li className="flex items-center justify-between gap-3 border-b py-2">

                                                        {/* Left: File name */}
                                                        <span className="text-sm break-all">{file.name}</span>

                                                        {/* Middle/Right group containing image + close button */}
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            {/* Thumbnail (image or PDF) */}
                                                            {fileType === "image" && (
                                                                <img
                                                                    src={file.url}
                                                                    height={50}
                                                                    width={50}
                                                                    onClick={() => {
                                                                        const slides = files.map(f => ({ src: f.url }));
                                                                        setLightboxSlides(slides);
                                                                        setIndex(index);
                                                                    }}
                                                                    className="rounded border cursor-pointer hover:opacity-80 transition object-cover"
                                                                />
                                                            )}
                                                            {fileType === "pdf" && (
                                                                <div
                                                                    className="w-[50px] h-[50px] flex items-center justify-center border rounded cursor-pointer bg-red-50 hover:bg-red-100"
                                                                    onClick={async () => {
                                                                        const res = await fetch(file.url);
                                                                        const data = await res.json();
                                                                        setPdfUrl(data.url);
                                                                        setShowPdf(true);
                                                                    }}
                                                                    onContextMenu={(e) => e.preventDefault()}
                                                                >
                                                                    📄
                                                                </div>
                                                            )}

                                                            {/* Close button placed after the thumbnail */}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(docId, file.key)}
                                                                // className="text-red-500 hover:text-red-700 font-bold text-lg leading-none"
                                                                // aria-label="Remove file"
                                                                className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-base hover:bg-red-600"
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    </li>
                                                </ul>

                                            </li>
                                        );
                                    }

                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* {state.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )} */}
                <div className="mt-6 flex justify-end gap-4">
                    {/* <Button
                        type='button'
                        onClick={handleCancel}
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"

                    >
                        Back
                    </Button> */}
                    <Link
                        href="/dashboard/customers"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        Back
                    </Link>

                    {/* disabled={isCreateButtonEnabled} */}
                    <Button type="submit"
                        className="bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={isSubmitButtonDisabled}
                    >{roleSlug === 'manager' ? 'Approve' : 'Submit for Approval'} </Button>
                </div>
                <div onContextMenu={(e) => e.preventDefault()}>
                    <Lightbox
                        open={index !== null}
                        close={() => setIndex(null)}
                        index={index ?? 0}
                        slides={lightboxSlides}
                        plugins={[Zoom, Thumbnails, Fullscreen]}
                        zoom={{
                            maxZoomPixelRatio: 3,
                            minZoom: 0.5,
                            scrollToZoom: true,
                        }}
                        on={{ view: () => setRotation(0) }}
                        toolbar={{
                            buttons: [
                                <button key="rotate-left" className="yarl__button" onClick={() => setRotation((r) => r - 90)} title="Rotate Left">↺</button>,
                                <button key="rotate-right" className="yarl__button" onClick={() => setRotation((r) => r + 90)} title="Rotate Right">↻</button>,
                                "close",
                            ],
                        }}
                        render={{
                            slideContainer: ({ slide, children }) => (
                                <div style={{
                                    transform: `rotate(${rotation}deg)`,
                                    transition: "transform 0.3s ease",
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                    {children}
                                </div>
                            ),
                        }}
                    />
                </div>

                {showPdf && (
                    <div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
                        onContextMenu={(e) => e.preventDefault()} // disable right click for entire modal
                    >
                        <div className="relative bg-white rounded shadow-lg p-2">
                            <button
                                className="absolute top-2 right-2 text-black text-xl"
                                onClick={() => setShowPdf(false)}
                            >
                                ✕
                            </button>

                            <iframe
                                src={pdfUrl}
                                className="w-[80vw] h-[80vh] rounded"
                            />
                        </div>
                    </div>
                )}
            </div>
        </form>

    );
}
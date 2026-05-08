"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { DisableSubmissionRow } from '@/app/ui/final/buttons';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { updateManagerAndAdminNotes, NotesFormState, } from "@/app/lib/actions";

import Lightbox, { CloseIcon } from "yet-another-react-lightbox";

import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { Button } from '@/app/ui/button';
import { useActionState } from 'react';

import { ImageWithModal } from "./ImageWithModal";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon } from "lucide-react";




interface UploadedImage {
    doc_id: string | number;
    file_key: string;
    file_name?: string;
    doc_type?: string;
    file_url: string,
    // ... other properties
}

// export default function CustomerRow({ customer }: { customer: any }) {

export default function FinalSubmissionRow({ submission, loggedInRoleSlug, variant = "desktop" }: { submission: any, loggedInRoleSlug?: string, variant?: "desktop" | "mobile" }) {
    const initialState: NotesFormState = { message: null, errors: {} };
    const updateNotesWithId = updateManagerAndAdminNotes.bind(null, submission.submission_id);
    const [state, formAction] = useActionState(updateNotesWithId, initialState);

    const [open, setOpen] = useState("");
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [rotation, setRotation] = useState(0);
    const [index, setIndex] = useState<number | null>(null);
    const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([]);

    const [showPdf, setShowPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const statusStyles: Record<string, string> = {
        draft: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
        approved: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        pending_admin: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        pending_manager: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        admin_rejected: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
        manager_rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    };

    const labelMap: Record<string, string> = {
        draft: " Draft",
        approved: "Approved",
        pending_admin: "Pending Admin",
        pending_manager: "Pending Manager",
        admin_rejected: "Admin Rejected",
        manager_rejected: "Manager Rejected",
    };





    useEffect(() => {
        if (open !== "item-1") return;

        const fetchImages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/get-images?submissionId=${submission.submission_id}`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setImages(data.images || []);
            } catch (error) {
                console.error(error);
                setImages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchImages()

    }, [open]);

    function getFileType(fileName: string) {
        const ext = fileName.split(".").pop()?.toLowerCase();

        if (!ext) return "unknown";

        if (["jpg", "jpeg", "png"].includes(ext)) return "image";
        if (ext === "pdf") return "pdf";

        return "other";
    }

    const accordionContent = (
        <>
            {loading && <p className="text-sm p-4">Loading images...</p>}
            {!loading && images.length === 0 && (
                <p className="text-sm p-4">No images found.</p>
            )}
            {!loading && images.length > 0 && (
                <>
                    <div className="flex flex-col gap-4 p-4">
                        {Object.entries(
                            images.reduce<Record<string | number, UploadedImage[]>>((groups, img) => {
                                const docId = img.doc_id;
                                if (!groups[docId]) groups[docId] = [];
                                groups[docId].push(img);
                                return groups;
                            }, {})
                        ).map(([docId, groupImages]) => {
                            const slides = groupImages.map((img) => ({
                                // src: `/api/signed-url?file=${encodeURIComponent(img.file_key)}`,
                                src: img.file_url,
                            }));
                            const docType = groupImages[0]?.doc_type;
                            return (
                                <div key={docId} className="flex flex-col gap-2">
                                    {docType && <p className="text-sm font-medium">{docType}</p>}
                                    <div className="flex flex-row gap-4 flex-wrap">
                                        {groupImages.map((img, i) => {
                                            // const signedUrl = `/api/signed-url?file=${encodeURIComponent(img.file_key)}`;
                                            const signedUrl = img.file_url;
                                            const fileType = getFileType(img.file_name || img.file_key);
                                            return (
                                                <div key={img.file_key} className="flex flex-col items-start gap-1" onContextMenu={(e) => e.preventDefault()}>
                                                    {fileType === "image" && (

                                                        <img
                                                            src={signedUrl}
                                                            alt="Customer uploaded"
                                                            width={50}
                                                            height={50}
                                                            className="rounded border cursor-pointer hover:opacity-80 transition"
                                                            onClick={() => {
                                                                setLightboxSlides(slides);
                                                                setIndex(i);
                                                            }}

                                                        />
                                                    )}

                                                    {/* ✅ PDF */}
                                                    {fileType === "pdf" && (
                                                        <div
                                                            className="w-[50px] h-[50px] flex items-center justify-center border rounded cursor-pointer bg-red-50 hover:bg-red-100"
                                                            onClick={() => {
                                                                setPdfUrl(signedUrl);
                                                                setShowPdf(true);
                                                            }}
                                                            onContextMenu={(e) => e.preventDefault()}
                                                        >
                                                            📄
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-8 border-t pt-6">

                        <h3 className="text-lg font-medium">Notes</h3>
                        {/* --- DISPLAY AREA --- */}
                        <div className="space-y-4 mt-4">
                            {submission.admin_note && (
                                <div className="bg-gray-100 p-3 rounded">
                                    <strong className="block mb-1">Admin Note:</strong>
                                    <p>{submission.admin_note}</p>
                                </div>
                            )}

                            {submission.manager_note && (
                                <div className="bg-gray-100 p-3 rounded">
                                    <strong className="block mb-1">Manager Note:</strong>
                                    <p>{submission.manager_note}</p>
                                </div>
                            )}
                        </div>


                        {/* --- EDIT AREA (only for admin/manager) --- */}
                        {loggedInRoleSlug !== "agent" && (
                            <form action={formAction} className="grid gap-6 mt-6">

                                {loggedInRoleSlug === "admin" && (
                                    <div>
                                        <label className="block text-sm font-medium">Edit Admin Note</label>
                                        <textarea
                                            id="adminNote"
                                            name="adminNote"
                                            defaultValue={submission.admin_note}
                                            className="mt-1 w-full border rounded p-2"
                                        />
                                    </div>
                                )}

                                {loggedInRoleSlug === "manager" && (
                                    <div>
                                        <label className="block text-sm font-medium">Edit Manager Note</label>
                                        <textarea
                                            id="managerNote"
                                            name="managerNote"
                                            defaultValue={submission.manager_note}
                                            className="mt-1 w-full border rounded p-2"
                                        />
                                    </div>
                                )}

                                <Button type="submit">Save Notes</Button>
                            </form>
                        )}
                    </div>

                </>

            )}

            {/* Shared Lightbox */}



            <div onContextMenu={(e) => e.preventDefault()} className="relative w-full h-full">
                {/* Custom mobile close button - only visible on mobile */}
                {/* {index !== null && (
                    <button
                        onClick={() => setIndex(null)}
                        className="fixed top-4 right-4 z-[999999] flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white text-2xl shadow-xl md:hidden active:bg-red-700 transition-colors"
                        aria-label="Close"
                        style={{ touchAction: 'manipulation' }}
                    >
                        ✕
                    </button>
                )} */}

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
                            <button
                                key="rotate-left"
                                className="yarl__button flex items-center justify-center w-11 h-11 text-2xl rounded-full bg-black/50 hover:bg-black/70 active:bg-black/80 transition-colors"
                                onClick={() => setRotation((r) => r - 90)}
                                title="Rotate Left"
                            >
                                ↺
                            </button>,
                            <button
                                key="rotate-right"
                                className="yarl__button flex items-center justify-center w-11 h-11 text-2xl rounded-full bg-black/50 hover:bg-black/70 active:bg-black/80 transition-colors"
                                onClick={() => setRotation((r) => r + 90)}
                                title="Rotate Right"
                            >
                                ↻
                            </button>,
                            // <button
                            //     key="closee"
                            //     className="yarl__button flex items-center justify-center w-11 h-11 text-2xl rounded-full bg-black/50 hover:bg-black/70 active:bg-black/80 transition-colors"
                            // >
                            //     x
                            // </button>,

                            "close", // Keep YARL's close for desktop
                        ],
                    }}
                    render={{
                        slideContainer: ({ slide, children }) => (
                            <div
                                className="flex items-center justify-center w-full h-full"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    transition: "transform 0.3s ease",
                                }}
                            >
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
        </>
    );

    const accordion = (
        <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
            <AccordionItem value="item-1">
                <AccordionContent onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>{accordionContent}</AccordionContent>
            </AccordionItem>
        </Accordion>
    );

    const actionButtons = (
        <div className="flex gap-3">
            <button
                className="rounded-md border p-2 hover:bg-gray-100"
                onClick={() => setOpen(open ? "" : "item-1")}
            >
                <ChevronDownIcon className="w-5" />
            </button>
            <DisableSubmissionRow id={submission.submission_id} is_valid={submission.is_valid} />

        </div>
    );

    if (variant === "mobile") {
        return (
            <div className="mb-2 w-full rounded-md bg-white p-4">
                {/* Use flex-col to stack content vertically */}
                <div className="flex flex-col border-b pb-4">
                    {/* Top: customer info */}
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <ImageWithModal
                                imageUrl={submission.image_url}
                                altText={`${submission.customer_name}'s profile picture`}
                            />
                            <p className="font-medium">{submission.customer_name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{submission.customer_mobile}</p>
                    </div>

                </div>
                <div className="flex flex-col border-b pb-4">
                    {/* Top: customer info */}
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            {submission.loc_link ? (

                                <Badge asChild variant="outline" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                    <a href={submission.loc_link} target="_blank">
                                        Google Map <ArrowUpRightIcon data-icon="inline-end" />
                                    </a>
                                </Badge>) : (
                                <span className="text-gray-400">—</span>
                            )
                            }

                        </div>
                        <p className="text-sm text-gray-500">{submission.cust_code}</p>
                    </div>

                    {/* Bottom: action buttons aligned right */}
                    {/* <div className="flex justify-end mt-2">
                        {actionButtons}
                    </div> */}
                </div>
                <div className="flex flex-col border-b pb-4">
                    {/* Top: customer info */}
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            {submission.status}
                        </div>
                        {/* <p className="text-sm text-gray-500">{submission.cust_code}</p> */}
                    </div>

                    {/* Bottom: action buttons aligned right */}
                    <div className="flex justify-end mt-2">
                        {actionButtons}
                    </div>
                </div>
                {/* Accordion content – now it will expand below the buttons */}
                {accordion}
            </div>

        );
    }

    // ── DESKTOP ──
    return (
        <>
            <tr >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                        <ImageWithModal
                            imageUrl={submission.image_url}
                            altText={`${submission.customer_name}'s profile picture`}
                        />

                        <p>{submission.customer_name}</p>
                    </div>
                </td>
                <td className="bg-white px-4 py-5">{submission.customer_mobile}</td>

                <td className="bg-white px-4 py-5 text-sm">
                    {submission.loc_link ? (

                        <Badge asChild variant="outline" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            <a href={submission.loc_link} target="_blank">
                                Google Map <ArrowUpRightIcon data-icon="inline-end" />
                            </a>
                        </Badge>) : (
                        <span className="text-gray-400">—</span>
                    )
                    }

                </td>
                <td className="bg-white px-4 py-5">

                    {submission.cust_code}
                </td>


                {/* className="bg-white px-4 py-5" */}
                <td className="bg-white px-4 py-5">
                    {statusStyles[submission.status] && (
                        <Badge className={statusStyles[submission.status]}>
                            {labelMap[submission.status]}
                        </Badge>
                    )}
                </td>

                <td className="bg-white px-4 py-5">
                    <p className="text-sm text-gray-500">
                        {submission.is_valid ? (
                            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">✓ Valid</Badge>

                        ) : (

                            <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">✗ Invalid</Badge>
                        )}
                    </p>
                    {/* {submission.is_valid} */}
                </td>

                <td className="bg-white px-4 py-5">
                    <div className="flex justify-end gap-3">{actionButtons}</div>
                </td>
            </tr>
            <tr>
                <td colSpan={4} className="bg-gray-50">
                    {accordion}
                </td>


            </tr>


        </>
    );



}



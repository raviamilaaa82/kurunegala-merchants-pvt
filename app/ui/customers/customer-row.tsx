"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
import { UpdateCustomer, DisableCustomer } from './buttons';
import { PencilIcon, PlusIcon, TrashIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';




import Lightbox from "yet-another-react-lightbox";

import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
// import "yet-another-react-lightbox/plugins/zoom.css";


interface UploadedImage {
    doc_id: string | number;
    file_key: string;
    file_name?: string;
    doc_type?: string;
    file_url: string,
    // ... other properties
}


// export default function CustomerRow({ customer }: { customer: any }) {

export default function CustomerRow({ customer, variant = "desktop" }: { customer: any, variant?: "desktop" | "mobile" }) {
    const [open, setOpen] = useState("");
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [rotation, setRotation] = useState(0);
    const [index, setIndex] = useState<number | null>(null);
    const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([]);

    const [showPdf, setShowPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");


    useEffect(() => {
        if (open === "item-1") {

            setLoading(true);
            fetch(`/api/get-images?masterId=${customer.id}`).then((res) => res.json()).then((data) => {
                setImages(data.images || []);
                setLoading(false);

            });
        }


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
            )}

            {/* Shared Lightbox */}
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
        </>
    );

    const accordion = (
        <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
            <AccordionItem value="item-1">
                <AccordionContent>{accordionContent}</AccordionContent>
            </AccordionItem>
        </Accordion>
    );

    const actionButtons = (
        <div className="flex gap-3">
            <button
                className="rounded-md border p-2 hover:bg-gray-100"
                onClick={() => setOpen(open ? "" : "item-1")}
            >
                <ViewColumnsIcon className="w-5" />
            </button>
            <UpdateCustomer id={customer.id} />
            <DisableCustomer id={customer.id} is_enabled={customer.is_enabled} />
        </div>
    );

    if (variant === "mobile") {
        return (
            <div className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <Image
                                src={customer.image_url}
                                className="rounded-full"
                                alt={`${customer.name}'s profile picture`}
                                width={28}
                                height={28}
                            />
                            <p className="font-medium">{customer.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.mobile}</p>
                    </div>
                    {actionButtons}
                </div>
                {accordion}
            </div>
        );
    }

    // ── DESKTOP ──
    return (
        <>
            <tr>
                <td className="bg-white px-4 py-5">{customer.name}</td>
                <td className="bg-white px-4 py-5">{customer.email}</td>
                <td className="bg-white px-4 py-5">{customer.mobile}</td>
                <td className="bg-white px-4 py-5 text-sm">
                    {customer.loc_link ? (
                        <a
                            href={customer.loc_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            View on Google Maps
                        </a>
                    ) : (
                        <span className="text-gray-400">—</span>
                    )}
                </td>
                <td className="bg-white px-4 py-5"> {customer.is_enabled ? (
                    <span className="text-green-600">✓ Valid</span>
                ) : (
                    <span className="text-red-600">✗ Invalid</span>
                )}</td>
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
    // return (
    //     <>

    //         <tr>
    //             <td className="bg-white px-4 py-5">{customer.name}</td>
    //             <td className="bg-white px-4 py-5">{customer.email}</td>
    //             <td className="bg-white px-4 py-5">{customer.mobile}</td>

    //             <td className="bg-white px-4 py-5">
    //                 <div className="flex justify-end gap-3">
    //                     <button
    //                         className="rounded-md border p-2 hover:bg-gray-100"
    //                         onClick={() => setOpen(open ? "" : "item-1")}
    //                     >
    //                         {/* View Images */}
    //                         <ViewColumnsIcon className="w-5" />
    //                     </button>

    //                     <UpdateCustomer id={customer.id} />
    //                     <DisableCustomer id={customer.id} />
    //                 </div>

    //             </td>
    //         </tr>

    //         {/* ACCORDION ROW */}
    //         <tr>
    //             <td colSpan={4} className="bg-gray-50">
    //                 <Accordion
    //                     type="single"
    //                     collapsible
    //                     value={open}
    //                     onValueChange={setOpen}
    //                 >
    //                     <AccordionItem value="item-1">
    //                         {/* <AccordionTrigger>Uploaded Images</AccordionTrigger> */}
    //                         <AccordionContent>
    //                             {loading && <p className="text-sm p-4">Loading images...</p>}

    //                             {!loading && images.length === 0 && (
    //                                 <p className="text-sm p-4">No images found.</p>
    //                             )}

    //                             {!loading && images.length > 0 && (
    //                                 <div className="flex flex-col gap-4 p-4">
    //                                     {Object.entries(
    //                                         images.reduce<Record<string | number, UploadedImage[]>>((groups, img) => {
    //                                             const docId = img.doc_id;
    //                                             if (!groups[docId]) groups[docId] = [];
    //                                             groups[docId].push(img);
    //                                             return groups;
    //                                         }, {})
    //                                     ).map(([docId, groupImages]) => {
    //                                         const slides = groupImages.map((img) => ({
    //                                             src: `/api/signed-url?file=${encodeURIComponent(img.file_key)}`,
    //                                         }));

    //                                         const docType = groupImages[0]?.doc_type;
    //                                         return (
    //                                             <div key={docId} className="flex flex-col gap-2">
    //                                                 {docType && (
    //                                                     <p className="text-sm font-medium">{docType}</p>
    //                                                 )}
    //                                                 <div className="flex flex-row gap-4 flex-wrap">

    //                                                     {

    //                                                         groupImages.map((img, i) => {
    //                                                             const signedUrl = `/api/signed-url?file=${encodeURIComponent(img.file_key)}`;
    //                                                             return (
    //                                                                 <div key={img.file_key} className="flex flex-col items-start gap-1" onContextMenu={(e) => e.preventDefault()}>
    //                                                                     {/* {docType && (
    //                                                                         <p className="text-sm font-medium">{docType}</p>
    //                                                                     )} */}
    //                                                                     <img
    //                                                                         src={signedUrl}
    //                                                                         alt="Customer uploaded"
    //                                                                         width={50}
    //                                                                         height={50}
    //                                                                         className="rounded border cursor-pointer hover:opacity-80 transition"
    //                                                                         // onClick={() => handleImageClick(signedUrl)}
    //                                                                         onClick={() => {
    //                                                                             setIndex(i);
    //                                                                             setLightboxSlides(slides);
    //                                                                         }}
    //                                                                     />
    //                                                                 </div>
    //                                                             );
    //                                                         })}


    //                                                 </div>
    //                                             </div>
    //                                         );
    //                                     }

    //                                     )}
    //                                 </div>
    //                             )}
    //                             <div onContextMenu={(e) => e.preventDefault()}>
    //                                 <Lightbox
    //                                     open={index !== null}
    //                                     close={() => setIndex(null)}
    //                                     index={index ?? 0}
    //                                     slides={lightboxSlides}     // ✅ slides created above
    //                                     plugins={[Zoom, Thumbnails, Fullscreen]}
    //                                     zoom={{
    //                                         maxZoomPixelRatio: 3,   // Allow zooming in up to 3x the original pixel ratio[reference:2]
    //                                         minZoom: 0.5,           // Allow zooming out to 50% of the image size[reference:3]
    //                                         scrollToZoom: true,     // Enable zooming with the mouse wheel[reference:4]
    //                                     }}
    //                                     on={{
    //                                         view: () => setRotation(0), // reset on slide change
    //                                     }}
    //                                     toolbar={{
    //                                         buttons: [
    //                                             <button
    //                                                 key="rotate-left"
    //                                                 className="yarl__button"
    //                                                 onClick={() => setRotation((r) => r - 90)}
    //                                                 title="Rotate Left"
    //                                             >
    //                                                 ↺
    //                                             </button>,
    //                                             <button
    //                                                 key="rotate-right"
    //                                                 className="yarl__button"
    //                                                 onClick={() => setRotation((r) => r + 90)}
    //                                                 title="Rotate Right"
    //                                             >
    //                                                 ↻
    //                                             </button>,
    //                                             "close", // keep the default close button
    //                                         ],
    //                                     }}
    //                                     render={{

    //                                         slideContainer: ({ slide, children }) => (
    //                                             <div
    //                                                 style={{
    //                                                     transform: `rotate(${rotation}deg)`,
    //                                                     transition: "transform 0.3s ease",
    //                                                     width: "100%",
    //                                                     height: "100%",
    //                                                     display: "flex",
    //                                                     alignItems: "center",
    //                                                     justifyContent: "center",
    //                                                 }}
    //                                             >
    //                                                 {children}
    //                                             </div>
    //                                         ),

    //                                         // slide: ({ slide }) => (
    //                                         //     <img
    //                                         //         src={slide.src}
    //                                         //         alt=""
    //                                         //         style={{
    //                                         //             transform: `rotate(${rotation}deg)`,
    //                                         //             transition: "transform 0.3s ease",
    //                                         //             maxHeight: "100%",
    //                                         //             maxWidth: "100%",
    //                                         //             objectFit: "contain",
    //                                         //         }}
    //                                         //     />
    //                                         // ),
    //                                     }}
    //                                 />
    //                             </div>
    //                         </AccordionContent>
    //                     </AccordionItem>
    //                 </Accordion>
    //             </td>
    //         </tr>


    //     </>
    // )



}
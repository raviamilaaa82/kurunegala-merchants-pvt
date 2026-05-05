"use client";

import { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";

export default function ProfileImageUploader({

    currentImageUrl,
    onUploadSuccess,
}: {

    currentImageUrl?: string;
    onUploadSuccess?: (url: string) => void;
}) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    // const [preview, setPreview] = useState<string | null>('');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [compressing, setCompressing] = useState(false);




    const handleFile = useCallback(async (file: File) => {
        setError(null);
        setSuccess(false);

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        let finalFile = file;

        if (file.size > 1 * 1024 * 1024) {
            try {
                setCompressing(true);
                const compressed = await imageCompression(file, {
                    maxSizeMB: 0.5,
                    useWebWorker: true,
                });
                finalFile = new File([compressed], file.name, { type: compressed.type });
            } catch (err) {
                console.error("Compression failed", err);
                setError("Compression failed. Please try a smaller image.");
                return;
            } finally {
                setCompressing(false);
            }
        }

        setPreview(URL.createObjectURL(finalFile));
        uploadFile(finalFile);
    }, []);

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            // formData.append("userId", userId);

            const res = await fetch("/api/upload-profile-image", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed.");

            setSuccess(true);
            onUploadSuccess?.(data.url);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
            setPreview(currentImageUrl || null);
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Upload Zone */}
            <div
                className={`relative w-36 h-36 rounded-full cursor-pointer group transition-transform duration-200
          hover:scale-105 active:scale-95 ${isDragging ? "scale-105" : ""}`}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            >
                {/* Gradient ring */}
                {/* <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-white-500 via-sky-400 
          transition-opacity duration-300 ${isDragging ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`} /> */}
                <div
                    className={`absolute inset-0 rounded-full bg-white border border-gray-700 
    transition-opacity duration-300 ${isDragging ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
                />

                {/* Inner circle  bg-zinc-900*/}
                <div className="absolute inset-[3px] rounded-full  overflow-hidden flex items-center justify-center">
                    {preview ? (
                        <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className={`flex flex-col items-center gap-1 transition-colors duration-200
              ${isDragging ? "text-violet-400" : "text-zinc-600 group-hover:text-violet-400"}`}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <span className="text-[10px] font-medium tracking-wide uppercase">Upload</span>
                        </div>
                    )}

                    {/* Hover overlay (only when image exists) */}
                    {preview && !isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[2px]">
                            <span className="text-white text-xs font-medium tracking-wide">Change</span>
                        </div>
                    )}

                    {/* Upload spinner */}
                    {/* {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-zinc-600 border-t-violet-400 rounded-full animate-spin" />
                        </div>
                    )} */}

                    {(isUploading || compressing) && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                            <div className="w-8 h-8 border-2 border-zinc-600 border-t-violet-400 rounded-full animate-spin" />
                            {compressing && (
                                <span className="text-[10px] text-violet-300 font-medium tracking-wide">Compressing…</span>
                            )}
                        </div>
                    )}





                </div>
            </div>

            {/* Hint */}
            <p className="text-xs text-zinc-500 text-center leading-relaxed">
                JPG, PNG or WEBP · Max 1MB<br />
                Click or drag & drop
            </p>

            {/* Change button */}
            {preview && !isUploading && (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-zinc-500 hover:text-violet-400 transition-colors
            border border-zinc-800 hover:border-violet-500/50 px-4 py-2 rounded-md tracking-wide"
                >
                    Choose different photo
                </button>
            )}

            {/* Status messages */}
            {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
                    ⚠ {error}
                </p>
            )}
            {success && (
                <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
                    ✓ Profile picture updated!
                </p>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                    e.target.value = "";
                }}
            />
        </div>
    );
}
















// "use client";

// import React, { useRef, useState } from "react";
// import Image from "next/image";
// import imageCompression from "browser-image-compression";

// interface ProfileImageUploaderProps {
//     onFileSelected?: (file: File | null) => void;
// }

// const ProfileImageUploader = ({ onFileSelected }: ProfileImageUploaderProps) => {
//     const [file, setFile] = useState<File | null>(null);
//     const inputRef = useRef<HTMLInputElement | null>(null);
//     const [compressing, setCompressing] = React.useState(false);

//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//     const processedFiles: File[] = [];

//     const handleSelect = async (selected?: FileList | null) => {
//         if (!selected || selected.length === 0) return;



//         for (const file of selected) {
//             if (!allowedTypes.includes(file.type)) {
//                 alert(`❌ Invalid file: ${file.name}`);
//                 continue;
//             }

//             let finalFile = file;
//             // const resizedFile = await resizeToFixedDimensions(file, 600, 776); // to fixed height and width

//             // if (file.type.startsWith("image/") && file.size > 500 * 1024)
//             if (file.type.startsWith("image/") && file.size > 500 * 1024) {

//                 try {
//                     setCompressing(true); // show spinner
//                     const compressed = await imageCompression(file, {
//                         maxSizeMB: 0.5,
//                         // maxWidthOrHeight: 1920,
//                         useWebWorker: true,
//                     });
//                     finalFile = new File([compressed], file.name, { type: compressed.type });
//                 } catch (err) {
//                     console.error("Compression failed", err);
//                 } finally {
//                     setCompressing(false);  //  hide spinner regardless of success/error
//                 }
//             }

//             processedFiles.push(finalFile);

//         }
//         // const chosen = selected[0];
//         const chosen = processedFiles[0];
//         setFile(chosen);
//         onFileSelected?.(chosen);
//     };

//     return (
//         <div className="flex flex-col items-center">
//             {/* Preview box */}
//             <div
//                 className="w-32 h-32 rounded-full overflow-hidden border cursor-pointer hover:opacity-80 transition"
//                 onClick={() => inputRef.current?.click()}
//             >
//                 {file ? (
//                     <Image
//                         src={URL.createObjectURL(file)}
//                         alt="profile"
//                         width={128}
//                         height={128}
//                         className="object-cover w-full h-full"
//                     />
//                 ) : (
//                     <div className="flex items-center justify-center w-full h-full text-gray-500">
//                         Select Photo
//                     </div>
//                 )}
//             </div>

//             {/* Hidden file input */}
//             <input
//                 ref={inputRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => handleSelect(e.target.files)}
//             />
//         </div>
//     );
// };

// export default ProfileImageUploader;
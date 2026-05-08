// components/ImageWithModal.tsx (use 'use client')
'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ImageWithModal({ imageUrl, altText }: { imageUrl: string, altText: string }) {
    const [isOpen, setIsOpen] = useState(false);





    return (

        <>
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    width={28}
                    height={28}
                    alt={altText}
                    className="rounded-full cursor-pointer"
                    onClick={() => setIsOpen(true)}
                />
            ) : null}
            {/* <Image
                src={imageUrl}
                width={28}
                height={28}
                alt={altText}
                className="rounded-full cursor-pointer"
                onClick={() => setIsOpen(true)}
            /> */}

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-md sm:max-w-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute -top-10 right-0 text-white text-lg sm:text-xl hover:text-gray-300"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>

                        {/* Responsive Image */}
                        <Image
                            src={imageUrl}
                            alt={`${altText}'s profile picture`}
                            width={800}
                            height={800}
                            className="rounded-lg w-full h-auto max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );

    // return (
    //     <>

    //         <Image
    //             src={imageUrl}
    //             width={28}
    //             height={28}
    //             alt={altText}
    //             className="rounded-full cursor-pointer"
    //             onClick={() => setIsOpen(true)}
    //         />


    //         {isOpen && (
    //             <div
    //                 className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    //                 onClick={() => setIsOpen(false)} // click outside to close
    //             >
    //                 <div className="relative max-w-lg w-full mx-4">

    //                     <button
    //                         className="absolute -top-8 right-0 text-white text-sm hover:text-gray-300"
    //                         onClick={() => setIsOpen(false)}
    //                     >
    //                         ✕ Close
    //                     </button>


    //                     <Image
    //                         src={imageUrl}
    //                         width={500}
    //                         height={500}
    //                         alt={`${altText}'s profile picture`}
    //                         className="rounded-lg w-full h-auto object-cover"
    //                         onClick={(e) => e.stopPropagation()} // prevent closing when clicking image itself
    //                     />
    //                 </div>
    //             </div>
    //         )}
    //     </>
    // );
}
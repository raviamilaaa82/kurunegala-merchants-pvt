// 'use client';

// import { CustomersTableType, ImageListType, Documents } from '@/app/lib/definitions';
// import {
//   CheckIcon,
//   ClockIcon,
//   CurrencyDollarIcon,
//   UserCircleIcon,
// } from '@heroicons/react/24/outline';
// import Link from 'next/link';
// import { Button } from '@/app/ui/button';
// import { updateInvoice, State } from '@/app/lib/actions';
// import { useActionState, useState, useEffect } from 'react';
// import CaptureLocationButton from './capture_location';
// import FileUploadProgress from "@/components/file-upload-progress-1";


// import Lightbox from "yet-another-react-lightbox";

// import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
// import Zoom from "yet-another-react-lightbox/plugins/zoom";
// import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

// import "yet-another-react-lightbox/styles.css";
// import "yet-another-react-lightbox/plugins/thumbnails.css";



// type ImageRow = {
//   document_id: string;
//   file_name: string;
//   file_key: string;
// };

// interface UploadedImage {
//   doc_id: string | number;
//   file_key: string;
//   file_name?: string;
//   doc_type?: string;
//   file_url: string,
//   // ... other properties
// }
// // export default function EditCustomerForm({ customers, images, documents }: { customers: CustomersTableType; images: ImageListType[]; documents: Documents[] })
// export default function EditCustomerForm({ customers, documents, submisnId }: { customers: CustomersTableType; documents: Documents[], submisnId?: string }) {
//   const initialState: State = { message: null, errors: {} };
//   const updateCustomerWithId = updateInvoice.bind(null, customers.id);

//   const [state, formAction] = useActionState(updateCustomerWithId, initialState);

//   const [loading, setLoading] = useState(false);
//   const [images, setImages] = useState<any[]>([]);

//   const [googleLink, setGoogleLink] = useState(customers.loc_link);
//   const [selectedDocumentId, setSelectedDocumentId] = useState('');
//   const [selectedDocument, setSelectedDocument] = useState('');
//   const [uploadedFilesByDocument, setUploadedFilesByDocument] = useState<
//     Record<string, { name: string; key: string; url: string }[]>
//   >({});
//   // const [uploadedFilesByDocument, setUploadedFilesByDocument] = useState<
//   //   Record<string, { name: string; key: string; }[]>
//   // >({});

//   const [index, setIndex] = useState<number | null>(null);
//   const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([]);
//   const [rotation, setRotation] = useState(0);
//   const [processingDocs, setProcessingDocs] = useState<Record<string, boolean>>({});

//   useEffect(() => {
//     if (!customers?.id) return;

//     setLoading(true);
//     fetch(`/api/get-images?masterId=${customers.id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         const fetchedImages = data.images || []; // array of objects like your example
//         setImages(fetchedImages);

//         // Group by doc_id
//         const grouped: Record<string, { name: string; key: string; url: string }[]> = {};

//         fetchedImages.forEach((img: any) => {
//           const docId = String(img.doc_id); // or img.document_id depending on actual key
//           if (!grouped[docId]) {
//             grouped[docId] = [];
//           }
//           grouped[docId].push({
//             name: img.file_name,
//             key: img.file_key,
//             url: img.file_url,   // use the pre‑signed URL from the API
//           });
//         });

//         // Replace the state entirely (initial load)
//         setUploadedFilesByDocument(grouped);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }, [customers?.id]);




//   const handleDocumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedValue = event.target.value;

//     setSelectedDocument(selectedValue);
//     setSelectedDocumentId(event.target.value);

//   };

//   const getDocumentName = (id: string) =>
//     documents.find((d) => d.id === Number(id))?.document || id;

//   async function handleUploadComplete(file: File, info: { key: string; url: string }) {

//     if (!selectedDocumentId) return;

//     // const uploaded = await uploadToR2(file, selectedDocumentId);

//     setUploadedFilesByDocument(prev => ({
//       ...prev,
//       [selectedDocumentId]: [
//         ...(prev[selectedDocumentId] || []),
//         {
//           name: file.name,
//           key: info.key,
//           url: info.url, // signed URL generator endpoint
//         },
//       ],
//     }));



//     // setUploadedFilesByDocument(prev => ({
//     //   ...prev,
//     //   [selectedDocumentId]: [...(prev[selectedDocumentId] || []), file],
//     // }));

//   };
//   const removeFile = (indexToRemove: string) => {

//     setUploadedFilesByDocument(prev => {
//       const newState = { ...prev };
//       delete newState[Number(indexToRemove)];
//       return newState;
//     });

//   };

//   const getGeoLocation = (googleMapsLink: string) => {

//     setGoogleLink(googleMapsLink);
//   }

//   const handleProcessingStart = (docId: string) => {
//     setProcessingDocs(prev => ({
//       ...prev,
//       [docId]: true
//     }));
//   };
//   return (
//     <form action={formAction} className="w-full sm:w-1/2 md:w-1/2 mx-auto">

//       <div className="rounded-md bg-gray-50 p-4 md:p-6">

//         <div className="mb-4">
//           <label htmlFor="customer" className="mb-2 block text-sm font-medium">
//             Customer name
//           </label>
//           <div className="relative mt-2 rounded-md">
//             <div className="relative">
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 placeholder="Enter customer name"
//                 className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 aria-describedby="customer-error"
//                 defaultValue={customers.name}
//               // onChange={(e)=>setCu}
//               />
//               {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
//             </div>
//           </div>
//           <div id="customer-error" aria-live="polite" aria-atomic="true">
//             {/* {state.errors?.amount &&
//               state.errors.amount.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))} */}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="amount" className="mb-2 block text-sm font-medium">
//             Customer email
//           </label>
//           <div className="relative mt-2 rounded-md">
//             <div className="relative">
//               <input
//                 id="email"
//                 name="email"
//                 type="text"
//                 placeholder="Enter customer email"
//                 className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 aria-describedby="amount-error"
//                 defaultValue={customers.email}
//               />
//               {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
//             </div>
//           </div>
//           <div id="amount-error" aria-live="polite" aria-atomic="true">
//             {/* {state.errors?.amount &&
//               state.errors.amount.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))} */}
//           </div>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="amount" className="mb-2 block text-sm font-medium">
//             Customer mobile
//           </label>
//           <div className="relative mt-2 rounded-md">
//             <div className="relative">
//               <input
//                 id="mobile"
//                 name="mobile"
//                 type="text"
//                 placeholder="Enter customer mobile"
//                 className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//                 aria-describedby="amount-error"
//                 defaultValue={customers.mobile}
//               />
//               {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
//             </div>
//           </div>
//           <div id="amount-error" aria-live="polite" aria-atomic="true">
//             {/* error handleg */}
//           </div>
//         </div>



//         <div className="mb-4">
//           <label htmlFor="log" className="mb-2 block text-sm font-medium">
//             Google location
//           </label>
//           <div className="relative mt-2 rounded-md">
//             <div className="relative">
//               {googleLink && (
//                 <a href={googleLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" >
//                   📍 View on Google Maps
//                 </a>
//               )}

//               <input type="hidden" name="googleLink" value={googleLink} />
//             </div>
//           </div>
//           <div id="log-error" aria-live="polite" aria-atomic="true">
//             {/* error handleg */}
//           </div>
//         </div>
//         <CaptureLocationButton onLocationCaptured={getGeoLocation} />

//         <div className="mb-4">

//           <label htmlFor="customer" className="mb-2 block text-sm font-medium">
//             Document type

//           </label>
//           <div className="relative">
//             <select
//               id="document"
//               name="document"
//               className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
//               defaultValue=""
//               aria-describedby="document-error"
//               onChange={handleDocumentChange}
//             >
//               <option value="" disabled>
//                 Select a document type
//               </option>
//               {documents.map((document) => (
//                 <option key={document.id} value={document.id}>
//                   {document.document}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div id="document-error" aria-live="polite" aria-atomic="true">
//             {/* {state.errors?.customerId &&
//               state.errors.customerId.map((error: string) => (
//                 <p className="mt-2 text-sm text-red-500" key={error}>
//                   {error}
//                 </p>
//               ))} */}
//           </div>
//           <div className="mb-4">
//             <div className="relative mt-2 rounded-md flex justify-center">
//               <div className="relative">
//                 <FileUploadProgress key={selectedDocumentId || 'empty'}
//                                 uploadId={selectedDocumentId || ''}
//                                 onUploadComplete={handleUploadComplete} customerId={customers.id || ''}
//                                 submissionId={submisnId}
//                                 onSubmissionCreated={(id) => setSubmissionId(id)} />
//                 <input
//                   type="hidden"
//                   name="uploadedFilesByDocument"
//                   key={JSON.stringify(uploadedFilesByDocument)}
//                   value={JSON.stringify(uploadedFilesByDocument)}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="mt-4">


//             <h3>Uploaded files:</h3>
//             <div className="mt-4 space-y-4">
//               {Object.entries(uploadedFilesByDocument).map(([docId, files]) => (
//                 // border rounded-md p-3
//                 <div key={docId} className="border rounded-md p-3 bg-white">
//                   <div className="flex items-start">
//                     <h3 className="font-semibold text-sm mb-2">
//                       {getDocumentName(docId)}
//                     </h3>
//                     <button
//                       type="button"
//                       className="text-red-500 hover:text-red-700 ml-auto"
//                       aria-label="Remove file"
//                       onClick={() => removeFile(docId)}
//                     >
//                       ✕
//                     </button>
//                   </div>

//                   <ul className="space-y-1">
//                     {files.map((file, index) => (

//                       <li
//                         key={index}
//                         className="text-sm text-gray-600 flex justify-between"
//                       >
//                         <span>{file.name}</span>
//                         {/* <span>{(file.size / 1024).toFixed(1)} KB</span> */}
//                         <img src={file.url} height={50} width={50} onClick={() => {
//                           const slides = files.map(f => ({
//                             src: f.url,
//                           }));

//                           setLightboxSlides(slides);
//                           setIndex(index);
//                         }} className="rounded border cursor-pointer hover:opacity-80 transition" />
//                       </li>


//                     ))}
//                   </ul>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>


//       </div>
//       {state.message && (
//         <p className="text-sm text-red-500">{state.message}</p>
//       )}
//       <div className="mt-6 flex justify-end gap-4">
//         <Link
//           href="/dashboard/customers"
//           className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
//         >
//           Cancel
//         </Link>
//         <Button type="submit">Update customer</Button>
//       </div>
//       <div onContextMenu={(e) => e.preventDefault()}>
//         <Lightbox
//           open={index !== null}
//           close={() => setIndex(null)}
//           index={index ?? 0}
//           slides={lightboxSlides}
//           plugins={[Zoom, Thumbnails, Fullscreen]}
//           zoom={{
//             maxZoomPixelRatio: 3,
//             minZoom: 0.5,
//             scrollToZoom: true,
//           }}
//           on={{ view: () => setRotation(0) }}
//           toolbar={{
//             buttons: [
//               <button key="rotate-left" className="yarl__button" onClick={() => setRotation((r) => r - 90)} title="Rotate Left">↺</button>,
//               <button key="rotate-right" className="yarl__button" onClick={() => setRotation((r) => r + 90)} title="Rotate Right">↻</button>,
//               "close",
//             ],
//           }}
//           render={{
//             slideContainer: ({ slide, children }) => (
//               <div style={{
//                 transform: `rotate(${rotation}deg)`,
//                 transition: "transform 0.3s ease",
//                 width: "100%",
//                 height: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}>
//                 {children}
//               </div>
//             ),
//           }}
//         />
//       </div>
//     </form>






//   );

// }

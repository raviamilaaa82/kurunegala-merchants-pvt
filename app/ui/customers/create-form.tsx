'use client';
import { CustomerField, Documents } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createCustomer, CustomerState } from '@/app/lib/actions';
import { useActionState, useState, useEffect, useRef } from 'react';
import FileUploadProgress from "@/components/file-upload-progress-1";
import { uploadToR2 } from '@/lib/upload';
import CaptureLocationButton from './capture_location';
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { useRouter } from 'next/navigation';

type CustomerErrors = {
  name?: string[];
  uploadedFilesByDocument?: string[];
};


export default function Form({ documents }: { documents: Documents[] }) {
  const initialState: CustomerState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    mobile: "",
    // uploadedFilesByDocument: {}
  });

  const [files, setFiles] = useState<File[]>([]);
  const [selectedDocument, setSelectedDocument] = useState('');

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // const [uploadedFilesByDocument, setUploadedFilesByDocument] = useState<Record<string, File[]>>({});

  const [selectedDocumentId, setSelectedDocumentId] = useState('');

  const [lat, setLat] = useState(0);
  const [lan, setLan] = useState(0);
  const [googleLink, setGoogleLink] = useState("");

  const [index, setIndex] = useState<number | null>(null);
  const [lightboxSlides, setLightboxSlides] = useState<{ src: string }[]>([]);
  const [rotation, setRotation] = useState(0);

  const [localErrors, setLocalErrors] = useState<CustomerErrors>({});

  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [processingDocs, setProcessingDocs] = useState<Record<string, boolean>>({});
  const [isCreateButtonEnabled, setIsCreateButtonEnabled] = useState(true);


  const [uploadedFilesByDocument, setUploadedFilesByDocument] = useState<
    Record<string, { name: string; key: string; url: string }[]>
  >({});
  const [deleteQueueByDocument, setDeleteQueueByDocument] = useState<Record<string, string[]>>({});//to keep delete files keys for remove images when finally pass data from temp to original

  //these to get the keys from temp uploaded and and delete keys

  const keptFilesMapping = Object.entries(uploadedFilesByDocument).map(([docId, files]) => ({
    documentId: docId,
    keys: files.map(f => f.key),
  }));

  const deletedFilesMapping = Object.entries(deleteQueueByDocument).map(([docId, keys]) => ({
    documentId: docId,
    keys: keys,
  }));
  const router = useRouter();

  // const keptKeys = Object.values(uploadedFilesByDocument).flatMap(files =>
  //   files.map(file => file.key)
  // );

  // const deleteQueue = Object.values(deleteQueueByDocument).flat();


  useEffect(() => {
    setLocalErrors(state.errors || {});
  }, [state.errors]);



  const getDocumentName = (id: string) =>
    documents.find((d) => d.id === Number(id))?.document || id;



  const clearError = (field: keyof CustomerErrors) => {
    setLocalErrors(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };


  //for dropdown
  const handleDocumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setSelectedDocument(selectedValue);
    setSelectedDocumentId(event.target.value);

  };


  // const handleFilesChange = async (files: File[]) => {

  //   // if (selectedDocumentId) {
  //   //   // setUploadedFiles(processedFiles);
  //   //   setUploadedFiles(files);
  //   // } else {

  //   // }



  // };

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
    setIsCreateButtonEnabled(false);

    clearError("uploadedFilesByDocument"); //clearing error


  };

  const removeFile = (indexToRemove: string) => {

    //from here new code
    // Get the list of files for this document
    const files = uploadedFilesByDocument[indexToRemove];
    if (!files) return;


    // Add all their keys to the delete queue
    const keysToDelete = files.map(file => file.key);
    setDeleteQueueByDocument(prev => ({
      ...prev,
      [indexToRemove]: [...(prev[indexToRemove] || []), ...keysToDelete]
    }));
    //from above

    //from here to below is exising code
    setUploadedFilesByDocument(prev => {
      const newState = { ...prev };
      delete newState[Number(indexToRemove)];
      return newState;
    });

  };

  const getGeoLocation = (googleMapsLink: string) => {
    setGoogleLink(googleMapsLink);
    // setLat(lat);
    // setLan(lng);
  }

  function getFileType(fileName: string) {
    const ext = fileName.split(".").pop()?.toLowerCase();

    if (!ext) return "unknown";

    if (["jpg", "jpeg", "png"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";

    return "other";
  }


  const handleCancel = async () => {
    if (keptFilesMapping.length > 0) {
      const res = await fetch("/api/cleanup-temp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappings: keptFilesMapping }),
      });
      if (!res.ok) {
        console.error("Cleanup failed"); // don't block user, just log
      }
    }

    router.push('/dashboard/customers');
  }


  return (
    <form action={formAction} className="w-full sm:w-1/2 md:w-1/2 mx-auto">

      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Customer name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter customer name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
                value={formValues.name}
                onChange={(e) => {
                  setFormValues(prev => ({ ...prev, name: e.target.value }));
                  clearError("name");
                }}
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {localErrors?.name &&
              localErrors?.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Customer email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Enter customer email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="email-error"
                value={formValues.email}
                onChange={(e) =>
                  setFormValues(prev => ({ ...prev, email: e.target.value }))
                }
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          <div id="email-error" aria-live="polite" aria-atomic="true">
            {/* {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="mobile" className="mb-2 block text-sm font-medium">
            Customer mobile
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="mobile"
                name="mobile"
                type="text"
                placeholder="Enter customer mobile"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="mobile-error"
                value={formValues.mobile}
                onChange={(e) =>
                  setFormValues(prev => ({ ...prev, mobile: e.target.value }))
                }
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          <div id="mobile-error" aria-live="polite" aria-atomic="true">
            {/* error handleg */}
          </div>
        </div>



        <div className="mb-4">
          <label htmlFor="log" className="mb-2 block text-sm font-medium">
            Google location
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              {googleLink && (
                <a href={googleLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" >
                  📍 View on Google Maps
                </a>
              )}

              <input type="hidden" name="googleLink" value={googleLink} />
            </div>
          </div>
          <div id="log-error" aria-live="polite" aria-atomic="true">
            {/* error handleg */}
          </div>
        </div>

        <CaptureLocationButton onLocationCaptured={getGeoLocation} />

        <div className="mb-4">

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
              disabled={formValues.name.trim().length === 0}
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
              <FileUploadProgress key={selectedDocumentId || 'empty'} uploadId={selectedDocumentId || ''} onUploadComplete={handleUploadComplete} />
              <input
                type="hidden"
                name="uploadedFilesByDocument"
                key={JSON.stringify(uploadedFilesByDocument)}
                value={JSON.stringify(uploadedFilesByDocument)}
                aria-describedby="uploaded-doc-error"

              />

              {/* <input type="hidden" name="keptKeys" value={JSON.stringify(keptKeys)} />
                <input type="hidden" name="deleteQueue" value={JSON.stringify(deleteQueue)} /> */}
              <input type="hidden" name="keptFilesMapping" value={JSON.stringify(keptFilesMapping)} />
              <input type="hidden" name="deletedFilesMapping" value={JSON.stringify(deletedFilesMapping)} />
            </div>
          </div>
          <div id="uploaded-doc-error" aria-live="polite" aria-atomic="true">
            {localErrors?.uploadedFilesByDocument &&
              localErrors.uploadedFilesByDocument.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
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

                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700 ml-auto"
                    aria-label="Remove file"
                    onClick={() => removeFile(docId)}
                  >
                    ✕
                  </button>
                </div>

                <ul className="space-y-1">
                  {files.map((file, index) => {
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
                      >
                        <span>{file.name}</span>
                        {/* <span>{(file.size / 1024).toFixed(1)} KB</span> */}
                        {fileType === "image" && (
                          <img src={file.url} height={50} width={50} onClick={() => {
                            const slides = files.map(f => ({
                              src: f.url,
                            }));

                            setLightboxSlides(slides);
                            setIndex(index);
                          }} className="rounded border cursor-pointer hover:opacity-80 transition" />
                        )}
                        {fileType === "pdf" && (
                          <div
                            className="w-[50px] h-[50px] flex items-center justify-center border rounded cursor-pointer bg-red-50 hover:bg-red-100"
                            onClick={async () => {
                              const res = await fetch(file.url);   // file.url = /api/signed-url?file=...
                              const data = await res.json();
                              setPdfUrl(data.url);
                              setShowPdf(true);
                            }}
                            onContextMenu={(e) => e.preventDefault()}
                          >
                            📄
                          </div>
                        )}
                      </li>
                    );
                  }

                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>



      </div>
      {/* {state.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )} */}
      <div className="mt-6 flex justify-end gap-4">
        <Button
          type='button'
          onClick={handleCancel}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Button>
        {/* <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link> */}
        <Button type="submit" disabled={isCreateButtonEnabled}
          className="bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">Create customer</Button>
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
    </form>
  );
}

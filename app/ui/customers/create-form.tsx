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
import { useActionState, useState } from 'react';
import FileUploadProgress from "@/components/file-upload-progress-1";
import { uploadToR2 } from '@/lib/upload';



export default function Form({ documents }: { documents: Documents[] }) {
  const initialState: CustomerState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);

  const [files, setFiles] = useState<File[]>([]);
  const [selectedDocument, setSelectedDocument] = useState('');

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // const [uploadedFilesByDocument, setUploadedFilesByDocument] = useState<Record<string, File[]>>({});
  const [uploadedFilesByDocument, setUploadedFilesByDocument] = useState<
    Record<string, { name: string; key: string; url: string }[]>
  >({});
  const [selectedDocumentId, setSelectedDocumentId] = useState('');






  const getDocumentName = (id: string) =>
    documents.find((d) => d.id === Number(id))?.document || id;


  //for dropdown
  const handleDocumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setSelectedDocument(selectedValue);
    setSelectedDocumentId(event.target.value);

  };


  const handleFilesChange = (files: File[]) => {

    if (selectedDocumentId) {

      setUploadedFiles(files);
    } else {

    }

  };

  async function handleUploadComplete(file: File) {

    if (!selectedDocumentId) return;

    const uploaded = await uploadToR2(file, selectedDocumentId);

    setUploadedFilesByDocument(prev => ({
      ...prev,
      [selectedDocumentId]: [
        ...(prev[selectedDocumentId] || []),
        {
          name: file.name,
          key: uploaded.key,
          url: uploaded.url, // signed URL generator endpoint
        },
      ],
    }));



    // setUploadedFilesByDocument(prev => ({
    //   ...prev,
    //   [selectedDocumentId]: [...(prev[selectedDocumentId] || []), file],
    // }));

  };

  const removeFile = (indexToRemove: string) => {

    setUploadedFilesByDocument(prev => {
      const newState = { ...prev };
      delete newState[Number(indexToRemove)];
      return newState;
    });

  };


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
                aria-describedby="amount-error"
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {/* {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
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
                aria-describedby="amount-error"
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {/* {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
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
                aria-describedby="amount-error"
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          <div id="amount-error" aria-live="polite" aria-atomic="true">
            {/* error handleg */}
          </div>
        </div>

        {/* Customer Name */}
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
          <div className="mb-4">
            <div className="relative mt-2 rounded-md flex justify-center">
              <div className="relative">
                <FileUploadProgress key={selectedDocumentId || 'empty'} uploadId={selectedDocumentId || ''} onFilesChange={handleFilesChange} onUploadComplete={handleUploadComplete} />
                <input
                  type="hidden"
                  name="uploadedFilesByDocument"
                  key={JSON.stringify(uploadedFilesByDocument)}
                  value={JSON.stringify(uploadedFilesByDocument)}
                />
              </div>
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
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex justify-between"
                      >
                        <span>{file.name}</span>
                        {/* <span>{(file.size / 1024).toFixed(1)} KB</span> */}

                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>
        </div>


      </div>
      {state.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create customer</Button>
      </div>
    </form>
  );
}

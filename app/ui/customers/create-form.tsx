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
import { createCustomer, CustomerState, } from '@/app/lib/actions';
import { useActionState, useState, } from 'react';

import { uploadToR2 } from '@/lib/upload';
import CaptureLocationButton from './capture_location';

import { useRouter } from 'next/navigation';
import { string } from 'zod';
import { UploadDocuments } from './buttons';

type CustomerErrors = {
  name?: string[];
  uploadedFilesByDocument?: string[];
};

// const initialState: CustomerState = { status: 'idle' };
// const initialStateStatusUpdate: SubmissionState = { status: 'idle' };

export default function Form() {
  const initialState: CustomerState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomer, initialState);
  // const [updateState, formUpdateAction] = useActionState(
  //   updateSubmissionStatus,
  //   initialStateStatusUpdate
  // );
  // const [state, formAction, isPending] = useActionState(
  //   createCustomer,
  //   initialState
  // );


  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    mobile: "",
    // uploadedFilesByDocument: {}
  });



  const [googleLink, setGoogleLink] = useState("");
  const [localErrors, setLocalErrors] = useState<CustomerErrors>({});
  const [customerId, setCustomerId] = useState<string>('100');
  const [custName, setCustName] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<number | null>(null);//setting submissionid


  // const [deleteQueueByDocument, setDeleteQueueByDocument] = useState<Record<string, string[]>>({});//to keep delete files keys for remove images when finally pass data from temp to original

  //these to get the keys from temp uploaded and and delete keys

  // const keptFilesMapping = Object.entries(uploadedFilesByDocument).map(([docId, files]) => ({
  //   documentId: docId,
  //   keys: files.map(f => f.key),
  // }));

  // const deletedFilesMapping = Object.entries(deleteQueueByDocument).map(([docId, keys]) => ({
  //   documentId: docId,
  //   keys: keys,
  // }));
  const router = useRouter();



  // const deleteQueue = Object.values(deleteQueueByDocument).flat();


  // useEffect(() => {
  //   setLocalErrors(state.errors || {});
  // }, [state.errors]);






  const clearError = (field: keyof CustomerErrors) => {
    setLocalErrors(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };




  const getGeoLocation = (googleMapsLink: string) => {
    setGoogleLink(googleMapsLink);

  }



  //need to check again
  // const handleCancel = async () => {
  //   if (keptFilesMapping.length > 0) {
  //     const res = await fetch("/api/cleanup-temp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ mappings: keptFilesMapping }),
  //     });
  //     if (!res.ok) {
  //       console.error("Cleanup failed"); // don't block user, just log
  //     }
  //   }

  //   router.push('/dashboard/customers');
  // }
  const resetAll = () => {

    setFormValues({
      name: '',
      email: '',
      mobile: '',
    });
    setGoogleLink("");
    setSubmissionId(null);
    // setCustomerId(null);
    setCustName(null);

  };

  return (
    <>
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
                // disabled={isFirstFormEnabled}
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
                // disabled={isFirstFormEnabled}
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
                // disabled={isFirstFormEnabled}
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
          <div className="mb-4">
            <CaptureLocationButton onLocationCaptured={getGeoLocation} />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            {/* <Button
          type='button'
          onClick={handleCancel}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Button> */}
            {/* disabled={isCreateButtonEnabled} */}
            <Button type="submit"
              className="bg-blue-600 text-white disabled:bg-gray-400 
              disabled:cursor-not-allowed"
            // disabled={isFirstFormEnabled}
            >
              Create customer</Button>
            {/* <UploadDocuments id={customerId} /> */}
          </div>
        </div>
      </form>


    </>
  );
}

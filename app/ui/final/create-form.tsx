'use client';
import { Documents } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createDocument, DocumentState } from '@/app/lib/actions';
import { useActionState } from 'react';
// import FileUploadProgress from "@/components/file-upload-progress-1";



export default function Form() {
  const initialState: DocumentState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createDocument, initialState);
  return (
    <form action={formAction} className="w-full sm:w-1/2 md:w-1/3 mx-auto">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Document Name
          </label>
          <div className="relative">
            <input
              id="document"
              name="document"
              type="text"

              placeholder="Enter document name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="document-error"


            />
          </div>

          <div id="document-error" aria-live="polite" aria-atomic="true">
            {state.errors?.document &&
              state.errors.document.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


      </div>
      {state.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/documents"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Documents</Button>
      </div>
    </form>
  );
}

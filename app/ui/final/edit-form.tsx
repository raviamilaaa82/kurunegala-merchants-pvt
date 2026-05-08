'use client';

import { Documents } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateDocument, DocumentState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function EditDocumentForm({
  document,
  // customers,
}: {
  document: Documents;
  // customers: CustomerField[];
}) {
  const initialState: DocumentState = { message: null, errors: {} };
  const updateDocumentWithId = updateDocument.bind(null, document.id.toString());

  const [state, formAction] = useActionState(updateDocumentWithId, initialState);
  // const [checked, setChecked] = useState(false)
  const [isValid, setIsValid] = useState(document.is_valid);

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
              // step="0.01"
              defaultValue={document.document}
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

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Customer name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative" >


              <Switch id="airplane-mode" checked={isValid}
                onCheckedChange={setIsValid} />

              <Label htmlFor="airplane-mode">{isValid ? "Valid" : "Invalid"}</Label>
              <input type="hidden" name="is_valid" value={isValid ? "1" : "0"}
              />
            </div>
          </div>
          {/* <div id="amount-error" aria-live="polite" aria-atomic="true"> */}
          {/* {state.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
          {/* </div> */}
        </div>

        {/* Invoice Status */}
        {/* <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset> */}

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
        <Button type="submit">Edit Documents</Button>
      </div>
    </form>
  );
}

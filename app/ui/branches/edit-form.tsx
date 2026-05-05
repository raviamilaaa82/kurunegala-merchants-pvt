'use client';

import { Documents } from '@/app/lib/definitions';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateDocument, DocumentState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function EditBranchesForm({
  document,

}: {
  document: Documents;

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

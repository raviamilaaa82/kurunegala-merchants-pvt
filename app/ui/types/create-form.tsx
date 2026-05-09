'use client';
import { Branches } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createType, TypeState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';


export default function Form({ branches }: { branches: Branches[] }) {
  const initialState: TypeState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createType, initialState);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState('');



  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setSelectedBranch(selectedValue);
    setSelectedBranchId(event.target.value);

  };




  return (
    <form action={formAction} className="w-full sm:w-1/2 md:w-1/3 mx-auto">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}

        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Branch

          </label>
          <div className="relative">
            <select
              id="branch_id"
              name="branch"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="document-error"
              onChange={handleBranchChange}
            // disabled={isDropDownEnabled}
            >
              <option value="" disabled>
                Select a branch
              </option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch}
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
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Type Name
          </label>
          <div className="relative">
            <input
              id="type_id"
              name="type"
              type="text"
              placeholder="Enter type name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="type-error"
            />
          </div>

          <div id="branch-error" aria-live="polite" aria-atomic="true">
            {state.errors?.type &&
              state.errors.type.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


      </div>
      {state.message && (
        <p className="text-xs text-red-500">{state.message}</p>
      )}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/types"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Type</Button>
      </div>
    </form>
  );
}

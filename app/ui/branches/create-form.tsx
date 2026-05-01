'use client';
import { Branches, Company } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createBranch, BranchState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';




export default function Form({ companies }: { companies: Company[] }) {
  const initialState: BranchState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createBranch, initialState);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyId, setSelectedCompnayId] = useState('');



  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setSelectedCompany(selectedValue);
    setSelectedCompnayId(event.target.value);

  };




  return (
    <form action={formAction} className="w-full sm:w-1/2 md:w-1/3 mx-auto">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}

        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Company

          </label>
          <div className="relative">
            <select
              id="company"
              name="com_id"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="document-error"
              onChange={handleCompanyChange}
            // disabled={isDropDownEnabled}
            >
              <option value="" disabled>
                Select a company
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company}
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
            Branch Name
          </label>
          <div className="relative">
            <input
              id="branch"
              name="branch"
              type="text"

              placeholder="Enter branch name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="branch-error"
            />
          </div>

          <div id="branch-error" aria-live="polite" aria-atomic="true">
            {state.errors?.branch &&
              state.errors.branch.map((error: string) => (
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
          href="/dashboard/branches"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Branch</Button>
      </div>
    </form>
  );
}

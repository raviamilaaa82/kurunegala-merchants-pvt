'use client';
import { Company } from '@/app/lib/definitions';
import Link from 'next/link';

import { Button } from '@/app/ui/button';
import { createBranch, BranchState } from '@/app/lib/actions';
import { useActionState, useEffect, useState } from 'react';


export default function Form({ companies }: { companies: Company[] }) {
  const initialState: BranchState = { status: null, errors: {}, message: null, error: null };

  const [state, formAction] = useActionState(createBranch, initialState);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyId, setSelectedCompnayId] = useState('');
  const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({});
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [company, setCompany] = useState<string>('');
  const [branch, setBranch] = useState<string>('');


  useEffect(() => {
    if (state.status === 'error' && state.errors) {
      setLocalErrors(state.errors);
    }
    if (state.message) {
      setLocalMessage(state.message);
    }
  }, [state.status, state.errors, state.message]);


  const clearFieldError = (fieldName: string) => {
    setLocalErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];  // removes ONLY that field
      return newErrors;
    });
    setLocalMessage(null);
  };





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
              id="com_id"
              name="company"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="company-error"
              // onChange={handleCompanyChange}
              onChange={(e) => {
                handleCompanyChange(e);
                setCompany(e.target.value)
                clearFieldError('company');
              }
              }
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

          <div id="company-error" aria-live="polite" aria-atomic="true">
            {localErrors.company &&
              localErrors.company.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))}
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
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value)
                clearFieldError('branch');
              }
              }
            />
          </div>

          <div id="branch-error" aria-live="polite" aria-atomic="true">
            {localErrors?.branch &&
              localErrors.branch.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


      </div>
      {localMessage && (
        <p className="text-xs text-red-500">{localMessage}</p>
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

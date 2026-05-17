'use client';
import { Branches } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createType, TypeState } from '@/app/lib/actions';
import { useActionState, useEffect, useState } from 'react';


export default function Form({ branches, branchId }: { branches: Branches[], branchId?: string }) {
  const initialState: TypeState = { status: null, errors: {}, message: null, error: null };
  // const initialState: TypeState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createType, initialState);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({});
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [type, setType] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [isCheckingTypeName, setIsCheckingTypeName] = useState(false);
  const [typeNameError, setTypeNameError] = useState("");



  const getFilteredBranches = () => {

    // if ((roleSlug === 'agent' || roleSlug === 'admin') && branch) {
    return branches.filter(b => b.id === Number(branchId));
    // }
    // return branches;
  };

  const filteredBranches = getFilteredBranches();



  useEffect(() => {
    if (!type) {
      setTypeNameError("");
      return;
    }
    // if (!userName) return;
    setIsCheckingTypeName(true);
    setTypeNameError("");

    const timer = setTimeout(() => {
      fetch(`/api/types/check-typename?type=${type}`)
        .then(res => res.json())
        .then(data => {
          if (data.exists) {
            setTypeNameError("Type Name already exists");
          } else {
            setTypeNameError("");
          }
        }).finally(() => setIsCheckingTypeName(false));
    }, 500); // avoid spam

    return () => clearTimeout(timer);
  }, [type]);




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
              aria-describedby="branch-error"
              // onChange={handleBranchChange}
              onChange={(e) => {
                handleBranchChange(e);
                setBranch(e.target.value)
                clearFieldError('branch');
              }
              }
            >
              {/* <option value="" disabled>
                Select a branch
              </option> */}
              {filteredBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch}
                </option>
              ))}
            </select>
          </div>

          <div id="branch-error" aria-live="polite" aria-atomic="true">
            {localErrors.branch &&
              localErrors.branch.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))}
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
              value={type}
              onChange={(e) => {
                setType(e.target.value)
                clearFieldError('type');
              }
              }
            />
          </div>

          <div id="type-error" aria-live="polite" aria-atomic="true">
            {localErrors.type &&
              localErrors.type.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))}

            {isCheckingTypeName && (
              <p className="text-gray-400 text-xs">Checking type name...</p>
            )}
            {typeNameError && (
              <p className="text-red-500 text-xs">{typeNameError}</p>
            )}
          </div>
        </div>


      </div>
      {localMessage && (
        <p className="text-xs text-red-500">{localMessage}</p>
      )}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/types"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isCheckingTypeName || !!typeNameError} className="disabled:opacity-50 disabled:cursor-not-allowed">Create Type</Button>
      </div>
    </form>
  );
}

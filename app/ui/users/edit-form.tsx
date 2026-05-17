'use client';

import { User, Branches } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateUser, UserUpdateState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function EditUserForm({
  user,
  branches,
  roleSlug,
  branchId,
  // customers,
}: {
  user: User;
  branches: Branches[];
  roleSlug?: string;
  branchId?: string;
  // customers: CustomerField[];
}) {
  const initialState: UserUpdateState = { message: null, errors: {} };
  const updateUserWithId = updateUser.bind(null, user.id.toString());

  const [state, formAction] = useActionState(updateUserWithId, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [branch, setBranch] = useState<string>(user.branch_id);

  const getFilteredBranches = () => {

    // if ((roleSlug === 'agent' || roleSlug === 'admin') && branch) {
    return branches.filter(b => b.id === Number(branchId));
    // }
    // return branches;
  };

  const filteredBranches = getFilteredBranches();


  const isAgent = roleSlug === 'agent';
  const isManagerOrAdmin = roleSlug ? ['manager', 'admin'].includes(roleSlug) : false;

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setSelectedBranch(selectedValue);
    setSelectedBranchId(event.target.value);

  };


  return (
    <form action={formAction} className="w-full sm:w-1/2 md:w-1/3 mx-auto">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="user-error"
              defaultValue={user.name}
            />
          </div>

          <div id="user-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
              state.errors.name.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>


        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="number"
                placeholder="Enter phone no."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="phone-error"
                defaultValue={user.phone}
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
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

        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Branch

          </label>
          <div className="relative">
            <select
              id="branch_id"
              name="branch"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              // defaultValue=""
              disabled={isAgent}
              aria-describedby="branch-error"
              value={branch}
              // onChange={handleBranchChange}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                handleBranchChange(e);
                setBranch(e.target.value)
                // clearFieldError('branch');
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
          {isAgent && (
            <input type="hidden" name="branch" value={branch} />
          )}
          <div id="branch-error" aria-live="polite" aria-atomic="true">
            {/* {localErrors.branch &&
              localErrors.branch.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            User Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter user name."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="username-error"
                defaultValue={user.user_name}
                readOnly
              />
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          {/* <div id="username-error" aria-live="polite" aria-atomic="true">
            {state.errors?.username &&
              state.errors.username.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div> */}
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {/* <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {state.errors?.password &&
              state.errors.password.map((error: string) => (
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
        {!isAgent ?
          (<Link
            href="/dashboard/users"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>) : null
        }

        <Button type="submit">Update User</Button>
      </div>
    </form>
  );
}

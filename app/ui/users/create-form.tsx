'use client';
import { Role, Branches } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  EyeIcon,
  EyeSlashIcon,

} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createUser, UserState } from '@/app/lib/actions';
import { useActionState, useEffect, useState } from 'react';


export default function Form({ roles, branches }: { roles: Role[], branches: Branches[] }) {
  // const initialState: UserState = { message: null, errors: {} };
  const initialState: UserState = { status: null, errors: {}, message: null, error: null };
  const [state, formAction] = useActionState(createUser, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({});
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [branch, setBranch] = useState<string>('');
  // const [userName, setCustomerCode] = useState<string>('');
  const [error, setError] = useState("");
  const [isCheckingUserName, setIsCheckingUserName] = useState(false);
  const [userNameError, setUserNameError] = useState("");



  useEffect(() => {
    if (!userName) {
      setUserNameError("");
      return;
    }
    // if (!userName) return;
    setIsCheckingUserName(true);
    setUserNameError("");

    const timer = setTimeout(() => {
      fetch(`/api/users/check-username?uname=${userName}`)
        .then(res => res.json())
        .then(data => {
          if (data.exists) {
            setUserNameError("UserName already exists");
          } else {
            setUserNameError("");
          }
        }).finally(() => setIsCheckingUserName(false));
    }, 500); // avoid spam

    return () => clearTimeout(timer);
  }, [userName]);





  useEffect(() => {
    if (state.status === 'error' && state.errors) {
      setLocalErrors(state.errors);
    }
    if (state.message) {
      setLocalMessage(state.message);
    }
  }, [state.status, state.errors, state.message]);



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isCheckingUserName || userNameError) {
      e.preventDefault(); // ← block form submit
      return;
    }
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setSelectedBranch(selectedValue);
    setSelectedBranchId(event.target.value);

  };

  const clearFieldError = (fieldName: string) => {
    setLocalErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];  // removes ONLY that field
      return newErrors;
    });
    setLocalMessage(null);
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="w-full sm:w-1/2 md:w-1/3 mx-auto">
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
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearFieldError('name');
              }
              }
            />
          </div>

          <div id="user-error" aria-live="polite" aria-atomic="true">
            {localErrors.name &&
              localErrors.name.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
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
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value)
                  clearFieldError('username');
                }
                }
              />

            </div>

          </div>
          <div id="username-error" aria-live="polite" aria-atomic="true">
            {localErrors.username &&
              localErrors.username.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))}
            {isCheckingUserName && (
              <p className="text-gray-400 text-xs">Checking username...</p>
            )}
            {userNameError && (
              <p className="text-red-500 text-xs">{userNameError}</p>
            )}
          </div>
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  clearFieldError('password');
                }
                }
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
            {localErrors.password &&
              localErrors.password.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="mb-4">

          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            User type

          </label>
          <div className="relative">
            <select
              id="role"
              name="role"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"

              aria-describedby="role-error"

            >

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.display_name}
                </option>
              ))}
            </select>
          </div>

          <div id="role-error" aria-live="polite" aria-atomic="true">

          </div>
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

          <div id="branch-error" aria-live="polite" aria-atomic="true">
            {localErrors.branch &&
              localErrors.branch.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

      </div>
      {localMessage && (
        <p className="text-xs text-red-500">{state.message}</p>
      )}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/users"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isCheckingUserName || !!userNameError} className="disabled:opacity-50 disabled:cursor-not-allowed">Create User</Button>
      </div>
    </form>
  );
}

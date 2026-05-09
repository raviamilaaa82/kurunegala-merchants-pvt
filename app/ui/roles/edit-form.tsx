'use client';

import { Role } from '@/app/lib/definitions';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateRole, RoleState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';


export default function EditRoleForm({
  role,
  // customers,
}: {
  role: Role;
  // customers: CustomerField[];
}) {
  const initialState: RoleState = { message: null, errors: {} };
  const updateRoleWithId = updateRole.bind(null, role.id.toString());

  const [state, formAction] = useActionState(updateRoleWithId, initialState);


  return (
    <form action={formAction} className="w-full sm:w-1/2 md:w-1/3 mx-auto">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Role
          </label>
          <div className="relative">
            <input
              id="role"
              name="role"
              type="text"

              placeholder="Enter role name"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="role-error"
            />
          </div>

          <div id="role-error" aria-live="polite" aria-atomic="true">
            {/* {state.errors?.role &&
              state.errors.document.map((error: string) => (
                <p className="mt-2 text-xs text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
          </div>
        </div>

      </div>
      {state.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/roles"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Role</Button>
      </div>
    </form>
  );
}

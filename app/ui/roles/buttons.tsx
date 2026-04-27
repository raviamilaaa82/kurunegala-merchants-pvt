import { PencilIcon, PlusIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { disableRole } from '@/app/lib/actions';
// import { deleteInvoice } from '@/app/lib/actions';
// import { createDocument } from '@/app/lib/actions';

export function CreateRole() {
  return (
    <Link
      href="/dashboard/roles/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Role</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateRole({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/roles/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DisableRole({ id, is_enabled }: { id: string, is_enabled: boolean }) {
  const toggleRoleStatus = disableRole.bind(null, id, !is_enabled);
  return (
    <form action={toggleRoleStatus}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Enabled</span>
        {is_enabled ? <TrashIcon className="w-5" /> : <XCircleIcon className="w-5" />}
        {/* <TrashIcon className="w-5" /> */}
      </button>
    </form>
  );
}
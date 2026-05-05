import { PencilIcon, PlusIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { disableBranch } from '@/app/lib/actions';
// import { createDocument } from '@/app/lib/actions';

export function CreateBranch() {
  return (
    <Link
      href="/dashboard/branches/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Branch</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBranch({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/branches/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DisableBranch({ id, is_valid }: { id: string, is_valid: boolean }) {
  const toggleBranchStatus = disableBranch.bind(null, id, !is_valid);
  return (
    <form action={toggleBranchStatus}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Enabled</span>
        {is_valid ? <TrashIcon className="w-5" /> : <XCircleIcon className="w-5" />}
        {/* <TrashIcon className="w-5" /> */}
      </button>
    </form>
  );
}

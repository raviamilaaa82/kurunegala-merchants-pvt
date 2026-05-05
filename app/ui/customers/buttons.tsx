import { PencilIcon, PlusIcon, TrashIcon, XCircleIcon, ArrowDownRightIcon, CheckCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { acceptSubmissionAdminOrManager, rejectSubmissionAdminOrManager } from '@/app/lib/actions';
// import ApproveDialog from './approve-dialog';

export function CreateCustomer() {
  return (
    <Link
      href="/dashboard/customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customer</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateCustomer({ id, submissionId }: { id: string, submissionId: string }) {
  return (
    <Link
      // href={`/dashboard/customers/${id}/edit`}
      //going to use search query param instead of creating new document
      href={`/dashboard/customers/${id}/edit?submissionId=${submissionId}`}
      className="rounded-md border p-2 hover:bg-gray-100"

    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function UploadDocuments({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/customers/${id}/upload`}
      className="rounded-md border p-2 hover:bg-gray-100"

    >
      <ArrowDownRightIcon className="w-5" />
    </Link>
  );
}
//temp function for use sesion id+customer id
export function UploadDocumentsWithSessionId({ id, submission }: { id: string, submission: any }) {

  return (
    // {`/dashboard/customers/${id}/upload/${submissionId}`}
    <Link
      href={`/dashboard/customers/${id}/upload?submissionId=${submission.submission_id}&name=${encodeURIComponent(submission.customer_name)}`}
      className="rounded-md border p-2 hover:bg-gray-100"

    >
      <ArrowDownRightIcon className="w-5" />
    </Link>
  );
}




export function AcceptSumbission({ submissionId }: { submissionId: string }) {
  const toggleCustomerStatus = acceptSubmissionAdminOrManager.bind(null, submissionId);
  return (

    <form action={toggleCustomerStatus}>

      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Enabled</span>

        <CheckIcon className="w-5" />

      </button>
    </form>
  );
}

export function RejectSumbission({ submissionId }: { submissionId: string }) {
  const toggleCustomerStatus = rejectSubmissionAdminOrManager.bind(null, submissionId);
  return (
    <form action={toggleCustomerStatus}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Enabled</span>
        {/* {is_enabled ? <TrashIcon className="w-5" /> : <XCircleIcon className="w-5" />} */}
        <XMarkIcon className="w-5" />

      </button>
    </form>
  );
}

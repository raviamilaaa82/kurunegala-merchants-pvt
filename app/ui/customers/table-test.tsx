import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { fetchFilteredCustomers, fetchFilteredSubmission } from '@/app/lib/data';
// import { UpdateCustomer, DisableCustomer, UploadDocuments } from './buttons';
// import StatusTabs from './status-tabs';


import SubmissionRow from './submission-row';



export default async function CustomersTable({
  query,
  currentPage,
  status,
  userId,
  roleId,
  roleSlug,
  branch_id
  // customers,
}: {
  query: string,
  currentPage: number,
  status: string,
  userId?: string,
  roleId?: number,
  roleSlug?: string,
  branch_id: string,
  // customers: FormattedCustomersTable[];
}) {


  // const customers = await fetchFilteredCustomers(query);
  const custWithSubmissions = await fetchFilteredSubmission(query, currentPage, status, userId, roleId, branch_id);
  return (
    <div className="w-full">
      {/* <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1> */}
      {/* <Search placeholder="Search customers..." /> */}
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {custWithSubmissions?.map((submission) => (
                  // <CustomerRow key={customer.id} customer={customer} variant="mobile" />
                  <SubmissionRow key={submission.submission_id} submission={submission} loggedInRoleSlug={roleSlug} variant="mobile" />
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Mobile
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Location
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      C.Code
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {/* {customers.map((customer) => (

                    <CustomerRow key={customer.id} customer={customer} variant="desktop" />

                  ))} */}
                  {custWithSubmissions?.map((submission) => (
                    // <CustomerRow key={customer.id} customer={customer} variant="mobile" />
                    <SubmissionRow key={submission.submission_id} submission={submission} loggedInRoleSlug={roleSlug} variant="desktop" />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

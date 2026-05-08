import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  CustTableTypeWithSubmission,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
// import { fetchFilteredSubmissionFinal } from '@/app/lib/data';
import { UpdateDocument, DisableDocument } from '@/app/ui/documents/buttons';
import FinalSubmissionRow from './final-submission-row';


export default async function FinalTable({
  query,
  currentPage,
  // status,
  // userId,
  // roleId,
  roleSlug,
  // branch_id
  // customers,
  custWithSubmissions
}: {
  query: string,
  currentPage: number,
  // status: string,
  // userId?: string,
  // roleId?: number,
  roleSlug?: string,
  custWithSubmissions: CustTableTypeWithSubmission[]
  // branch_id: string,
}) {

  // const documents = await fetchFilteredDocuments(query);
  // const custWithSubmissions = await fetchFilteredSubmissionFinal(query, currentPage, status, userId, roleId, branch_id);
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
                  <FinalSubmissionRow key={submission.submission_id} submission={submission} loggedInRoleSlug={roleSlug} variant="mobile" />
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
                    <th scope="col" className="px-3 py-5 font-medium">
                      Validity
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {/* {customers.map((customer) => (
    
                        <CustomerRow key={customer.id} customer={customer} variant="desktop" />
    
                      ))} */}
                  {custWithSubmissions?.map((submission) => (
                    // <CustomerRow key={customer.id} customer={customer} variant="mobile" />
                    <FinalSubmissionRow key={submission.submission_id} submission={submission} loggedInRoleSlug={roleSlug} variant="desktop" />
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

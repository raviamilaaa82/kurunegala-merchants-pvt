import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { fetchFilteredBranch } from '@/app/lib/data';
import { DisableBranch } from '@/app/ui/branches/buttons';


export default async function BranchesTable({
  query,
  currentPage
  // customers,
}: {
  query: string,
  currentPage: number
  // customers: FormattedCustomersTable[];
}) {

  const branches = await fetchFilteredBranch(query);

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
                {branches?.map((branch) => (
                  <div
                    key={branch.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            {/* <Image
                              src={customer.image_url}
                              className="rounded-full"
                              alt={`${customer.name}'s profile picture`}
                              width={28}
                              height={28}
                            /> */}
                            <p>{branch.branch}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {branch.is_valid ? (
                            <span className="text-green-600">✓ Valid</span>
                          ) : (
                            <span className="text-red-600">✗ Invalid</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        {/* <p className="text-xs">Phone</p> */}
                        <p className="font-medium">{branch.company}</p>
                      </div>
                      {/* <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Paid</p>
                        <p className="font-medium">{customer.total_paid}</p>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Id
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Branch
                    </th>

                    <th scope="col" className="px-3 py-5 font-medium">
                      Company
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Validity
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {branches.map((branch) => (
                    <tr key={branch.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          {/* <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          /> */}
                          <p>{branch.id}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {branch.branch}
                      </td>

                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {branch.company}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {branch.is_valid ? (
                          <span className="text-green-600">✓ Valid</span>
                        ) : (
                          <span className="text-red-600">✗ Invalid</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <div className="flex justify-end gap-3">
                          {/* <UpdateBranch id={branch.id.toString()} /> */}
                          <DisableBranch id={branch.id.toString()} is_valid={branch.is_valid} />
                        </div>
                      </td>

                    </tr>
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

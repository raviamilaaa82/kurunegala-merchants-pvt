import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { fetchFilteredDocuments } from '@/app/lib/data';
import { UpdateDocument, DisableDocument } from '@/app/ui/documents/buttons';


export default async function DocumentsTable({
  query,
  currentPage
  // customers,
}: {
  query: string,
  currentPage: number
  // customers: FormattedCustomersTable[];
}) {

  const documents = await fetchFilteredDocuments(query);

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
                {documents?.map((document) => (
                  <div
                    key={document.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">

                            <p>{document.document}</p>
                          </div>
                        </div>

                        <div className="mb-2 flex items-center justify-between w-full">
                          <div className="flex items-center w-full">
                            <p className="text-sm text-gray-500">
                              {document.is_valid ? (
                                <span className="text-green-600">✓ Valid</span>
                              ) : (
                                <span className="text-red-600">✗ Invalid</span>
                              )}
                            </p>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">

                      <div className="ml-auto">

                        <DisableDocument id={document.id.toString()} is_valid={document.is_valid} />
                      </div>
                    </div>
                    {/* <div className="pt-4 text-sm">
                      <p>{customer.total_invoices} invoices</p>
                    </div> */}
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
                      Document Type
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Validity
                    </th>
                    {/* <th scope="col" className="px-3 py-5 font-medium">
                      Total Pending
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Total Paid
                    </th> */}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {documents.map((document) => (
                    <tr key={document.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          {/* <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          /> */}
                          <p>{document.id}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {document.document}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {document.is_valid ? (
                          <span className="text-green-600">✓ Valid</span>
                        ) : (
                          <span className="text-red-600">✗ Invalid</span>
                        )}
                      </td>
                      {/* <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {customer.total_pending}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {customer.total_paid}
                      </td> */}
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <div className="flex justify-end gap-3">
                          {/* <UpdateDocument id={document.id.toString()} /> */}
                          <DisableDocument id={document.id.toString()} is_valid={document.is_valid} />
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

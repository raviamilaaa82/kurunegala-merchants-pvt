import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { UpdateCustomer, UploadDocuments } from './buttons';
// import StatusTabs from './status-tabs';


import CustomerRow from './customer-row';



export default async function CustomersTable({
  query,
  currentPage,
  status,
  // customers,
}: {
  query: string,
  currentPage: number,
  status: string;
  // customers: FormattedCustomersTable[];
}) {

  const customers = await fetchFilteredCustomers(query);
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
                {customers?.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} variant="mobile" />
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Mobile
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Location
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {customers.map((customer) => (

                    <CustomerRow key={customer.id} customer={customer} variant="desktop" />

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

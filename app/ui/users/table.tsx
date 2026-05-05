import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  User
} from '@/app/lib/definitions';
import { fetchFilteredUsers } from '@/app/lib/data';
import { UpdateUsers, DisableUsers } from '@/app/ui/users/buttons';


export default async function UserTable({
  query,
  currentPage,
  roleSlug,
  userId

}: {
  query: string,
  currentPage: number,
  roleSlug?: string,
  userId: string,

}) {

  const users = await fetchFilteredUsers(query);

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
                {users?.map((user) => (
                  <div
                    key={user.id}
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
                            <p>{user.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {user.is_enabled ? (
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
                        <p className="font-medium">{user.phone}</p>
                      </div>
                      {/* <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Paid</p>
                        <p className="font-medium">{customer.total_paid}</p>
                      </div> */}
                    </div>
                    <div className="pt-4 text-sm">
                      <p>User Name: {user.user_name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    {/* <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Id
                    </th> */}
                    <th scope="col" className="px-3 py-5 font-medium">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Phone

                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      User Name

                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Validity
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {users.map((user) => (
                    <tr key={user.id} className="group">
                      {/* <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{user.id}</p>
                        </div>
                      </td> */}
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.name}
                      </td>

                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.phone}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {user.user_name}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {user.is_enabled ? (
                          <span className="text-green-600">✓ Valid</span>
                        ) : (
                          <span className="text-red-600">✗ Invalid</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">

                        <div className="flex justify-end gap-3">
                          {

                            userId === user?.id ? (<UpdateUsers id={user.id.toString()} />) : null

                          }


                          {roleSlug !== "agent" ? (
                            <DisableUsers id={user.id} is_enabled={user.is_enabled} />
                          ) : null
                          }
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

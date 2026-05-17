import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  User
} from '@/app/lib/definitions';
import { fetchFilteredUsers, fetchFilteredUsersByBranch } from '@/app/lib/data';
import { UpdateUsers, DisableUsers } from '@/app/ui/users/buttons';
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default async function UserTable({
  query,
  currentPage,
  roleSlug,
  userId,
  branchId

}: {
  query: string,
  currentPage: number,
  roleSlug?: string,
  userId: string,
  branchId?: string,

}) {
  let users: User[] = [];
  if (roleSlug === 'admin') {
    users = await fetchFilteredUsersByBranch(query, currentPage, branchId);
  } else {
    users = await fetchFilteredUsers(query, currentPage);
  }
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

                            <p>{user.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">

                          {user.is_enabled ? (
                            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">✓ Valid</Badge>

                          ) : (

                            <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">✗ Invalid</Badge>
                          )}



                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">

                        <p className="font-medium">{user.phone}</p>
                      </div>

                    </div>
                    <div className="pt-4 text-sm">
                      <p>User Name: {user.user_name}</p>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">

                      <div className="ml-auto">
                        {/* {

                          userId === user?.id ? (<UpdateUsers id={user.id.toString()} />) : null

                        } */}

                        <UpdateUsers id={user.id.toString()} />
                        <DisableUsers id={user.id} is_enabled={user.is_enabled} />
                        {/* {roleSlug !== "agent" ? (

                          <DisableUsers id={user.id} is_enabled={user.is_enabled} />

                        ) : null
                        } */}


                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-xs font-semibold">
                  <tr>

                    <th scope="col" className="px-3 py-5 font-medium">
                      NAME
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      PHONE

                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      USER NAME

                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      VALIDITY
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {users.map((user) => (
                    <tr key={user.id} className="group">

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
                          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">✓ Valid</Badge>

                        ) : (

                          <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">✗ Invalid</Badge>
                        )}

                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">

                        <div className="flex justify-end gap-3">
                          {/* {

                            userId === user?.id ? (<UpdateUsers id={user.id.toString()} />) : null

                          } */}
                          <UpdateUsers id={user.id.toString()} />
                          <DisableUsers id={user.id} is_enabled={user.is_enabled} />

                          {/* {roleSlug !== "agent" ? (
                            <DisableUsers id={user.id} is_enabled={user.is_enabled} />
                          ) : null
                          } */}
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

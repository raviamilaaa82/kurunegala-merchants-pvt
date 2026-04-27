// 'use client';

import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { fetchFilteredDocuments, fetchFilteredUsersWithRoles } from '@/app/lib/data';
// import { UpdateDocument, DisableDocument } from './buttons';
import { assignRoleToUser } from '@/app/lib/actions';
// import { useState, useTransition } from 'react';
import { RoleFilter } from './rolefilter';

type User = {
  id: string;
  email: string;
  name: string;
  role_id: number;
  role_slug: string;
  role_name: string;
};

type Role = {
  id: number;
  slug: string;
  display_name: string;
};




export default async function UsersClientTable({

  roles,
  currentUserId,
  query,
  currentPage
}: {

  roles: Role[];
  currentUserId: string;
  query: string;
  currentPage: number;
}) {
  // const [feedback, setFeedback] = useState<Record<string, string>>({});
  // const [isPending, startTransition] = useTransition();
  // const documents = await fetchFilteredDocuments(query);
  const users = await fetchFilteredUsersWithRoles(query);

  async function handleRoleChange(userId: string, roleId: number) {
    // startTransition(async () => {
    //   try {
    //     await assignRoleToUser(userId, roleId);
    //     setFeedback((prev) => ({ ...prev, [userId]: 'saved' }));
    //     setTimeout(() => {
    //       setFeedback((prev) => ({ ...prev, [userId]: '' }));
    //     }, 2000);
    //   } catch (e) {
    //     setFeedback((prev) => ({ ...prev, [userId]: 'error' }));
    //   }
    // });
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
              {/* <div className="md:hidden">
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
                ))}
              </div> */}
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      User
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Status
                    </th>
                    {/* <th scope="col" className="px-4 py-5 font-medium">
                      Total Paid
                    </th> */}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {users.map((user) => {
                    const isCurrentUser = user.id === currentUserId;
                    // const status = feedback[user.id];

                    return (

                      <tr key={user.id} className="group">
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                          <div className="flex items-center gap-3">
                            {/* {user.name} */}
                            <p>{user.name}</p>
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded">
                                you
                              </span>
                            )}

                          </div>
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {isCurrentUser ? (
                            // Lock own role — cannot self-change
                            <span className="text-gray-400 text-xs italic">
                              {user.role_name} (locked)
                            </span>
                          ) : (

                            <RoleFilter roles={roles} userId={user.id} roleId={user.role_id} />
                            // <select
                            //   defaultValue={user.role_id}
                            //   // disabled={isPending}
                            //   onChange={(e) =>
                            //     handleRoleChange(user.id, Number(e.target.value))
                            //   }
                            //   className="border rounded px-2 py-1 text-sm bg-white
                            //        focus:outline-none focus:ring-2 focus:ring-blue-400
                            //        disabled:opacity-50"
                            // >
                            //   {roles.map((role) => (
                            //     <option key={role.id} value={role.id}>
                            //       {role.display_name}
                            //     </option>
                            //   ))}
                            // </select>
                          )}
                        </td>
                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                          {/* {status === 'saved' && (
                            <span className="text-green-600 text-xs">✓ Saved</span>
                          )}
                          {status === 'error' && (
                            <span className="text-red-500 text-xs">✗ Failed</span>
                          )} */}
                        </td>

                      </tr>

                    );

                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

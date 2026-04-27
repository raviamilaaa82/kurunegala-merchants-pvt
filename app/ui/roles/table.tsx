import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';
import { fetchFilteredRoles, fetchAllRolesWithTheirPermissions } from '@/app/lib/data';
import { UpdateRole, DisableRole } from './buttons';
import UserRoleRow from './user-rol-row';
type RoleWithPermisson = {
  id: number;
  slug: string;
  display_name: string;
  permissions: string[] | null;
};

export default async function RoleTable({
  query,
  currentPage
  // customers,
}: {
  query: string,
  currentPage: number
  // customers: FormattedCustomersTable[];
}) {

  const roles = await fetchFilteredRoles(query);
  const allRolesWithPermi = await fetchAllRolesWithTheirPermissions();
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


                {allRolesWithPermi.map((usersWithRols) => (

                  // <CustomerRow key={customer.id} customer={customer} variant="desktop" />
                  <UserRoleRow key={usersWithRols.id} alRolsWithPermi={usersWithRols} variant="mobile" />

                ))}
                {/*{roles?.map((role) => (
                  <div
                    key={role.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                           
                            <p>{role.role}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {role.is_enabled ? (
                            <span className="text-green-600">✓ Valid</span>
                          ) : (
                            <span className="text-red-600">✗ Invalid</span>
                          )}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}*/}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    {/* <th scope="col" className="px-3 py-5 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Validity
                    </th> */}

                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">

                  {allRolesWithPermi.map((usersWithRols) => (

                    // <CustomerRow key={customer.id} customer={customer} variant="desktop" />
                    <UserRoleRow key={usersWithRols.id} alRolsWithPermi={usersWithRols} variant="desktop" />

                  ))}

                  {/* {roles.map((role) => (
                    <tr key={role.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">

                          <p>{role.id}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {role.role}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {role.is_enabled ? (
                          <span className="text-green-600">✓ Valid</span>
                        ) : (
                          <span className="text-red-600">✗ Invalid</span>
                        )}
                      </td>

                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <div className="flex justify-end gap-3">
                          <UpdateRole id={role.id.toString()} />
                          <DisableRole id={role.id.toString()} is_enabled={role.is_enabled} />
                        </div>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



import { fetchUserActivity } from '@/app/lib/data';
import { formatDistanceToNow } from 'date-fns';

export default async function HistoryTable({
  query,
  currentPage
  // customers,
}: {
  query: string,
  currentPage: number
  // customers: FormattedCustomersTable[];
}) {

  // const branches = await fetchFilteredBranch(query);
  const activities = await fetchUserActivity(query);
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
                {activities?.map((activity) => (
                  <div
                    key={activity.id}
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
                            <p>{activity.user_name}</p>
                          </div>
                        </div>
                        {/* <p className="text-sm text-gray-500">
                          {branch.is_valid ? (
                            <span className="text-green-600">✓ Valid</span>
                          ) : (
                            <span className="text-red-600">✗ Invalid</span>
                          )}
                        </p> */}
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      {/* <div className="flex w-1/2 flex-col">
                       
                        <p className="font-medium">{user.phone}</p>
                      </div> */}
                      <span className={`px-2 py-1 rounded-full text-xs ${activity.action === 'login'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                        }`}>
                        {activity.action}
                      </span>

                    </div>

                    <div className="flex w-full items-center justify-between border-b py-5">

                      {activity.page}
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">

                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      User
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Action
                    </th>

                    <th scope="col" className="px-3 py-5 font-medium">
                      Page
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          {/* <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          /> */}
                          <p>{activity.user_name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${activity.action === 'login'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                          }`}>
                          {activity.action}
                        </span>

                      </td>

                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {/* {a.page ?? '—'} */}
                        {activity.page}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </td>

                      {/* <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <div className="flex justify-end gap-3">
                          <UpdateBranch id={branch.id.toString()} />
                          <DisableBranch id={branch.id.toString()} is_valid={branch.is_valid} />
                        </div>
                      </td> */}

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

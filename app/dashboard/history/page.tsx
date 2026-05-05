import Table from "@/app/ui/history/table";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

import Pagination from "@/app/ui/history/pagination";
import { fetchUserActivityPages } from "@/app/lib/data";


export default async function HistoryPage(props: { searchParams?: Promise<{ query?: string, page?: string }> }) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchUserActivityPages(query);


    return (

        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Activity History</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search activity..." />
                {/* <CreateDocument /> */}
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>




        // <div className="p-4">
        //     <h1 className="text-xl font-bold mb-4">User Activity History</h1>
        //     <table className="w-full text-sm border-collapse">
        //         <thead>
        //             <tr className="bg-gray-100 text-left">
        //                 <th className="p-2 border">User</th>
        //                 <th className="p-2 border">Action</th>
        //                 <th className="p-2 border">Page</th>
        //                 <th className="p-2 border">Time</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {activities.map((a, i) => (
        //                 <tr key={i} className="hover:bg-gray-50">
        //                     <td className="p-2 border">{a.user_name}</td>
        //                     <td className="p-2 border">
        //                         <span className={`px-2 py-1 rounded-full text-xs ${a.action === 'login'
        //                             ? 'bg-green-100 text-green-700'
        //                             : 'bg-blue-100 text-blue-700'
        //                             }`}>
        //                             {a.action}
        //                         </span>
        //                     </td>
        //                     <td className="p-2 border">{a.page ?? '—'}</td>
        //                     <td className="p-2 border text-gray-500">
        //                         {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
        //                     </td>
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
    );
}
import Table from "@/app/ui/reports/table";
import { lusitana } from "@/app/ui/fonts";
// import Search from "@/app/ui/search";
import Select from "@/app/ui/select";
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { CreateDocument } from "@/app/ui/reports/buttons";
import Pagination from "@/app/ui/reports/pagination";
import { fetchDocumentPages, getSubmissionsByStatus, getSubmissionsCount } from "@/app/lib/data";

export default async function Page(props: { searchParams?: Promise<{ status?: string, page?: string }> }) {

    const searchParams = await props.searchParams;
    const status = searchParams?.status || 'pending_admin';
    const currentPage = Number(searchParams?.page) || 1;
    // const totalPages = await fetchDocumentPages(query);
    // console.log(status);

    const [submission, totalPages] = await Promise.all([
        getSubmissionsByStatus(status, currentPage),
        getSubmissionsCount(status)

    ]);
    // const results = 
    // console.log(results);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Reports</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                {/* <Search placeholder="Search customers..." /> */}

                <Select />
            </div>
            <Suspense key={status + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={status} currentPage={currentPage} submissions={submission} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>

    );
}
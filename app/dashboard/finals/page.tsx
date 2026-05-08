import Table from "@/app/ui/final/table";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

import Pagination from "@/app/ui/final/pagination";
import { fetchDocumentPages, fetchdBranches, fetchFilteredSubmissionFinal } from "@/app/lib/data";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import BranchDropDowns from "@/app/ui/final/branch-select";

export default async function Page(props: { searchParams?: Promise<{ query?: string, page?: string, status?: string, branch?: string }> }) {

    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");  // ✅ use redirect, not NextResponse
    }

    const agentId = session?.user.id;
    const agentRoleId = session?.user.roleId;
    const userName = session?.user.name;
    const loggedInroleSlug = session?.user.roleSlug;


    const searchParams = await props.searchParams;
    const branch_id = searchParams?.branch || '';
    const status = searchParams?.status || '';
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const branches = await fetchdBranches();
    // const totalPages = await fetchDocumentPages(query);
    // const totalPages = fetchFinalApprovedPages(query);

    const { custWithSubmissions, totalPages } = await fetchFilteredSubmissionFinal(query, currentPage, status, agentId, agentRoleId, branch_id);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Approved Data</h1>
            </div>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                {/* <StatusTabs roleSlug={loggedInroleSlug} /> */}
                <div className="md:ml-auto">
                    <BranchDropDowns branches={branches} />
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search customers..." />
                {/* <CreateDocument /> */}
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} roleSlug={loggedInroleSlug} custWithSubmissions={custWithSubmissions} />
                {/* status={status} userId={agentId} roleId={agentRoleId} branch_id={branch_id}*/}
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                {/* <Pagination totalPages={totalPages} /> */}
            </div>
        </div>

    );
}
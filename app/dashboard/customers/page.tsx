// import Table from "@/app/ui/customers/table";
import Table from "@/app/ui/customers/table-test";
import Pagination from "@/app/ui/customers/pagination";
import { CreateCustomer } from "@/app/ui/customers/buttons";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { fetchCustomerPages, fetchCompanies, fetchdBranches } from "@/app/lib/data";
import StatusTabs from "@/app/ui/customers/status-tabs";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import BranchDropDowns from "@/app/ui/customers/branch-select";



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
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const status = searchParams?.status || '';//additionally added
    const branch_id = searchParams?.branch || '';
    const totalPages = await fetchCustomerPages(query);
    const companies = await fetchCompanies();
    const branches = await fetchdBranches();

    return (

        <div className="w-full">
            <div className="flex w-full flex-col sm:flex-row sm:justify-between sm:items-center">
                {/* userName comes first in DOM */}
                <h1 className="mb-2 sm:mb-0 sm:order-2">
                    {userName}
                </h1>
                {/* Title second in DOM */}
                <h1 className={`${lusitana.className} text-2xl sm:order-1`}>
                    Customer Management
                </h1>
            </div>

            {/* className="mt-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center" */}
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                <StatusTabs roleSlug={loggedInroleSlug} />
                <div className="md:ml-auto">
                    <BranchDropDowns branches={branches} />
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search customers..." />
                <CreateCustomer />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} status={status} userId={agentId} roleId={agentRoleId} roleSlug={loggedInroleSlug} branch_id={branch_id} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>

    );
}
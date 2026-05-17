import Table from "@/app/ui/users/table";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { CreateUser } from "@/app/ui/users/buttons";
import Pagination from "@/app/ui/users/pagination";
import { fetchUsersPages, fetchUsersPagesByBranch } from "@/app/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page(props: { searchParams?: Promise<{ query?: string, page?: string }> }) {

    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");  // ✅ use redirect, not NextResponse
    }

    const agentId = session?.user.id;
    const agentRoleId = session?.user.roleId;
    const userName = session?.user.name;
    const loggedInroleSlug = session?.user.roleSlug;
    const branch = session?.user?.branch;
    //for agent no need to go to table and create user tabs
    if (loggedInroleSlug === 'agent') {
        redirect(`/dashboard/users/${agentId}/edit`);
    }

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    // now if you need to show all users to manager then run fetchUsersPages
    let totalPages = 0;
    if (loggedInroleSlug === 'admin') {
        totalPages = await fetchUsersPagesByBranch(query, branch);
    } else {
        totalPages = await fetchUsersPages(query);
    }


    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>User Management</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search users..." />
                <CreateUser />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} roleSlug={loggedInroleSlug} userId={agentId} branchId={branch} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>

    );
}
import Table from "@/app/ui/types/table";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { CreateType } from "@/app/ui/types/buttons";
import Pagination from "@/app/ui/types/pagination";
import { fetchTypePages, fetchTypePagesByBranch } from "@/app/lib/data";
import { auth } from "@/auth";

export default async function Page(props: { searchParams?: Promise<{ query?: string, page?: string }> }) {
    const session = await auth();
    // const loggedInroleSlug = session?.user.roleSlug;
    const branch = session?.user?.branch;
    const loggedInroleSlug = session?.user.roleSlug;

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    let totalPages = 0;
    if (loggedInroleSlug === 'admin') {
        totalPages = await fetchTypePagesByBranch(query, branch);

    } else {
        totalPages = await fetchTypePages(query);
    }



    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Type Management</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search types..." />
                <CreateType />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} roleSlug={loggedInroleSlug} branchId={branch} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>

    );
}
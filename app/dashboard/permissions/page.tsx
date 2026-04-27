import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Table from "@/app/ui/permissions/table";
import { fetchUsersWithRoles, fetchAllRoles, fetchUsersWithRolesPages, fetchUsersPages } from '@/app/lib/data';
// import UsersClient from './users-client';
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

import Search from '@/app/ui/search';
import Pagination from "@/app/ui/permissions/pagination";

export default async function Page(props: { searchParams?: Promise<{ query?: string, page?: string }> }) {

    const session = await auth();

    if (!session?.user?.permissions?.includes('manage:users')) {
        redirect('/dashboard');
    }

    // const [users, roles] = await Promise.all([
    //     fetchUsersWithRoles(),
    //     fetchAllRoles(),
    // ]);
    // const users = await fetchUsersWithRoles();
    const roles = await fetchAllRoles();
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';

    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchUsersWithRolesPages(query);
    // const totalPages = await fetchUsersPages(query);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Permission Management</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search users..." />
                {/* <CreateCustomer /> */}
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table roles={roles} currentUserId={session.user.id} query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
        </div>

    );
}
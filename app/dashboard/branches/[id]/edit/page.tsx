import Form from '@/app/ui/branches/edit-form';
import Breadcrumbs from '@/app/ui/branches/breadcrumbs';
import { fetchCompanies, fetcBranchById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from "@/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    const session = await auth();
    const loggedInroleSlug = session?.user.roleSlug;
    const companies = await fetchCompanies();
    const branch = await fetcBranchById(id);
    // if (!user) {
    //     notFound();
    // }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'branches', href: '/dashboard/branches' },
                    {
                        label: 'Edit Branch',
                        href: `/dashboard/branches/${id}/edit`,

                        active: true,
                    },
                ]}
            />
            <Form companies={companies} selectedBranch={branch} />
        </main>
    );
}
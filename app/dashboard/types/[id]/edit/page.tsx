import Form from '@/app/ui/types/edit-form';
import Breadcrumbs from '@/app/ui/types/breadcrumbs';
import { fetchdBranches, fetchTypeById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from "@/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    const session = await auth();
    const loggedInroleSlug = session?.user.roleSlug;

    const type = await fetchTypeById(id);
    const branches = await fetchdBranches();
    // const companies = await fetchCompanies();
    // const branch = await fetcBranchById(id);
    // if (!user) {
    //     notFound();
    // }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'types', href: '/dashboard/types' },
                    {
                        label: 'Edit Type',
                        href: `/dashboard/types/${id}/edit`,

                        active: true,
                    },
                ]}
            />
            <Form branches={branches} selectedType={type} />
        </main>
    );
}
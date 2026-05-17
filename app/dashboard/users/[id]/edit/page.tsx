import Form from '@/app/ui/users/edit-form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchUserById, fetchdBranches } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { auth } from "@/auth";

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    const session = await auth();
    const loggedInroleSlug = session?.user.roleSlug;
    const branch = session?.user?.branch;

    const [user, branches] = await Promise.all([
        fetchUserById(id),

        fetchdBranches(),
    ]);
    if (!user) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'users', href: '/dashboard/users' },
                    {
                        label: 'Edit User',
                        href: `/dashboard/users/${id}/edit`,

                        active: true,
                    },
                ]}
            />
            <Form user={user} branches={branches} roleSlug={loggedInroleSlug} branchId={branch} />
        </main>
    );
}
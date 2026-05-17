import Form from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchRoles, fetchdBranches } from '@/app/lib/data';

export default async function Page() {
    const roles = await fetchRoles();
    const branches = await fetchdBranches();
    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Users', href: '/dashboard/users' },
            { label: 'Create user', href: '/dashboard/users/create', active: true }]} />
            <Form roles={roles} branches={branches} />
        </main>
    );
}
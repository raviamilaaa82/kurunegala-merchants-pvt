import Form from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/users/breadcrumbs';
import { fetchRoles } from '@/app/lib/data';

export default async function Page() {
    const roles = await fetchRoles();
    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Users', href: '/dashboard/users' },
            { label: 'Create user', href: '/dashboard/users/create', active: true }]} />
            <Form roles={roles} />
        </main>
    );
}
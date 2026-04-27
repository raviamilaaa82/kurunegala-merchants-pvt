import Form from '@/app/ui/roles/create-form';
import Breadcrumbs from '@/app/ui/roles/breadcrumbs';


export default async function Page() {

    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Roles', href: '/dashboard/roles' },
            { label: 'Create roles', href: '/dashboard/roles/create', active: true }]} />
            <Form />
        </main>
    );
}
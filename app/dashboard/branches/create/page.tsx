import Form from '@/app/ui/branches/create-form';
import Breadcrumbs from '@/app/ui/branches/breadcrumbs';
import { fetchCompanies } from '@/app/lib/data';

export default async function Page() {

    const companies = await fetchCompanies();

    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Branches', href: '/dashboard/branches' },
            { label: 'Create branch', href: '/dashboard/branches/create', active: true }]} />
            <Form companies={companies} />
        </main>
    );
}
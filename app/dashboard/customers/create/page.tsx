import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchdBranches } from '@/app/lib/data';


export default async function Page() {


    const branches = await fetchdBranches();

    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Customers', href: '/dashboard/customers' },
            { label: 'Create Customer', href: '/dashboard/customers/create', active: true }]} />
            <Form branches={branches} />
        </main>
    );
}
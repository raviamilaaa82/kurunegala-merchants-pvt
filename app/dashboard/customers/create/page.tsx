import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchDocuments } from '@/app/lib/data';

export default async function Page() {
    // const customers = await fetchCustomers();
    const documents = await fetchDocuments();
    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Customers', href: '/dashboard/customers' },
            { label: 'Create Customer', href: '/dashboard/customers/create', active: true }]} />
            <Form documents={documents} />
        </main>
    );
}
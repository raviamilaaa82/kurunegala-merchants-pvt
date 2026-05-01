import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchDocuments } from '@/app/lib/data';

// interface PageProps {
//     searchParams: { [key: string]: string | string[] | undefined }
// }
export default async function Page() {
    // const params = await searchParams;
    // const customerId = Array.isArray(params.id) ? params.id[0] : params.id ?? "";

    // const customers = await fetchCustomers();
    // const documents = await fetchDocuments();
    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Customers', href: '/dashboard/customers' },
            { label: 'Create Customer', href: '/dashboard/customers/create', active: true }]} />
            <Form />
        </main>
    );
}
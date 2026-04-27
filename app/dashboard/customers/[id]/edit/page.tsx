import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomerById, fetchImageListFromLocalDb, fetchDocuments } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    // customers, images, documents
    const [customers, documents] = await Promise.all([
        fetchCustomerById(id),

        fetchDocuments(),
    ]);
    if (!documents) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/customers' },
                    {
                        label: 'Edit Customer',
                        href: `/dashboard/customers/${id}/edit`,

                        active: true,
                    },
                ]}
            />
            {/* images={images} */}
            <Form customers={customers} documents={documents} />
        </main>
    );
}
import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomerBySubmissionId, fetchdBranches } from '@/app/lib/data';
import { notFound } from 'next/navigation';


export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ submissionId?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;//new params submissionId

    const id = params.id;
    const submissionId = searchParams?.submissionId;

    const customer = await fetchCustomerBySubmissionId(submissionId ?? null);
    const branches = await fetchdBranches();

    if (!customer) {
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

            <Form customer={customer} submisnId={submissionId} branches={branches} />
        </main>
    );
}
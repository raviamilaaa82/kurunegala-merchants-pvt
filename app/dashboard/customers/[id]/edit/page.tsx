import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomerBySubmissionId } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { CustTableTypeWithSubmission } from '@/app/lib/definitions';

// props: { params: Promise<{ id: string }> }
export default async function Page(props: {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ submissionId?: string }>;
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;//new params submissionId

    const id = params.id;
    const submissionId = searchParams?.submissionId;


    // customers, images, documents
    // console.log(id);
    // console.log("id");
    // const [customers, documents] = await Promise.all([
    //     fetchCustomerById(id),

    //     fetchDocuments(),
    // ]);


    const customer = await fetchCustomerBySubmissionId(submissionId ?? null);

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
            {/* images={images} */}
            <Form customer={customer} submisnId={submissionId} />
        </main>
    );
}
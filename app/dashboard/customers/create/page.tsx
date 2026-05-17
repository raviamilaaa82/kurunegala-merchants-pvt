import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchdBranches, fetchTypes } from '@/app/lib/data';
import { auth } from "@/auth";

export default async function Page() {

    const session = await auth();
    const loggedInroleSlug = session?.user.roleSlug;
    const branch = session?.user?.branch;

    const branches = await fetchdBranches();
    const types = await fetchTypes();

    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Customers', href: '/dashboard/customers' },
            { label: 'Create Customer', href: '/dashboard/customers/create', active: true }]} />
            <Form branches={branches} types={types} branch={branch} roleSlug={loggedInroleSlug} />
        </main>
    );
}
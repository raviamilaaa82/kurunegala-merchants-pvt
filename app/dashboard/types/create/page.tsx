import Form from '@/app/ui/types/create-form';
import Breadcrumbs from '@/app/ui/types/breadcrumbs';
import { fetchdBranches } from '@/app/lib/data';

export default async function Page() {

    const branches = await fetchdBranches();

    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Types', href: '/dashboard/types' },
            { label: 'Create type', href: '/dashboard/types/create', active: true }]} />
            <Form branches={branches} />
        </main>
    );
}
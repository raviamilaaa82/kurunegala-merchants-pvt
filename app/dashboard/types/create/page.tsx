import Form from '@/app/ui/types/create-form';
import Breadcrumbs from '@/app/ui/types/breadcrumbs';
import { fetchdBranches } from '@/app/lib/data';
import { auth } from "@/auth";

export default async function Page() {
    const session = await auth();
    const loggedInroleSlug = session?.user.roleSlug;
    const branch = session?.user?.branch;


    const branches = await fetchdBranches();
    // const branches=await fetcBranchById(branch);

    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Types', href: '/dashboard/types' },
            { label: 'Create type', href: '/dashboard/types/create', active: true }]} />
            <Form branches={branches} branchId={branch} />
        </main>
    );
}
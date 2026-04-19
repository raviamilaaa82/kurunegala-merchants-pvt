import Form from '@/app/ui/documents/edit-form';
import Breadcrumbs from '@/app/ui/documents/breadcrumbs';
import { fetchDocumentById } from '@/app/lib/data';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;

    const document = await fetchDocumentById(id);
    return (
        <main>
            <Breadcrumbs breadcrumbs={[{ label: 'Documents', href: '/dashboard/documents' },
            { label: 'Edit document', href: '/dashboard/documents/edit', active: true }]} />
            <Form document={document} />
        </main>
    );
}
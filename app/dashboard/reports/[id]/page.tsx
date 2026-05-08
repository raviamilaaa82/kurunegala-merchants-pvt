import Breadcrumbs from '@/app/ui/reports/breadcrumbs';
import { getSubmissionById } from '@/app/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
// import DownloadPDFButton from '@/app/ui/reports/pdf-report-download-button';
import SingleReportDetails from '@/app/ui/reports/single-report-details';


export default async function ReportDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const submission = await getSubmissionById(id);

    if (!submission) notFound();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* <Breadcrumbs breadcrumbs={[{ label: 'Types', href: '/dashboard/types' },
            { label: 'Create type', href: '/dashboard/types/create', active: true }]} /> */}
            <Breadcrumbs breadcrumbs={[{ label: 'Reports', href: '/dashboard/reports' },
            { label: 'Single Report', href: '/reports/single report', active: true }]} />
            {/* Header */}
            <SingleReportDetails submission={submission} />

        </div>
    );
}
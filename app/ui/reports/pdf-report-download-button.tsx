'use client';

interface Submission {
    submission_id: number;
    agent_id: string;
    status: string;
    admin_note: string | null;
    manager_note: string | null;
    created_at: string;
    customer_name: string;
    mobile: string;
    cust_code: string;
    branch_id: string;
    address: string;
    documents: {
        document_name: string;
        is_valid: boolean;
    }[];
}

export default function DownloadPDFButton({ id }: { id: string }) {

    async function downloadPDF() {
        const res = await fetch(`/api/reports/${id}`);
        const data: Submission = await res.json();

        const { jsPDF } = await import('jspdf');
        const autoTable = (await import('jspdf-autotable')).default;

        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Submission Report', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

        // Customer Details
        doc.setFontSize(13);
        doc.setTextColor(37, 99, 235);
        doc.text('Customer Details', 14, 40);

        autoTable(doc, {
            startY: 44,
            body: [
                ['Submission ID', String(data.submission_id)],
                ['Customer Name', data.customer_name],
                ['Customer Code', data.cust_code],
                ['Mobile', data.mobile],
                ['Status', data.status],
                ['Address', data.address],
                ['Created At', new Date(data.created_at).toLocaleDateString()],
                ['Admin Note', data.admin_note ?? '-'],
                ['Manager Note', data.manager_note ?? '-'],
            ],
            theme: 'striped',
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 60, textColor: [80, 80, 80] },
                1: { cellWidth: 120 },
            },
        });

        // Documents
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(13);
        doc.setTextColor(37, 99, 235);
        doc.text('Documents', 14, finalY);

        autoTable(doc, {
            startY: finalY + 4,
            head: [['#', 'Document Name', 'Valid']],
            body: data.documents.map((d, i) => [
                i + 1,
                d.document_name,
                d.is_valid ? 'Yes' : 'No',
            ]),
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] },
            didParseCell: (cell: any) => {
                if (cell.column.index === 2 && cell.cell.raw === '✗ No') {
                    cell.cell.styles.textColor = [220, 38, 38];
                }
                if (cell.column.index === 2 && cell.cell.raw === '✓ Yes') {
                    cell.cell.styles.textColor = [22, 163, 74];
                }
            },
        });

        doc.save(`submission-${id}.pdf`);
    }

    return (
        <button
            onClick={downloadPDF}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
        >
            Download PDF
        </button>
    );
}
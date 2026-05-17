
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import * as XLSX from 'xlsx';


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const format = new URL(req.url).searchParams.get('format');

    const rows = await sql`
    SELECT
        s.id AS submission_id,
        s.agent_id,
        s.status,
        s.admin_note,
        s.manager_note,
        s.created_at,
        c.name AS customer_name,
        c.mobile,
        c.cust_code,
        c.branch_id,
        c.address,
        td.document AS document_name,
        td.is_valid
    FROM submission s
    JOIN document d ON d.submission_id = s.id
    JOIN customers c ON d.master_id = c.id
    JOIN tbl_documents td ON d.document_id = td.id
    WHERE s.id = ${id}
    ORDER BY td.document
  `;

    if (!rows.length) {
        return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const first = rows[0];
    const data = {
        submission_id: first.submission_id,
        agent_id: first.agent_id,
        status: first.status,
        admin_note: first.admin_note,
        manager_note: first.manager_note,
        created_at: first.created_at,
        customer_name: first.customer_name,
        mobile: first.mobile,
        cust_code: first.cust_code,
        branch_id: first.branch_id,
        address: first.address,
        documents: rows.map(r => ({
            document_name: r.document_name,
            is_valid: r.is_valid,
        })),
    };

    if (format === 'excel') {
        const wb = XLSX.utils.book_new();

        // Sheet 1 - Submission Info
        const infoSheet = XLSX.utils.json_to_sheet([{
            'Submission ID': data.submission_id,
            'Customer Name': data.customer_name,
            'Customer Code': data.cust_code,
            'Mobile': data.mobile,
            'Address': data.address,
            'Status': data.status,
            'Created At': new Date(data.created_at).toLocaleDateString(),
            'Admin Note': data.admin_note ?? '',
            'Manager Note': data.manager_note ?? '',
        }]);
        XLSX.utils.book_append_sheet(wb, infoSheet, 'Submission Info');

        // Sheet 2 - Documents
        const docSheet = XLSX.utils.json_to_sheet(
            data.documents.map((d, i) => ({
                '#': i + 1,
                'Document': d.document_name,
                'Valid': d.is_valid ? 'Yes' : 'No',
            }))
        );
        XLSX.utils.book_append_sheet(wb, docSheet, 'Documents');

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=submission-${id}.xlsx`,
            },
        });
    }




    return NextResponse.json(data);
}










// import { NextRequest, NextResponse } from 'next/server';
// import { sql } from '@/app/lib/db'; // your db connection
// import * as XLSX from 'xlsx';

// export async function GET(req: NextRequest) {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');
//     const format = searchParams.get('format'); // 'pdf' or 'excel'
//     console.log("excell");
//     console.log(id);
//     if (!id) return NextResponse.json({ error: 'No ID provided' }, { status: 400 });

//     // Fetch customer from DB
//     const customer = await sql`
//         'SELECT * FROM customers WHERE id = $1', [id]
//     ;`
//     console.log("excell");
//     console.log(customer);
//     if (!customer.length) {
//         return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
//     }

//     // const data = customer.rows[0];
//     const data = customer;
//     if (format === 'excel') {
//         const ws = XLSX.utils.json_to_sheet([data]);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Customer');
//         const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

//         return new NextResponse(buffer, {
//             headers: {
//                 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//                 'Content-Disposition': `attachment; filename=customer-${id}.xlsx`,
//             },
//         });
//     }

//     // Return JSON for PDF (PDF generated on client side)
//     return NextResponse.json(data);
// }
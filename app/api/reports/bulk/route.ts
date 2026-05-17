import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const ids: number[] = body.ids;



        if (!ids || !ids.length) {
            return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
        }

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
      WHERE s.id =ANY(${ids}::int[])
      ORDER BY s.id, td.document
    `;



        if (!rows.length) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        const wb = XLSX.utils.book_new();

        // Sheet 1 — Summary
        const grouped = rows.reduce((acc: any, row) => {
            if (!acc[row.submission_id]) {
                acc[row.submission_id] = {
                    'Submission ID': row.submission_id,
                    'Customer Name': row.customer_name,
                    'Customer Code': row.cust_code,
                    'Mobile': row.mobile,
                    'Branch': row.branch_id,
                    'Address': row.address,
                    'Status': row.status,
                    'Created At': new Date(row.created_at).toLocaleDateString(),
                    'Admin Note': row.admin_note ?? '',
                    'Manager Note': row.manager_note ?? '',
                    'Total Docs': 0,
                    'Valid Docs': 0,
                };
            }
            acc[row.submission_id]['Total Docs']++;
            if (row.is_valid) acc[row.submission_id]['Valid Docs']++;
            return acc;
        }, {});

        const summarySheet = XLSX.utils.json_to_sheet(Object.values(grouped));
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

        // Sheet 2 — Documents
        const docSheet = XLSX.utils.json_to_sheet(
            rows.map((r, i) => ({
                '#': i + 1,
                'Submission ID': r.submission_id,
                'Customer Name': r.customer_name,
                'Document': r.document_name,
                'Valid': r.is_valid ? 'Yes' : 'No',
            }))
        );
        XLSX.utils.book_append_sheet(wb, docSheet, 'Documents');

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=submissions-report.xlsx',
            },
        });

    } catch (error) {
        console.error('Bulk export error:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}









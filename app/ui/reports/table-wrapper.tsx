'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"

export default function TableWrapper({ submissions }: { submissions: any[] }) {
    const [selected, setSelected] = useState<number[]>([]);

    const statusStyles: Record<string, string> = {
        approved: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        pending_admin: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        pending_manager: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        admin_rejected: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
        manager_rejected: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    };

    const labelMap: Record<string, string> = {
        approved: "Approved",
        pending_admin: "Pending Admin",
        pending_manager: "Pending Manager",
        admin_rejected: "Admin Rejected",
        manager_rejected: "Manager Rejected",
    };

    function toggleOne(id: number) {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    function toggleAll() {
        if (selected.length === submissions.length) {
            setSelected([]);
        } else {
            setSelected(submissions.map(s => s.submission_id));
        }
    }

    async function exportSelected() {
        if (!selected.length) return alert('Please select at least one submission');

        const res = await fetch('/api/reports/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selected }),
        });

        if (!res.ok) return alert('Export failed');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'submissions-report.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }

    if (!submissions.length) {
        return <p className="text-gray-500 text-sm mt-4">No submissions found.</p>;
    }

    return (
        <div>
            {/* Export Bar */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={selected.length === submissions.length && submissions.length > 0}
                        onChange={toggleAll}
                        className="rounded"
                    />
                    <span className="text-sm text-gray-500">
                        {selected.length > 0 ? `${selected.length} selected` : 'Select all'}
                    </span>
                </div>
                <button
                    onClick={exportSelected}
                    disabled={!selected.length}
                    className="mt-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg
                     hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Export Selected to Excel
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="w-full text-sm bg-white">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3"></th>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-left">Code</th>
                            <th className="px-4 py-3 text-left">Mobile</th>
                            <th className="px-4 py-3 text-left">Docs</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.map((s) => (
                            <tr
                                key={s.submission_id}
                                className={`hover:bg-gray-50 ${selected.includes(s.submission_id) ? 'bg-blue-50' : ''
                                    }`}
                            >
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(s.submission_id)}
                                        onChange={() => toggleOne(s.submission_id)}
                                        className="rounded"
                                    />
                                </td>
                                <td className="px-4 py-3">{s.submission_id}</td>
                                <td className="px-4 py-3 font-medium">{s.customer_name}</td>
                                <td className="px-4 py-3 text-gray-500">{s.cust_code}</td>
                                <td className="px-4 py-3">{s.mobile}</td>
                                <td className="px-4 py-3">{s.document_count} docs</td>
                                <td className="px-4 py-3">

                                    {statusStyles[s.status] && (
                                        <Badge className={statusStyles[s.status]}>
                                            {labelMap[s.status]}
                                        </Badge>
                                    )}

                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {new Date(s.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/dashboard/reports/${s.submission_id}`}
                                        className="text-blue-600 hover:underline text-xs"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
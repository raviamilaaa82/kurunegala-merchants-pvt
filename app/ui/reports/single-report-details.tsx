import Link from "next/link";
import DownloadPDFButton from '@/app/ui/reports/pdf-report-download-button';
import { Sumana } from "next/font/google";

export default function SingleReportDetails({ submission }: { submission: any }) {


    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Submission #{submission.submission_id}</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {new Date(submission.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                        submission.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {submission.status}
                    </span>
                    {/* <Link
                        href="/dashboard/reports"
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        ← Back
                    </Link> */}
                </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-5 mb-5">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Customer Details</h2>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium">{submission.customer_name}</span>

                    <span className="text-gray-500">Customer Code</span>
                    <span>{submission.cust_code}</span>

                    <span className="text-gray-500">Mobile</span>
                    <span>{submission.mobile}</span>

                    <span className="text-gray-500">Branch</span>
                    <span>{submission.branch}</span>

                    <span className="text-gray-500">Landline</span>
                    <span>{submission.landline}</span>

                    <span className="text-gray-500">Address</span>
                    <span>{submission.address}</span>

                    <span className="text-gray-500">Owner's ID</span>
                    <span>{submission.owner_identity}</span>
                    {/* <span className="text-gray-500">Agent ID</span>
                    <span>{submission.agent_id}</span> */}
                </div>
            </div>

            {/* Notes */}
            {(submission.admin_note || submission.manager_note) && (
                <div className="bg-white rounded-lg shadow p-5 mb-5">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2">Notes</h2>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        {submission.admin_note && (
                            <div>
                                <span className="text-gray-500 block mb-1">Admin Note</span>
                                <p className="bg-gray-50 rounded p-3">{submission.admin_note}</p>
                            </div>
                        )}
                        {submission.manager_note && (
                            <div>
                                <span className="text-gray-500 block mb-1">Manager Note</span>
                                <p className="bg-gray-50 rounded p-3">{submission.manager_note}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Documents */}
            <div className="bg-white rounded-lg shadow p-5 mb-5">
                <h2 className="text-lg font-semibold mb-4 border-b pb-2">
                    Documents
                    <span className="ml-2 text-sm font-normal text-gray-500">
                        ({submission.documents.length} total)
                    </span>
                </h2>
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Document Name</th>
                            <th className="px-4 py-3 text-left">Valid</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submission.documents.map((doc: { document_name: string, is_valid: string }, i: number) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                                <td className="px-4 py-3 font-medium">{doc.document_name}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.is_valid
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}>
                                        {doc.is_valid ? '✓ Valid' : '✗ Invalid'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Report Buttons /api/reports?id=${id}&format=excel  */}
            <div className="flex gap-3">
                <Link
                    href={`/api/reports/${submission.submission_id}?format=excel`}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                >
                    Download Excel
                </Link>
                {/* <Link
                    href={`/api/reports/${id}?format=pdf`}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
                >
                    Download PDF
                </Link> */}

                <DownloadPDFButton id={submission.submission_id} />
            </div>

        </>



    );

}
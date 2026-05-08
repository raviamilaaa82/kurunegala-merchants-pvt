
import TableWrapper from './table-wrapper';

export default async function Table({
  query,
  currentPage,
  submissions,
}: {
  query: string;
  currentPage: number;
  submissions: any[];
}) {
  return <TableWrapper submissions={submissions} />;
}



// import Image from 'next/image';
// import { lusitana } from '@/app/ui/fonts';
// import Search from '@/app/ui/search';
// import {
//   CustomersTableType,
//   FormattedCustomersTable,
// } from '@/app/lib/definitions';
// import { fetchFilteredDocuments } from '@/app/lib/data';
// import { UpdateDocument, DisableDocument } from '@/app/ui/documents/buttons';
// import Link from 'next/link';
// // import ReportRow from './report-row';
// import TableWrapper from './table-wrapper';
// import TableCheckbox from './table-checkbox';


// export default async function ReportsTable({
//   query,
//   currentPage,
//   // customers,
//   submissions
// }: {
//   query: string,
//   currentPage: number
//   submissions: any[]
//   // customers: FormattedCustomersTable[];
// }) {
//   if (!submissions || submissions.length === 0) {
//     return <p className="text-gray-500 text-sm mt-4">No submissions found.</p>;
//   }
//   const documents = await fetchFilteredDocuments(query);



//   // async function exportSelected() {
//   //     if (!selected.length) return alert('Please select at least one submission');

//   //     const res = await fetch('/api/reports/bulk', {
//   //         method: 'POST',
//   //         headers: { 'Content-Type': 'application/json' },
//   //         body: JSON.stringify({ ids: selected }),
//   //     });

//   //     if (!res.ok) return alert('Export failed');

//   //     const blob = await res.blob();
//   //     const url = URL.createObjectURL(blob);
//   //     const a = document.createElement('a');
//   //     a.href = url;
//   //     a.download = 'submissions-report.xlsx';
//   //     a.click();
//   //     URL.revokeObjectURL(url);
//   // }

//   return (
//     <div className="w-full">
//       <div className="flex justify-between items-center mb-3">
//         <span className="text-sm text-gray-500">
//           {/* {selected.length} selected */}
//         </span>
//         <button
//           // onClick={exportSelected}
//           // disabled={!selected.length}
//           className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg 
//                      hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed"
//         >
//           Export Selected to Excel
//         </button>
//       </div>
//       {/* <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
//         Customers
//       </h1> */}
//       {/* <Search placeholder="Search customers..." /> */}
//       <div className="mt-6 flow-root">
//         <div className="overflow-x-auto">
//           <div className="inline-block min-w-full align-middle">
//             <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
//               <div className="md:hidden">
//                 {documents?.map((document) => (
//                   <div
//                     key={document.id}
//                     className="mb-2 w-full rounded-md bg-white p-4"
//                   >
//                     <div className="flex items-center justify-between border-b pb-4">
//                       <div>
//                         <div className="mb-2 flex items-center">
//                           <div className="flex items-center gap-3">

//                             <p>{document.document}</p>
//                           </div>
//                         </div>

//                         <div className="mb-2 flex items-center justify-between w-full">
//                           <div className="flex items-center w-full">
//                             <p className="text-sm text-gray-500">
//                               {document.is_valid ? (
//                                 <span className="text-green-600">✓ Valid</span>
//                               ) : (
//                                 <span className="text-red-600">✗ Invalid</span>
//                               )}
//                             </p>

//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex w-full items-center justify-between border-b py-5">

//                       <div className="ml-auto">

//                         <DisableDocument id={document.id.toString()} is_valid={document.is_valid} />
//                       </div>
//                     </div>
//                     {/* <div className="pt-4 text-sm">
//                       <p>{customer.total_invoices} invoices</p>
//                     </div> */}
//                   </div>
//                 ))}
//               </div>

//               <TableWrapper submissions={submissions}>
//                 {(selected, toggleOne) => (
//                   <table className="hidden min-w-full rounded-md text-gray-900 md:table">
//                     <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
//                       <tr>
//                         <th className="px-4 py-3">
//                           {/* <input
//                         type="checkbox"
//                         checked={selected.length === submissions.length}
//                         onChange={toggleAll}
//                         className="rounded"
//                       /> */}
//                         </th>
//                         <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
//                           Id
//                         </th>
//                         <th scope="col" className="px-3 py-5 font-medium">
//                           Customer
//                         </th>
//                         <th scope="col" className="px-3 py-5 font-medium">
//                           Code
//                         </th>
//                         <th scope="col" className="px-3 py-5 font-medium">
//                           Mobile
//                         </th>
//                         <th scope="col" className="px-4 py-5 font-medium">
//                           Status
//                         </th>
//                         <th scope="col" className="px-4 py-5 font-medium">
//                           Date
//                         </th>
//                         <th scope="col" className="px-4 py-5 font-medium">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y divide-gray-200 text-gray-900">
//                       {submissions.map((s) => (

//                         // <ReportRow key={submission.submission_id} submission={submission} variant="desktop" />
//                         <tr key={s.submission_id} className="group">
//                           <td className="px-4 py-3">
//                             <TableCheckbox
//                               id={s.submission_id}
//                               selected={selected}
//                               toggleOne={toggleOne}
//                             />
//                           </td>
//                           <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
//                             <div className="flex items-center gap-3">

//                               <p>{s.submission_id}</p>
//                             </div>
//                           </td>
//                           <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
//                             {s.customer_name}
//                           </td>
//                           <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
//                             {s.cust_code}
//                             {/* {document.is_valid ? (
//                               <span className="text-green-600">✓ Valid</span>
//                             ) : (
//                               <span className="text-red-600">✗ Invalid</span>
//                             )} */}
//                           </td>
//                           <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
//                             {s.document_count} docs
//                           </td>
//                           <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
//                             {s.status}
//                           </td>
//                           <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
//                             <Link
//                               href={`/dashboard/reports/${s.submission_id}`}
//                               className="text-blue-600 hover:underline text-xs"
//                             >
//                               View
//                             </Link>
//                           </td>
//                           <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
//                             <div className="flex justify-end gap-3">
//                               {/* <UpdateDocument id={document.id.toString()} /> */}
//                               {/* <DisableDocument id={document.id.toString()} is_valid={document.is_valid} /> */}
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 )}
//               </TableWrapper>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

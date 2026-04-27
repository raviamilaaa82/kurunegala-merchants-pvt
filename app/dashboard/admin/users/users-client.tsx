// // app/admin/users/users-client.tsx
// 'use client';
// import { useState, useTransition } from 'react';
// // import { assignRoleToUser } from './actions';
// import { assignRoleToUser } from '@/app/lib/actions';

// type User = {
//     id: string;
//     email: string;
//     name: string;
//     role_id: number;
//     role_slug: string;
//     role_name: string;
// };

// type Role = {
//     id: number;
//     slug: string;
//     display_name: string;
// };

// export default function UsersClient({
//     users,
//     roles,
//     currentUserId,
// }: {
//     users: User[];
//     roles: Role[];
//     currentUserId: string;
// }) {
//     const [feedback, setFeedback] = useState<Record<string, string>>({});
//     const [isPending, startTransition] = useTransition();

//     async function handleRoleChange(userId: string, roleId: number) {
//         startTransition(async () => {
//             try {
//                 await assignRoleToUser(userId, roleId);
//                 setFeedback((prev) => ({ ...prev, [userId]: 'saved' }));
//                 setTimeout(() => {
//                     setFeedback((prev) => ({ ...prev, [userId]: '' }));
//                 }, 2000);
//             } catch (e) {
//                 setFeedback((prev) => ({ ...prev, [userId]: 'error' }));
//             }
//         });
//     }

//     return (
//         <div className="p-6 max-w-4xl mx-auto">
//             <h1 className="text-2xl font-bold mb-2">User Management</h1>
//             <p className="text-sm text-gray-500 mb-6">
//                 Assign roles to users. Your own role cannot be changed here.
//             </p>

//             <div className="overflow-x-auto rounded-lg border">
//                 <table className="w-full text-sm">
//                     <thead className="bg-gray-50 text-left text-gray-600">
//                         <tr>
//                             <th className="px-4 py-3 font-medium">User</th>
//                             <th className="px-4 py-3 font-medium">Email</th>
//                             <th className="px-4 py-3 font-medium">Role</th>
//                             <th className="px-4 py-3 font-medium">Status</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y">
//                         {users.map((user) => {
//                             const isCurrentUser = user.id === currentUserId;
//                             const status = feedback[user.id];

//                             return (
//                                 <tr
//                                     key={user.id}
//                                     className={isCurrentUser ? 'bg-blue-50' : 'bg-white'}
//                                 >
//                                     {/* Name */}
//                                     <td className="px-4 py-3 font-medium">
//                                         {user.name}
//                                         {isCurrentUser && (
//                                             <span className="ml-2 text-xs text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded">
//                                                 you
//                                             </span>
//                                         )}
//                                     </td>

//                                     {/* Email */}
//                                     <td className="px-4 py-3 text-gray-500">{user.email}</td>

//                                     {/* Role Dropdown */}
//                                     <td className="px-4 py-3">
//                                         {isCurrentUser ? (
//                                             // Lock own role — cannot self-change
//                                             <span className="text-gray-400 text-xs italic">
//                                                 {user.role_name} (locked)
//                                             </span>
//                                         ) : (
//                                             <select
//                                                 defaultValue={user.role_id}
//                                                 disabled={isPending}
//                                                 onChange={(e) =>
//                                                     handleRoleChange(user.id, Number(e.target.value))
//                                                 }
//                                                 className="border rounded px-2 py-1 text-sm bg-white
//                                    focus:outline-none focus:ring-2 focus:ring-blue-400
//                                    disabled:opacity-50"
//                                             >
//                                                 {roles.map((role) => (
//                                                     <option key={role.id} value={role.id}>
//                                                         {role.display_name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                         )}
//                                     </td>

//                                     {/* Save feedback */}
//                                     <td className="px-4 py-3">
//                                         {status === 'saved' && (
//                                             <span className="text-green-600 text-xs">✓ Saved</span>
//                                         )}
//                                         {status === 'error' && (
//                                             <span className="text-red-500 text-xs">✗ Failed</span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
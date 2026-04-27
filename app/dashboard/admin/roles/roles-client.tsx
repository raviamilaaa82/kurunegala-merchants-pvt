// // app/admin/roles/roles-client.tsx
// 'use client';
// import { useState } from 'react';
// // import { updateRoleDisplayName, updateRolePermissions } from './actions';
// import { updateRoleDisplayName, updateRolePermissions } from '@/app/lib/actions';

// const ALL_PERMISSIONS = [
//     'create:customer',
//     'view:customer',
//     'edit:customer',
//     'cancel:customer',

//     'create:documents',
//     'view:documents',
//     'edit:documents',
//     'cancel:documents',

//     'create:user',
//     'view:user',
//     'edit:user',
//     'cancel:user',
//     'manage:user',

//     'create:role',
//     'view:role',
//     'edit:role',
//     'cancel:role',



//     'view:post',
//     'create:post',
//     'edit:post',
//     'delete:post',
//     'manage:users',
// ];
// type Role = {
//     id: number;
//     slug: string;
//     display_name: string;
//     permissions: string[] | null;
// };

// type RolesClientProps = {
//     roles: Role[];
// };

// export default function RolesClient({ roles }: RolesClientProps) {
//     // const [editingId, setEditingId] = useState(null);
//     const [editingId, setEditingId] = useState<number | null>(null);
//     const [editName, setEditName] = useState('');

//     return (
//         <div className="p-6 max-w-3xl mx-auto">
//             <h1 className="text-2xl font-bold mb-6">Role Management</h1>

//             {roles.map((role) => (
//                 <div key={role.id} className="border rounded-lg p-4 mb-4">

//                     {/* Display Name — editable */}
//                     <div className="flex items-center gap-3 mb-3">
//                         {editingId === role.id ? (
//                             <>
//                                 <input
//                                     className="border rounded px-2 py-1 text-sm"
//                                     value={editName}
//                                     onChange={(e) => setEditName(e.target.value)}
//                                 />
//                                 <button
//                                     className="text-sm text-blue-600"
//                                     onClick={async () => {
//                                         await updateRoleDisplayName(role.id, editName);
//                                         setEditingId(null);
//                                     }}
//                                 >
//                                     Save
//                                 </button>
//                                 <button
//                                     className="text-sm text-gray-400"
//                                     onClick={() => setEditingId(null)}
//                                 >
//                                     Cancel
//                                 </button>
//                             </>
//                         ) : (
//                             <>
//                                 <span className="font-semibold">{role.display_name}</span>
//                                 {/* Lock slug — never editable */}
//                                 <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
//                                     slug: {role.slug}
//                                 </span>
//                                 <button
//                                     className="text-xs text-blue-500 ml-auto"
//                                     onClick={() => {
//                                         setEditingId(role.id);
//                                         setEditName(role.display_name);
//                                     }}
//                                 >
//                                     Edit name
//                                 </button>
//                             </>
//                         )}
//                     </div>

//                     {/* Permissions — toggleable checkboxes */}
//                     <div className="flex flex-wrap gap-2">
//                         {ALL_PERMISSIONS.map((perm) => {
//                             const checked = role.permissions?.includes(perm);
//                             return (
//                                 <label key={perm} className="flex items-center gap-1 text-sm cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         defaultChecked={checked}
//                                         onChange={async (e) => {
//                                             const perms = e.target.checked
//                                                 ? [...(role.permissions ?? []), perm]
//                                                 : (role.permissions ?? []).filter((p) => p !== perm);
//                                             await updateRolePermissions(role.id, perms);
//                                         }}
//                                     />
//                                     {perm}
//                                 </label>
//                             );
//                         })}
//                     </div>

//                 </div>
//             ))}
//         </div>
//     );
// }
// // app/admin/roles/actions.ts
// 'use server';
// import { sql } from '@/app/lib/db';
// import { revalidatePath } from 'next/cache';
// import { auth } from '@/auth';

// async function guardAdmin() {
//     const session = await auth();
//     if (!session?.user?.permissions?.includes('manage:users')) {
//         throw new Error('Forbidden');
//     }
// }

// // Only display_name is editable — slug stays locked
// export async function updateRoleDisplayName(roleId: number, displayName: string) {
//     await guardAdmin();
//     await sql`
//     UPDATE roles SET display_name = ${displayName} WHERE id = ${roleId}
//   `;
//     revalidatePath('/admin/roles');
// }

// export async function updateRolePermissions(roleId: number, permissions: string[]) {
//     await guardAdmin();

//     // Replace all permissions for this role
//     await sql`DELETE FROM role_permissions WHERE role_id = ${roleId}`;
//     for (const perm of permissions) {
//         await sql`
//       INSERT INTO role_permissions (role_id, permission) VALUES (${roleId}, ${perm})
//     `;
//     }
//     revalidatePath('/admin/roles');
// }
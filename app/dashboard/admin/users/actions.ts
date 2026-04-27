// // app/admin/users/actions.ts
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

// export async function assignRoleToUser(userId: string, roleId: number) {
//     await guardAdmin();

//     // Prevent user from changing their own role (safety)
//     const session = await auth();
//     if (session?.user?.id === userId) {
//         throw new Error('You cannot change your own role');
//     }

//     await sql`
//     UPDATE users SET role_id = ${roleId} WHERE id = ${userId}
//   `;

//     revalidatePath('/admin/users');
// }
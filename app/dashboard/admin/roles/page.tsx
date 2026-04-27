// // app/admin/roles/page.tsx
// import { auth } from '@/auth';
// import { sql } from '@/app/lib/db';
// import { redirect } from 'next/navigation';
// import RolesClient from './roles-client'
// import { fetchAllRolesWithTheirPermissions } from '@/app/lib/data';


// type RoleWithPermisson = {
//     id: number;
//     slug: string;
//     display_name: string;
//     permissions: string[] | null;
// };
// export default async function RolesPage() {
//     const session = await auth();

//     // Server-side guard
//     if (!session?.user?.permissions?.includes('manage:users')) {
//         redirect('/dashboard');
//     }

//     // Fetch all roles with their permissions
//     const allRolesWithTheirPermissions = await fetchAllRolesWithTheirPermissions();
//     //     const roles = await sql<RoleWithPermisson[]>`
//     //     SELECT
//     //       r.id,
//     //       r.slug,
//     //       r.display_name,
//     //       ARRAY_AGG(rp.permission) FILTER (WHERE rp.permission IS NOT NULL)
//     //         AS permissions
//     //     FROM roles r
//     //     LEFT JOIN role_permissions rp ON rp.role_id = r.id
//     //     GROUP BY r.id
//     //     ORDER BY r.id
//     //   `;
//     // const roles = rolesResult.rows as Role[];  // ✅ cast here

//     return <RolesClient roles={allRolesWithTheirPermissions} />;
// }
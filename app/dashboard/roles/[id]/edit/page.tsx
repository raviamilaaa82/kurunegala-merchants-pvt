// import Form from '@/app/ui/roles/edit-form';
// import Breadcrumbs from '@/app/ui/roles/breadcrumbs';
// import { fetchRoleById } from '@/app/lib/data';
// import { notFound } from 'next/navigation';

// export default async function Page(props: { params: Promise<{ id: string }> }) {
//     const params = await props.params;
//     const id = params.id;

//     const [role] = await Promise.all([
//         fetchRoleById(id),
//         // fetchCustomers()
//     ]);
//     if (!role) {
//         notFound();
//     }
//     return (
//         <main>
//             <Breadcrumbs
//                 breadcrumbs={[
//                     { label: 'users', href: '/dashboard/roles' },
//                     {
//                         label: 'Edit Role',
//                         href: `/dashboard/roles/${id}/edit`,

//                         active: true,
//                     },
//                 ]}
//             />
//             <Form role={role} />
//         </main>
//     );
// }
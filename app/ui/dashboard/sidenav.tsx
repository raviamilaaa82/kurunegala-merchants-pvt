import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import { auth } from '@/auth';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const links = [
  { name: 'Home', href: '/dashboard', permission: null },
  // {
  //   name: 'Invoices',
  //   href: '/dashboard/invoices',
  //   icon: DocumentDuplicateIcon,
  // },
  { name: 'Customers', href: '/dashboard/customers', permission: null },
  { name: 'Documents', href: '/dashboard/documents', permission: 'manage:documents' },
  { name: 'Users', href: '/dashboard/users', permission: 'manage:users' },
  { name: 'Roles', href: '/dashboard/roles', permission: 'manage:roles' },
  { name: 'Permissions', href: '/dashboard/permissions', permission: 'manage:permissions' },

];

export default async function SideNav() {
  const session = await auth();
  const userPermissions: string[] = session?.user?.permissions ?? [];

  // const visibleLinks = links.filter(link =>
  //   link.permission === null || userPermissions.includes(link.permission)
  // );

  const visibleLinks = links.filter(link =>
    !link.permission || userPermissions.includes(link.permission)
  );

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks links={visibleLinks} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action={async () => {
          'use server';
          await signOut({ redirectTo: '/' });
        }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}

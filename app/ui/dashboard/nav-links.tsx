'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import * as Icons from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { UsersIcon } from '@heroicons/react/24/outline';



// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
// const links = [
//   { name: 'Home', href: '/dashboard', icon: HomeIcon },
//   // {
//   //   name: 'Invoices',
//   //   href: '/dashboard/invoices',
//   //   icon: DocumentDuplicateIcon,
//   // },
//   { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon, permission: null },
//   { name: 'Documents', href: '/dashboard/documents', icon: UserGroupIcon, permission: 'customers:read' },
//   { name: 'Users', href: '/dashboard/users', icon: UserGroupIcon, permission: 'documents:read' },
//   { name: 'Roles', href: '/dashboard/roles', icon: UserGroupIcon, permission: 'roles:read' },
//   { name: 'Permissions', href: '/dashboard/permissions', icon: UsersIcon, permission: 'permissions:read' },

// ];

const iconMap: Record<string, React.ElementType> = {
  'Home': HomeIcon,
  'Customers': UserGroupIcon,
  'Documents': UserGroupIcon,
  'Users': UserGroupIcon,
  'Roles': UserGroupIcon,
  'Permissions': UsersIcon,
  'Branches': UsersIcon,
};
type NavLink = {
  name: string;
  href: string;
  icon: any;
  permission?: string | null;
};

export default function NavLinks({ links }: { links: { name: string; href: string }[] }) {
  // const iconMap = { HomeIcon: Icons.HomeIcon, UserGroupIcon: Icons.UserGroupIcon };
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        // const LinkIcon = link.icon;
        const LinkIcon = iconMap[link.name];
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx("flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3", {
              'bg-sky-100 text-blue-600': pathname === link.href,
            })}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

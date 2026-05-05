'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  UsersIcon,
  ShieldCheckIcon,
  KeyIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import * as Icons from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';



const iconMap: Record<string, React.ElementType> = {
  'Home': HomeIcon,
  'Customers': UserGroupIcon,
  'Documents': DocumentTextIcon,
  'Users': UsersIcon,
  'Roles': ShieldCheckIcon,
  'Permissions': KeyIcon,
  'Branches': MapPinIcon,
  'History': ClockIcon,
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
            className={clsx("flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3", {
              'bg-sky-100 text-blue-600': pathname === link.href,
              "flex-shrink-0": true,
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

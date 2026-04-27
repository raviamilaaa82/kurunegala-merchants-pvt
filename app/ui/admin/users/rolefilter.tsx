'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { assignRoleToUser } from '@/app/lib/actions';
type Role = {
    id: number;
    slug: string;
    display_name: string;
};

export function RoleFilter({ roles, userId, roleId }: { roles: Role[], userId: string, roleId: number }) {
    const router = useRouter();
    const pathname = usePathname();

    const [feedback, setFeedback] = useState<Record<string, string>>({});
    const [isPending, startTransition] = useTransition();

    // const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const roleId = e.target.value;
    //     const params = new URLSearchParams(window.location.search);
    //     if (roleId) {
    //         params.set('role', roleId);
    //     } else {
    //         params.delete('role');
    //     }
    //     router.push(`${pathname}?${params.toString()}`);
    // };
    async function handleRoleChange(userId: string, roleId: number) {
        startTransition(async () => {
            try {
                await assignRoleToUser(userId, roleId);
                setFeedback((prev) => ({ ...prev, [userId]: 'saved' }));
                setTimeout(() => {
                    setFeedback((prev) => ({ ...prev, [userId]: '' }));
                }, 2000);
            } catch (e) {
                setFeedback((prev) => ({ ...prev, [userId]: 'error' }));
            }
        });
    }
    return (
        <select
            defaultValue={roleId}
            // disabled={isPending}
            onChange={(e) =>
                handleRoleChange(userId, Number(e.target.value))
            }
            className="border rounded px-2 py-1 text-sm bg-white
                                   focus:outline-none focus:ring-2 focus:ring-blue-400
                                   disabled:opacity-50"
        >
            {roles.map((role) => (
                <option key={role.id} value={role.id}>
                    {role.display_name}
                </option>
            ))}
        </select>
    );
}
// components/ActivityTracker.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ActivityTracker({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        fetch('/api/activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: pathname }),
        });
    }, [pathname]);

    return <>{children}</>;
}
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
const tabs = [
    { label: 'All', status: '' },
    { label: 'Draft', status: 'draft' },
    { label: 'Pending Review', status: 'pending' },
    { label: 'Rejected', status: 'rejected' },
    { label: 'Approved', status: 'approved', roleSlug: 'manager' },
];

export default function StatusTabs({ roleSlug }: { roleSlug?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const current = searchParams.get('status') || '';

    const handleStatusChange = (newStatus: string) => {
        const params = new URLSearchParams(searchParams.toString()); // 👈 keep existing params
        params.set('status', newStatus);
        params.set('page', '1');
        router.push(`/dashboard/customers?${params.toString()}`);
    };
    return (
        <div className="flex gap-1 border-b w-full">
            {

                tabs
                    .filter(tab => !tab.roleSlug || tab.roleSlug === roleSlug)
                    .map(tab => (
                        <button
                            key={tab.status}
                            // onClick={() => router.push(`/dashboard/customers?status=${tab.status}`)}
                            onClick={() => handleStatusChange(tab.status)}
                            className={clsx(
                                'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                                current === tab.status
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
        </div>

        // <Tabs defaultValue="account" className="w-[400px]">
        //     <TabsList>
        //         <TabsTrigger value="account">Account</TabsTrigger>
        //         <TabsTrigger value="password">Password</TabsTrigger>
        //     </TabsList>
        //     <TabsContent value="account">Make changes to your account here.</TabsContent>
        //     <TabsContent value="password">Change your password here.</TabsContent>
        // </Tabs>


    );


}
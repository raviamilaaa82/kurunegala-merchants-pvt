'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import clsx from 'clsx';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from 'react';
const tabs = [
    { label: 'All', status: '' },
    { label: 'Draft', status: 'draft' },
    { label: 'Pending Review', status: 'pending' },
    { label: 'Rejected', status: 'rejected' },
    { label: 'Approved', status: 'approved', roleSlug: 'manager' },
];


const STATUS_MAP: Record<string, string> = {
    admin_rejected: "rejected",
    admin_approved: "approved",
    pending_admin: "pending",
};

export default function StatusTabs({ roleSlug }: { roleSlug?: string }) {
    const [notification, setNotification] = useState<string | null>(null);//for listen notification
    const router = useRouter();
    const searchParams = useSearchParams();
    const current = searchParams.get('status') || '';

    const [notifCounts, setNotifCounts] = useState<Record<string, number>>({
        draft: 0,
        pending: 0,
        rejected: 0,
        approved: 0,
    });


    useEffect(() => {
        let es: EventSource;

        const connect = () => {
            es = new EventSource("/api/notifications");

            es.onopen = () => console.log("✅ SSE connected");       // is this printing?

            es.onmessage = (e) => {
                console.log("📨 RAW SSE data:", e.data);             // is this printing?
                const data = JSON.parse(e.data);
                const tabStatus = STATUS_MAP[data.status] ?? data.status;
                console.log("📨 Parsed:", data);
                console.log("tabStatus:", tabStatus);        // ← what does this print?
                console.log("notifCounts:", notifCounts)
                setNotifCounts(prev => ({
                    ...prev,
                    [data.status]: (prev[data.status] || 0) + 1
                }));
            };

            es.onerror = (err) => {
                console.error("❌ SSE error:", err);
                es.close();
                setTimeout(connect, 3000);                           // reconnect
            };
        };

        connect();
        return () => es?.close();
    }, []);

    const handleStatusChange = (newStatus: string) => {
        const params = new URLSearchParams(searchParams.toString()); // 👈 keep existing params
        params.set('status', newStatus);
        params.set('page', '1');
        router.push(`/dashboard/customers?${params.toString()}`);

        // Clear badge when user visits that tab
        setNotifCounts(prev => ({ ...prev, [newStatus]: 0 }));
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
                            {/* {tab.label} */}
                            {/* for showing notification  */}
                            <span className="relative">
                                {tab.label}

                                {
                                    notifCounts[tab.status] > 0 && (
                                        <span className="
                                            absolute -top-1 -right-3 
                                            h-2.5 w-2.5 
                                            bg-red-600 
                                            rounded-full 
                                            animate-pulse
                                        "></span>

                                    )

                                }
                            </span>
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
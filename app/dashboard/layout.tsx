import SideNav from '@/app/ui/dashboard/sidenav';
import ActivityTracker from '@/components/ActivityTracker'; //newly added code for getting history record
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <TooltipProvider>
                <div className="grow p-6 md:p-12 overflow-y-auto">
                    <ActivityTracker>{children}</ActivityTracker>
                </div>
            </TooltipProvider>
        </div>
    );
}

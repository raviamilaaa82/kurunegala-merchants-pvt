import SideNav from '@/app/ui/dashboard/sidenav';
import ActivityTracker from '@/components/ActivityTracker'; //newly added code for getting history record

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="grow p-6 md:overflow-y-auto md:p-12">
                <ActivityTracker>{children}</ActivityTracker> </div>
        </div>
    );
}

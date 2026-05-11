'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Branches, Types } from '@/app/lib/definitions';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BranchCompanyFilter({
    branches,
    allTypes,
}: {
    branches: Branches[];
    allTypes: Types[];
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentBranch = searchParams.get('branch') || 'all';
    const currentType = searchParams.get('type') || 'all';

    const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('branch', event.target.value);
        params.set('type', 'all'); // ✅ reset type when branch changes
        params.set('page', '1');
        router.push(`/dashboard/customers?${params.toString()}`);
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('type', event.target.value);
        params.set('page', '1');
        router.push(`/dashboard/customers?${params.toString()}`);
    };

    // ✅ Filter types based on selected branch — no DB call needed
    const filteredTypes = currentBranch === 'all'
        ? allTypes
        : allTypes.filter((t) => Number(t.branch_id) === Number(currentBranch));

    return (
        <>
            {/* Branch Dropdown */}
            <div className="md:ml-auto">
                <div className="flex w-full">
                    <div className="relative w-full min-w-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <select
                                    id="branch_id"
                                    name="branch"
                                    className="peer block w-full sm:w-64 max-w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    value={currentBranch}
                                    aria-describedby="document-error"
                                    onChange={handleBranchChange}
                                >
                                    <option value="all">All</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.branch}
                                        </option>
                                    ))}
                                </select>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Branches</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {/* Company Type Dropdown — filtered by branch */}
            <div className="md:ml-auto">
                <div className="flex w-full">
                    <div className="relative w-full min-w-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <select
                                    id="com_type_id"
                                    name="com_type"
                                    className="peer block w-full sm:w-64 max-w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    value={currentType}
                                    aria-describedby="document-error"
                                    onChange={handleTypeChange}
                                >
                                    <option value="all">All</option>
                                    {filteredTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Com.Type/Section</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </>
    );
}
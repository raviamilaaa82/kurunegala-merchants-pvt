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
    branchId,
    roleSlug,
}: {
    branches: Branches[];
    allTypes: Types[];
    branchId?: string;
    roleSlug?: string;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentBranch = searchParams.get('branch') || 'all';
    const currentType = searchParams.get('type') || 'all';

    const isManagerOrSeniorManager = roleSlug ? ['manager', 'senior_manager'].includes(roleSlug) : false;
    const isAgentOrAdmin = roleSlug ? ['agent', 'admin'].includes(roleSlug) : false;

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



    const getActiveBranchId = () => {
        if (isManagerOrSeniorManager) {
            // For managers: use the selected branch (could be 'all' or specific branch id)
            return currentBranch;
        }

        if (isAgentOrAdmin) {
            // For agents/admins: always use their assigned branch id
            // No 'all' option available for them
            return branchId;
        }

        return null;
    };

    const activeBranch = getActiveBranchId();



    // ✅ Filter types based on selected branch — no DB call needed
    const filteredTypes = activeBranch === 'all' || !activeBranch
        ? allTypes
        : allTypes.filter((t) => Number(t.branch_id) === Number(activeBranch));
    // const filteredTypes = currentBranch === 'all'
    //     ? allTypes
    //     : allTypes.filter((t) => Number(t.branch_id) === Number(currentBranch));

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
                                    {isManagerOrSeniorManager && (
                                        <option key="all" value="all">
                                            All
                                        </option>
                                    )}

                                    {/* <option value="all">All</option> */}
                                    {branches.filter(branch => {
                                        if (isManagerOrSeniorManager) {
                                            return true; // Show all branches
                                        }
                                        if (isAgentOrAdmin) {
                                            return branch.id === Number(branchId); // Show only user's branch
                                        }
                                        return false;
                                    }).map((branch) => (
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
                                    {isManagerOrSeniorManager && (
                                        <option key="all" value="all">
                                            All
                                        </option>
                                    )}
                                    {/* <option value="all">All</option> */}
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
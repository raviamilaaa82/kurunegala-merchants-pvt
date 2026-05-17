'use client';

import { Company, Branches } from '@/app/lib/definitions';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateBranch, BranchState } from '@/app/lib/actions';
import { useActionState, useEffect, useState } from 'react';


export default function EditBranchesForm({
    companies,
    selectedBranch,

}: {
    companies: Company[];
    selectedBranch: Branches

}) {
    const initialState: BranchState = { status: null, errors: {}, message: null, error: null };

    const updateBranchWithId = updateBranch.bind(null, selectedBranch.id.toString());

    const [state, formAction] = useActionState(updateBranchWithId, initialState);
    const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({});
    const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedCompanyId, setSelectedCompnayId] = useState('');
    const [company, setCompany] = useState<string>('');
    const [branch, setBranch] = useState<string>(selectedBranch.branch);
    const [isCheckingBranchName, setIsCheckingBranchName] = useState(false);
    const [branchNameError, setBranchNameError] = useState("");



    useEffect(() => {
        if (!branch) {
            setBranchNameError("");
            return;
        }
        // if (!userName) return;
        setIsCheckingBranchName(true);
        setBranchNameError("");

        const timer = setTimeout(() => {
            fetch(`/api/branches/check-branchname?branch=${branch}`)
                .then(res => res.json())
                .then(data => {
                    if (data.exists) {
                        setBranchNameError("Branch Name already exists");
                    } else {
                        setBranchNameError("");
                    }
                }).finally(() => setIsCheckingBranchName(false));
        }, 500); // avoid spam

        return () => clearTimeout(timer);
    }, [branch]);




    useEffect(() => {
        if (state.status === 'error' && state.errors) {
            setLocalErrors(state.errors);
        }
    }, [state.status, state.errors]);

    const getFilteredCompanies = () => {

        // if ((roleSlug === 'agent' || roleSlug === 'admin') && branch) {
        return companies.filter(c => c.id === Number(selectedBranch.com_id));
        // }
        // return branches;
    };

    const filteredCompanies = getFilteredCompanies();
    const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;

        setSelectedCompany(selectedValue);
        setSelectedCompnayId(event.target.value);

    };

    return (
        <form action={formAction} className="w-full sm:w-1/2 md:w-1/3 mx-auto">
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}

                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Company

                    </label>
                    <div className="relative">
                        <select
                            id="com_id"
                            name="company"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue=""
                            aria-describedby="company-error"

                            onChange={(e) => {
                                handleCompanyChange(e);
                                setCompany(e.target.value)

                            }
                            }
                        >

                            {filteredCompanies.map((comp) => (
                                <option key={comp.id} value={comp.id}>
                                    {comp.company}
                                </option>
                            ))}
                        </select>
                    </div>


                </div>
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Branch Name
                    </label>
                    <div className="relative">
                        <input
                            id="branch"
                            name="branch"
                            type="text"
                            placeholder="Enter branch name"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="branch-error"
                            value={branch}
                            onChange={(e) => {
                                setBranch(e.target.value)
                                // clearFieldError('branch');
                            }
                            }
                        />
                    </div>

                    <div id="branch-error" aria-live="polite" aria-atomic="true">
                        {localErrors?.branch &&
                            localErrors.branch.map((error: string) => (
                                <p className="mt-2 text-xs text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                        {isCheckingBranchName && (
                            <p className="text-gray-400 text-xs">Checking branch name...</p>
                        )}
                        {branchNameError && (
                            <p className="text-red-500 text-xs">{branchNameError}</p>
                        )}
                    </div>
                </div>

            </div>
            {state.message && (
                <p className="text-xs text-red-500">{state.message}</p>
            )}
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/branches"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit" disabled={isCheckingBranchName || !!branchNameError} className="disabled:opacity-50 disabled:cursor-not-allowed">Edit Branch</Button>
            </div>
        </form>
    );
}

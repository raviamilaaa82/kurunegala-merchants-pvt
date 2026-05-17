'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Branches } from '@/app/lib/definitions';
import { useEffect, useRef, useState } from 'react';


export default function BranchDropDowns({ branches }: { branches: Branches[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentBranch = searchParams.get('branch') || '1';


    const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

        const params = new URLSearchParams(searchParams.toString());
        params.set('branch', event.target.value);
        params.set('page', '1');
        router.push(`/dashboard/history?${params.toString()}`);
    };



    return (
        <div className="flex w-full">
            {/* gap-1 border-b */}

            <div className="relative w-full min-w-0">
                <select
                    id="branch_id"
                    name="branch"
                    // className="peer block w-full max-w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    className="peer block w-full sm:w-64 max-w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    value={currentBranch}
                    aria-describedby="document-error"
                    // onChange={(event) => router.push(`/dashboard/customers?branch=${event.target.value}`)}
                    onChange={handleBranchChange}
                // disabled={isDropDownEnabled}
                >


                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.branch}
                        </option>
                    ))}
                </select>
            </div>

            <div id="document-error" aria-live="polite" aria-atomic="true">
                {/* {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))} */}
            </div>
            {/* </div> */}

        </div>

    );


}
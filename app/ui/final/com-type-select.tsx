'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Types } from '@/app/lib/definitions';
import { useEffect, useRef } from 'react';


export default function CompanyTypesDropDown({ types }: { types: Types[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentType = searchParams.get('type') || 'all';
    // const searchParamsRef = useRef(searchParams);

    // const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const params = new URLSearchParams(searchParams.toString());
    //     if (event.target.value) {
    //         params.set('type', event.target.value);
    //     } else {
    //         params.delete('type');
    //     }
    //     params.set('page', '1');
    //     router.push(`/dashboard/customers?${params.toString()}`);
    // };
    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('type', event.target.value);
        params.set('page', '1');
        router.push(`/dashboard/customers?${params.toString()}`);
    };

    // useEffect(() => {
    //     if (!searchParamsRef.current.has('type') && types.length > 0) {
    //         const params = new URLSearchParams(searchParamsRef.current.toString());
    //         params.set('type', String(types[0].id)); // 👈 use first branch as default
    //         // params.set('page', '1');
    //         router.replace(`/dashboard/customers?${params.toString()}`); // 👈 replace not push (no back-button history)
    //     }
    // }, []); // 👈 run when branches load

    return (
        <div className="flex w-full">
            {/* gap-1 border-b */}

            <div className="relative w-full min-w-0">
                <select
                    id="com_type_id"
                    name="com_type"
                    // className="peer block w-full max-w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    className="peer block w-full sm:w-64 max-w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    value={currentType}
                    aria-describedby="document-error"
                    // onChange={(event) => router.push(`/dashboard/customers?branch=${event.target.value}`)}
                    onChange={handleTypeChange}
                // disabled={isDropDownEnabled}
                >
                    <option key="all" value="all">
                        All
                    </option>
                    {types.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.type}
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
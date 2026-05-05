'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Company } from '@/app/lib/definitions';



export default function CompanyDropDowns({ companies }: { companies: Company[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const current = searchParams.get('status') || '';
    return (
        <div className="flex gap-1 border-b w-full">

            <div className="mb-4">
                {/* <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                    Company

                </label> */}
                <div className="relative">
                    <select
                        id="com_id"
                        name="company"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        defaultValue=""
                        aria-describedby="document-error"
                    //   onChange={handleCompanyChange}
                    // disabled={isDropDownEnabled}
                    >
                        <option value="" disabled>
                            Select a company
                        </option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.company}
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
            </div>

        </div>




    );


}
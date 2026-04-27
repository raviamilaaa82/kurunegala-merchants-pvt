"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
} from "@/components/ui/dialog";
// import { UpdateCustomer, DisableCustomer } from './buttons';
import { updateRoleDisplayName, updateRolePermissions } from '@/app/lib/actions';
import { PencilIcon, PlusIcon, TrashIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';

const ALL_PERMISSIONS = [
    // 'create:customers',
    // 'view:customers',
    // 'edit:customers',
    // 'cancel:customers',
    'manage:customers',

    // 'create:documents',
    // 'view:documents',
    // 'edit:documents',
    // 'cancel:documents',
    'manage:documents',

    // 'create:users',
    // 'view:users',
    // 'edit:users',
    // 'cancel:users',
    // 'manage:users',
    'manage:users',

    // 'create:roles',
    // 'view:roles',
    // 'edit:roles',
    // 'cancel:roles',
    'manage:roles',

    'manage:permissions',
];
type Role = {
    id: number;
    slug: string;
    display_name: string;
    permissions: string[] | null;
};

type RolesClientProps = {
    roles: Role[];
};


interface UploadedImage {
    doc_id: string | number;
    file_key: string;
    file_name?: string;
    doc_type?: string;
    file_url: string,
    // ... other properties
}

type RoleWithPermisson = {
    id: number;
    slug: string;
    display_name: string;
    permissions: string[] | null;
};

// export default function CustomerRow({ customer }: { customer: any }) {

export default function UserRoleRow({ alRolsWithPermi, variant = "desktop" }: { alRolsWithPermi: RoleWithPermisson, variant?: "desktop" | "mobile" }) {
    const [open, setOpen] = useState("");
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


    const [index, setIndex] = useState<number | null>(null);

    // useEffect(() => {
    //     if (open === "item-1") {

    //         setLoading(true);
    //         fetch(`/api/get-images?masterId=${customer.id}`).then((res) => res.json()).then((data) => {
    //             setImages(data.images || []);
    //             setLoading(false);

    //         });
    //     }


    // }, [open]);


    const accordionContent = (
        <>
            {/* {loading && <p className="text-sm p-4">Loading images...</p>} */}
            {/* {!loading && alRolsWithPermi.length === 0 && (
                <p className="text-sm p-4">No images found.</p>
            )} */}

            {/* {!loading && alRolsWithPermi.length > 0 && ( */}
            {!loading && (
                <div className="flex flex-row flex-wrap gap-4 p-4">
                    {ALL_PERMISSIONS.map((perm) => {
                        const checked = alRolsWithPermi.permissions?.includes(perm);

                        // console.log(perm + checked);
                        // console.log(perm);
                        return (
                            <label key={perm} className="flex items-center gap-1 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    defaultChecked={checked}
                                    onChange={async (e) => {
                                        const perms = e.target.checked
                                            ? [...(alRolsWithPermi.permissions ?? []), perm]
                                            : (alRolsWithPermi.permissions ?? []).filter((p) => p !== perm);
                                        await updateRolePermissions(alRolsWithPermi.id, perms);
                                    }}
                                />
                                {perm}
                            </label>
                        );
                    })}
                </div>
            )}

        </>
    );

    const accordion = (
        <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
            <AccordionItem value="item-1">
                <AccordionContent>{accordionContent}</AccordionContent>
            </AccordionItem>
        </Accordion>
    );

    const actionButtons = (
        <div className="flex gap-3">
            <button
                className="rounded-md border p-2 hover:bg-gray-100"
                onClick={() => setOpen(open ? "" : "item-1")}
            >
                <ViewColumnsIcon className="w-5" />
            </button>
            {/* <UpdateCustomer id={customer.id} />
            <DisableCustomer id={customer.id} is_enabled={customer.is_enabled} /> */}
        </div>
    );

    if (variant === "mobile") {
        return (
            <div className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            {/* <Image
                                src={allRolesWithTheirPermissions.}
                                className="rounded-full"
                                alt={`${role.display_name}'s profile picture`}
                                width={28}
                                height={28}
                            /> */}
                            <p className="font-medium">{alRolsWithPermi.display_name}</p>
                        </div>
                        <p className="text-sm text-gray-500">email</p>
                        <p className="text-sm text-gray-500">mobile</p>
                    </div>
                    {actionButtons}
                </div>
                {accordion}
            </div>
        );
    }

    // ── DESKTOP ──
    return (
        <>
            <tr>
                <td className="bg-white px-4 py-5">{alRolsWithPermi.display_name}</td>
                {/* <td className="bg-white px-4 py-5">cole 1</td>
                <td className="bg-white px-4 py-5">col2</td> */}
                {/* <td className="bg-white px-4 py-5 text-sm">
                    {customer.loc_link ? (
                        <a
                            href={customer.loc_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            View on Google Maps
                        </a>
                    ) : (
                        <span className="text-gray-400">—</span>
                    )}
                </td> */}
                {/* <td className="bg-white px-4 py-5"> {customer.is_enabled ? (
                    <span className="text-green-600">✓ Valid</span>
                ) : (
                    <span className="text-red-600">✗ Invalid</span>
                )}</td> */}
                <td className="bg-white px-4 py-5">
                    <div className="flex justify-end gap-3">{actionButtons}</div>
                </td>
            </tr>
            <tr>
                <td colSpan={4} className="bg-gray-50">
                    {accordion}
                </td>
            </tr>
        </>
    );

}
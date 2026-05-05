"use client";
import { PencilIcon, PlusIcon, TrashIcon, XCircleIcon, ArrowDownRightIcon, CheckCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { acceptSubmissionAdminOrManager } from '@/app/lib/actions';


export default function ApproveDialog({ submissionId }: { submissionId: string }) {
    const [open, setOpen] = useState(false);
    const action = acceptSubmissionAdminOrManager.bind(null, submissionId);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><CheckIcon className="w-5" /></Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm">

                <DialogTitle>Approve Submission</DialogTitle>

                <h2 className="text-lg font-medium mb-4">Approve this item?</h2>

                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        No
                    </Button>
                    <form action={action}>
                        <Button
                            type="submit"
                        // onClick={() => setOpen(false)}
                        >
                            Yes
                        </Button>
                    </form>
                    {/* <Button
                        onClick={() => {
                            onConfirm();   // call server action or callback
                            setOpen(false);
                        }}
                    >
                        Yes
                    </Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
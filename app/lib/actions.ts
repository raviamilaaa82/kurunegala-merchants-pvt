'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

import { r2 } from "@/lib/r2";
import { GetObjectCommand, CopyObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import bcrypt from 'bcrypt';
import { hash } from 'bcrypt';
import { sql } from './db';
import { auth } from '@/auth';



const saltRounds = 10;// for creating hash password

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),

});

const DocumentSchema = z.object({
    id: z.string(),
    document: z.string({ invalid_type_error: 'Please enter document name' }).min(1, 'Document name cannot be empty'),
    is_valid: z.preprocess((val) => val === "1", z.boolean())
});

const BranchSchema = z.object({
    id: z.string(),
    branch: z.string({ invalid_type_error: 'Please enter branch name' }).min(1, 'branch name cannot be empty'),
    com_id: z.coerce
        .number()
        .gt(0, { message: 'Company ID is empty!' }),

});


const FileInfoSchema = z.object({
    name: z.string(),
    key: z.string(),
    // url: z.string().url(),
});
const CustomerSchema = z.object({
    id: z.string(),
    name: z.string({ invalid_type_error: 'Please enter name' }).min(1, 'Customer name cannot be empty')
        .regex(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces'),

});
const CustomerUpdateSchema = z.object({
    id: z.string(),
    name: z.string({ invalid_type_error: 'Please enter name' }).min(1, 'Customer name cannot be empty')
        .regex(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces'),


});


const UserSchema = z.object({
    id: z.string(),
    name: z.string({ invalid_type_error: 'Please enter name' }).min(1, 'User name cannot be empty')
        .regex(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string(),

});

const UpdateUserSchema = z.object({
    name: z
        .string({ invalid_type_error: "Please enter name" })
        .min(1, "User name cannot be empty")
        .regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional()
        .or(z.literal("")), // allow empty string
}).refine(
    (data) => !data.password || data.password.length >= 6,
    {
        message: "Password must be at least 6 characters",
        path: ["password"],
    }
);



const RoleSchema = z.object({
    id: z.string(),
    role: z.string({ invalid_type_error: 'Please enter role name' }).min(1, 'Role name cannot be empty'),
    is_valid: z.preprocess((val) => val === "1", z.boolean()),
    slug: z.string().min(1, 'Slug cannot be empty'),
});




// Schema for the hidden input
const subMissionUpdateScheme = z.object({
    submissionId: z.coerce
        .number()
        .gt(0, { message: 'Submission ID is empty or invalid!' }),
});




const noteUpdateScheme = z.object({
    submissionId: z.coerce
        .number()
        .gt(0, { message: 'Submission ID is empty or invalid!' }),
    adminNote: z.string().optional(),
    managerNote: z.string().optional(),
}).refine(
    (data) => data.adminNote !== undefined || data.managerNote !== undefined,
    { message: "At least one note must be provided" }
);

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateDocument = DocumentSchema.omit({ id: true });
const UpdateDocument = DocumentSchema.omit({ id: true });

const CreateCustomer = CustomerSchema.omit({ id: true });
const UpdateCustomer = CustomerUpdateSchema.omit({ id: true });


const CreateUser = UserSchema.omit({ id: true });
// const UpdateUser = UpdateUserSchema.omit({ id: true });

const CreateRole = RoleSchema.omit({ id: true });
const UpdateRole = RoleSchema.omit({ id: true });
const CreateBranch = BranchSchema.omit({ id: true });
const UpdateBranch = BranchSchema.omit({ id: true });

export type State = {
    errors?: {

        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

export type DocumentState = {
    errors?: {
        document?: string[]
    };
    message?: string | null;
}

export type BranchState = {
    errors?: {
        branch?: string[];
        com_id?: string[];
    };
    message?: string | null;
}

export type CustomerErrorResponse = {
    errors?: { name?: string[] };
    message?: string | null;
};

export type CustomerSuccessResponse = {
    success: true;
    id: number;
    name: string;
};

export type CustomerState = {
    errors?: {
        name?: string[];
    };
    message?: string | null;
}

export type UserState = {
    errors?: {
        name?: string[];
        password?: string[];
        username?: string[];
    };
    message?: string | null;
}

export type UserUpdateState = {
    errors?: {
        name?: string[];
        password?: string[];
    };
    message?: string | null;
};

export type RoleState = {
    errors?: {
        role?: string[];
        slug?: string[];
    };
    message?: string | null;
}

export type SubmissionState = {

    errors?: {
        submissionId?: string[];
    };
    message?: string | null;
};

export type NotesFormState = {
    errors?: {
        submissionId?: string[];
        adminNote?: string[];
        managerNote?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice',
        };
    }

    // console.log({ customerId, amount, status });
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    } catch (error) {

        console.error(error);
        // return {
        //     message: 'Database Error: Failed to Create Invoice.',
        // };
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {

    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    try {
        await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
    } catch (error) {

        console.error(error);
        // return { message: 'Database Error: Failed to Update Invoice.' };
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}


export async function createDocument(prevState: DocumentState, formData: FormData) {
    const validatedFields = CreateDocument.safeParse({
        document: formData.get('document'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Document',
        };
    }

    const { document } = validatedFields.data;

    try {

        await sql`
    INSERT INTO tbl_documents (document)
    VALUES (${document})
  `;
    } catch (error) {

        console.error(error);
        // return {
        //     message: 'Database Error: Failed to Create Invoice.',
        // };
    }
    revalidatePath('/dashboard/documents');
    redirect('/dashboard/documents');

}

export async function updateDocument(id: string, prevState: DocumentState, formData: FormData) {

    const validatedFields = UpdateDocument.safeParse({
        document: formData.get('document'),
        is_valid: formData.get('is_valid')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Document.',
        };
    }

    const { document, is_valid } = validatedFields.data;


    const numericId = Number(id);

    try {
        await sql`
  UPDATE tbl_documents
  SET document = ${document}, is_valid = ${is_valid}
  WHERE id = ${numericId}
`;
    } catch (error) {

        console.error(error);
        // return { message: 'Database Error: Failed to Update Invoice.' };
    }
    revalidatePath('/dashboard/documents');
    redirect('/dashboard/documents');

}


export async function createCustomer(prevState: CustomerState | undefined, formData: FormData) {


    const session = await auth();
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }
    const agentId = session.user.id;



    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;



    let id: string;

    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
    });


    if (!validatedFields.success) {
        return {
            status: 'error',
            message: 'Missing or invalid fields. Failed to create customer.',
            errors: validatedFields.error.flatten().fieldErrors, // { name?: string[] }
        };

    }

    const { name } = validatedFields.data;
    const email = String(formData.get('email') ?? '');
    const img_url = "/customers/evil-rabbit.png";
    const mobile = String(formData.get('mobile') ?? '0');
    const locationLink = String(formData.get('googleLink') ?? '0');


    // const result = await sql`
    //         INSERT INTO customers (name, email, image_url, mobile, loc_link)
    //         VALUES (${name}, ${email}, ${img_url}, ${mobile}, ${locationLink})
    //         RETURNING id;
    //     `;

    // id = result[0].id;

    // redirect(`/dashboard/customers/${id}/upload`);//dynamic redirection. no need revalidate
    let customerId: string;
    let submissionId: string;

    try {
        const result = await sql.begin(async (txn) => {
            // 1. Insert customer
            const [customer] = await txn`
                INSERT INTO customers (name, email, image_url, mobile, loc_link)
                VALUES (${name}, ${email}, ${img_url}, ${mobile}, ${locationLink})
                RETURNING id
            `;



            //         const result = await sql`
            //   INSERT INTO submission (agent_id, customer_id, status,created_at) 
            //   VALUES (${agentId},${customerId}, ${status},${localDate}) 
            //   RETURNING id
            // `;
            //         const submissionId = result[0]?.id;




            // 2. Create submission — if this fails, customer insert is rolled back too
            const [submission] = await txn`
                INSERT INTO submission (agent_id, customer_id, status,created_at)
                VALUES (${agentId},${customer.id}, 'draft', ${localDate})
                RETURNING id
            `;

            return { customerId: customer.id, submissionId: submission.id };
        });

        customerId = result.customerId;
        submissionId = result.submissionId;

    } catch (error) {
        console.error('Transaction failed:', error);
        return { error: 'Failed to create customer' };
    }

    // Redirect outside try/catch — Next.js redirect throws internally
    redirect(`/dashboard/customers/${customerId}/upload?submissionId=${submissionId}&mode=create`);




}
export async function updateCustomer(id: string, submisnId: string | undefined, prevState: CustomerState | undefined, formData: FormData) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        // username: formData.get('username'),
        // password: formData.get("password") || "",
    });
    console.log("update cu id" + id);
    if (!validatedFields.success) {
        console.log("update cu not succ");
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update User',
        };
    }


    const { name } = validatedFields.data;
    const email = String(formData.get('email') ?? '');
    const img_url = "/customers/evil-rabbit.png";
    const mobile = String(formData.get('mobile') ?? '0');
    const locationLink = String(formData.get('googleLink') ?? '0');


    console.log("update cu name" + name);

    // try {
    await sql`
        UPDATE customers
	SET  name=${name}, email=${email}, image_url=${img_url}, mobile=${mobile}, loc_link=${locationLink}
	
	WHERE id = ${id}   
  `;
    // } catch (error) {

    //     console.error(error);
    //     // return {
    //     message: 'Database Error: Failed to Create Invoice.',
    // };
    // }
    // revalidatePath('/dashboard/users');
    // redirect('/dashboard/users');
    // After successful update:
    if (submisnId) {
        // redirect(`/dashboard/customers/${id}/upload/${submisnId}`);
        redirect(`/dashboard/customers/${id}/upload?submissionId=${submisnId}&name=${encodeURIComponent(name)}&mode=edit`);
    }

    // else {
    //     redirect(`/dashboard/customers/${id}/upload`);
    // }
    // redirect(`/dashboard/customers/${id}/upload`);

}
export async function updateSubmissionStatus(
    prevState: SubmissionState | undefined,
    formData: FormData
) {

    const submissionIdRaw = formData.get('submissionId');

    // 2. Validate using Zod (coerces string to number)
    const validated = subMissionUpdateScheme.safeParse({ submissionId: submissionIdRaw });

    if (!validated.success) {
        // Return error state with field errors
        return {
            status: 'error',
            message: 'Invalid submission ID',
            errors: validated.error.flatten().fieldErrors,
        };
    }
    const { submissionId } = validated.data;


    const numericSubmissionId = Number(submissionId);

    // try {
    await sql`
        UPDATE submission
	SET status='pending_admin' WHERE id = ${numericSubmissionId};  
`;
    // return {
    //     status: 'success',
    //     message: `Submission ${numericSubmissionId} status updated to pending_admin`,
    //     submissionId: numericSubmissionId, // optional, for frontend use
    // };
    // } catch (error) {

    //     // console.error(error);
    //     // return {
    //     //     status: 'error',
    //     //     message: 'Database error: Failed to update submission status',
    //     //     errors: {},
    //     // };
    //     // return { message: 'Database Error: Failed to Update Invoice.' };
    // }
    // redirect(`/dashboard/customers`);
    // redirect('/dashboard/documents');
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

// export async function createCustomer(prevState: CustomerState | undefined, formData: FormData) {
//     const state = prevState ?? { message: null, errors: {} };
//     let lastInsertedRowId: string | null = null;
//     const validatedFields = CreateCustomer.safeParse({
//         name: formData.get('name'),

//         // mobile: formData.get('mobile'),
//         // lat: formData.get('lat'),
//         // lan: formData.get('lan'),

//     });

//     if (!validatedFields.success) {
//         return {
//             errors: validatedFields.error.flatten().fieldErrors,
//             values: {
//                 name: formData.get('name'),

//             },
//             message: 'Missing Fields. Failed to Create Customer',
//             // errors: validatedFields.error.flatten().fieldErrors,
//             // message: 'Missing Fields. Failed to Create Customer',
//         };
//     }

//     //  const { name, mobile, lat, lan } = validatedFields.data;
//     const { name } = validatedFields.data;
//     const email = String(formData.get('email') ?? '');
//     const img_url = "/customers/evil-rabbit.png";
//     const mobile = String(formData.get('mobile') ?? '0');
//     const locationLink = String(formData.get('googleLink') ?? '0');

//     try {

//         const result = await sql`
//     INSERT INTO customers (name, email, image_url, mobile,loc_link)
//     VALUES (${name}, ${email}, ${img_url}, ${mobile}, ${locationLink})
//     RETURNING id;
//   `;
//         lastInsertedRowId = result[0].id;     

//     } catch (error) {
//         console.error(error);

//     }

//     redirect(`/dashboard/customers/create?id=${lastInsertedRowId}`);

// }

export async function createCustomerDocument(prevState: CustomerState, formData: FormData) {
    // const raw = formData.get('uploadedFilesByDocument') as string;

    // if (!raw) {
    //     throw new Error("Missing uploadedFilesByDocument");
    // }

    // // const uploadedFilesByDocument = JSON.parse(raw || "{}");
    // let uploadedFilesByDocumentValidated;
    // try {
    //     uploadedFilesByDocumentValidated = JSON.parse(raw || "{}");
    // } catch {
    //     throw new Error("uploadedFilesByDocument must be valid JSON");

    // }


    // const keptFilesMapping = JSON.parse(formData.get('keptFilesMapping') as string);
    // const deletedFilesMapping = JSON.parse(formData.get('deletedFilesMapping') as string);

    // const validatedFields = CreateCustomer.safeParse({
    //     // name: formData.get('name'),
    //     uploadedFilesByDocument: uploadedFilesByDocumentValidated,
    //     // mobile: formData.get('mobile'),
    //     // lat: formData.get('lat'),
    //     // lan: formData.get('lan'),

    // });

    // if (!validatedFields.success) {

    //     return {
    //         errors: validatedFields.error.flatten().fieldErrors,
    //         values: {
    //             // name: formData.get('name'),
    //             uploadedFilesByDocument: uploadedFilesByDocumentValidated,
    //         },
    //         message: 'Missing Fields. Failed to Create Customer',
    //         // errors: validatedFields.error.flatten().fieldErrors,
    //         // message: 'Missing Fields. Failed to Create Customer',
    //     };
    // }

    // const { uploadedFilesByDocument } = validatedFields.data;


    //  // 2. Insert all kept file records with final keys (documents/...)
    //     for (const mapping of keptFilesMapping) {
    //         const { documentId, keys } = mapping;
    //         for (const tempKey of keys) {
    //             // Generate final key by replacing prefix
    //             const finalKey = tempKey.replace(/^temp\//, 'documents/');

    //             // Extract original file name from the temp key
    //             // Assumes key format: temp/{documentId}/{uuid}-{fileName}
    //             const fileName = tempKey.split('/').pop()?.replace(/^[a-f0-9-]+-/, '') || 'unknown';

    //             await txn`
    //     INSERT INTO customer_details (document_id, master_id, file_key, file_name)
    //     VALUES (${documentId}, ${lastInsertedRowId}, ${finalKey}, ${fileName})
    //   `;
    //         }
    //     }


    //      try {
    //     for (const mapping of keptFilesMapping) {
    //         const { keys } = mapping;
    //         for (const tempKey of keys) {
    //             const finalKey = tempKey.replace(/^temp\//, 'documents/');
    //             await r2.send(new CopyObjectCommand({
    //                 Bucket: process.env.R2_BUCKET,
    //                 CopySource: `${process.env.R2_BUCKET}/${tempKey}`,
    //                 Key: finalKey,
    //             }));
    //             await r2.send(new DeleteObjectCommand({
    //                 Bucket: process.env.R2_BUCKET,
    //                 Key: tempKey,
    //             }));
    //         }
    //     }

    //     // 4. Delete queued files (user‑deleted temp keys)
    //     for (const mapping of deletedFilesMapping) {
    //         const { keys } = mapping;
    //         for (const key of keys) {
    //             await r2.send(new DeleteObjectCommand({
    //                 Bucket: process.env.R2_BUCKET,
    //                 Key: key,
    //             }));
    //         }
    //     }
    // } catch (error) {
    //     console.error('R2 operation failed:', error);
    //     // Log error, but the database already has the final keys.
    //     // You can run a separate cleanup job to move leftover temp files later.
    // }
}

// export async function disableCustomer(id: string, isEnabled: boolean) {
//     const numericId = Number(id);
//     await sql`UPDATE customers
//   SET is_enabled = ${isEnabled}
//   WHERE id = ${numericId}`;
//     // revalidatePath('/dashboard/invoices');
//     revalidatePath('/dashboard/documents');
//     // redirect('/dashboard/documents');
// }
export async function updateManagerAndAdminNotes(summissionId: number, prevState: NotesFormState | undefined, formData: FormData): Promise<NotesFormState> {

    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const roleSlug = session.user.roleSlug;

    // const submissionIdRaw = formData.get('submissionId');

    // 2. Validate using Zod (coerces string to number)
    const raw = {
        submissionId: summissionId,
        adminNote: formData.get("adminNote") ?? undefined,
        managerNote: formData.get("managerNote") ?? undefined,
    };

    const validated = noteUpdateScheme.safeParse(raw);
    if (!validated.success) {
        // return { error: validated.error.flatten().fieldErrors };
    }

    const { submissionId, adminNote, managerNote } = validated.data!;
    // const { submissionId } = validated.data;

    const numericSubmissionId = Number(submissionId);


    // 👇 only update the field relevant to the role
    if (roleSlug === "admin" && adminNote !== undefined) {
        await sql`
            UPDATE submission 
            SET admin_note = ${adminNote}
            WHERE id = ${submissionId}
        `;
    } else if (roleSlug === "manager" && managerNote !== undefined) {
        await sql`
            UPDATE submission 
            SET manager_note = ${managerNote}
            WHERE id = ${submissionId}
        `;
    } else {
        // return { error: "Unauthorized to update this field" };
    }
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function createUser(prevState: UserState, formData: FormData) {
    const validatedFields = CreateUser.safeParse({
        name: formData.get('name'),
        password: formData.get('password'),
        username: formData.get('username'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User',
        };
    }

    const { name, password, username } = validatedFields.data;
    const hashedPassword = await hash(password, saltRounds)
    const email = String(formData.get('email') ?? '');
    const phone = String(formData.get('phone') ?? '');
    const role = Number(formData.get('role') ?? 1);

    try {

        await sql`
    INSERT INTO users (name, password, phone, user_name, role_id)
    VALUES (${name},${hashedPassword},${phone},${username},${role})
  `;
    } catch (error) {

        console.error(error);
        // return {
        //     message: 'Database Error: Failed to Create Invoice.',
        // };
    }
    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');

}

export async function disableUser(id: string, isEnabled: boolean) {
    // const numericId = Number(id);
    await sql`UPDATE users
  SET is_enabled = ${isEnabled}
  WHERE id = ${id}`;
    // revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard/users');
    // redirect('/dashboard/documents');
}

export async function updateUser(id: string, prevState: UserUpdateState, formData: FormData) {
    const validatedFields = UpdateUserSchema.safeParse({
        name: formData.get('name'),
        // username: formData.get('username'),
        password: formData.get("password") || "",
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update User',
        };
    }

    const { name } = validatedFields.data;
    const password = String(formData.get('password') ?? '');
    const hashedPassword = await hash(password, saltRounds);
    // const email = String(formData.get('email') ?? '');
    const phone = String(formData.get('phone') ?? '');

    try {
        await sql`
        UPDATE users
	SET name=${name}, password=${hashedPassword},phone=${phone}
	WHERE id = ${id}   
  `;
    } catch (error) {

        console.error(error);
        // return {
        //     message: 'Database Error: Failed to Create Invoice.',
        // };
    }
    revalidatePath('/dashboard/users');
    redirect('/dashboard/users');

}


export async function createRole(prevState: RoleState, formData: FormData) {

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;

    const validatedFields = CreateRole.safeParse({
        role: formData.get('role'),
        slug: formData.get('slug'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Role',
        };
    }

    const { role, slug } = validatedFields.data;

    try {

        await sql`
    INSERT INTO roles(
	slug, display_name, created_at)
	VALUES (${slug},${role},${localDate})
  `;
    } catch (err: unknown) {

        // console.error(error);
        return {
            message: 'Database Error: Failed to Create a Role.',
        };


    }
    revalidatePath('/dashboard/roles');
    redirect('/dashboard/roles');

}

export async function updateRole(id: string, prevState: RoleState, formData: FormData) {

    const validatedFields = UpdateRole.safeParse({
        role: formData.get('role'),
        // is_valid: formData.get('is_valid')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Role.',
        };
    }

    const { role } = validatedFields.data;
    const numericId = Number(id);
    try {
        await sql`
  UPDATE tbl_roles
  SET role = ${role}
  WHERE id = ${numericId}
`;
    } catch (error) {

        console.error(error);
        // return { message: 'Database Error: Failed to Update Invoice.' };
    }
    revalidatePath('/dashboard/roles');
    redirect('/dashboard/roles');

}

export async function disableRole(id: string, isEnabled: boolean) {
    // const numericId = Number(id);
    await sql`UPDATE tbl_roles
  SET is_enabled = ${isEnabled}
  WHERE id = ${id}`;
    // revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard/roles');
    // redirect('/dashboard/documents');
}


export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        const callbackUrl = formData.get('callbackUrl') as string || '/dashboard';
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: callbackUrl,   // 👈 pass redirect here
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

// export async function authenticate(prevState: string | undefined, formData: FormData) {
//     try {
//         await signIn('credentials', formData);

//     } catch (error) {
//         if (error instanceof AuthError) {
//             switch (error.type) {
//                 case 'CredentialsSignin':
//                     return 'Invalid credentials.';
//                 default:
//                     return 'Something went wrong.';
//             }
//         }
//         throw error;

//     }


// }

//from admin/users/actions
async function guardAdmin() {
    const session = await auth();
    if (!session?.user?.permissions?.includes('manage:users')) {
        throw new Error('Forbidden');

    }
}

export async function assignRoleToUser(userId: string, roleId: number) {

    try {
        // await guardAdmin();

        await sql`
    UPDATE users SET role_id = ${roleId} WHERE id = ${userId}
  `;
        revalidatePath('/admin/users');

    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            if (error.message === 'Forbidden') {
                return {
                    success: false,
                    message: 'You do not have permission to manage user roles. Please contact an administrator.',
                };


            }
        }

        return {
            success: false,
            message: 'Something went wrong.',
        };

        // Prevent user from changing their own role (safety)

    }

}

//from admin/roles/action
export async function updateRoleDisplayName(roleId: number, displayName: string) {
    // await guardAdmin();
    await sql`
    UPDATE roles SET display_name = ${displayName} WHERE id = ${roleId}
  `;
    revalidatePath('/admin/roles');
}

export async function updateRolePermissions(roleId: number, permissions: string[]) {

    try {
        // await guardAdmin();

        // Replace all permissions for this role
        await sql`DELETE FROM role_permissions WHERE role_id = ${roleId}`;
        for (const perm of permissions) {
            await sql`
      INSERT INTO role_permissions (role_id, permission) VALUES (${roleId}, ${perm})
    `;
        }
        revalidatePath('/admin/roles');

    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            if (error.message === 'Forbidden') {
                return {
                    success: false,
                    message: 'You do not have permission to manage user roles. Please contact an administrator.',
                };


            }
        }

        return {
            success: false,
            message: 'Something went wrong.',
        };


    }
}

export async function createSubmissionRecord(agentId: string, customerId: string, status: string) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;
    try {
        const result = await sql`
      INSERT INTO submission (agent_id, customer_id, status,created_at) 
      VALUES (${agentId},${customerId}, ${status},${localDate}) 
      RETURNING id
    `;
        const submissionId = result[0]?.id;
        return { success: true, id: submissionId };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Database Error' };
    }
}

export async function createDocumentRecord(resolvedSubmissionId: number, key: string, fileName: string, documentId: number, master_id: number) {
    try {
        const result = await sql`
      INSERT INTO document (submission_id, file_key, file_name,document_id, master_id) 
      VALUES (${resolvedSubmissionId}, ${key},${fileName},${documentId},${master_id}) 
      
    `;
        // const submissionId = result[0]?.id;
        // return { success: true, id: submissionId };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Database Error' };
    }
}

export async function deleteDocumentByUser(key: string) {
    try {
        // 1. Delete from R2
        await r2.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET!,
                Key: key,
            })
        );

        // 2. Delete from DB
        await sql`DELETE FROM document WHERE file_key = ${key}`;

        // 3. Revalidate UI (if needed)
        // revalidatePath('/dashboard/invoices');

        return { success: true };
    } catch (error) {
        console.error("Delete failed:", error);

        return {
            success: false,
            message: "Failed to delete document",
        };
    }
}


export async function disableDocument(id: string, is_valid: boolean) {
    // const numericId = Number(id);
    await sql`UPDATE tbl_documents
  SET is_valid = ${is_valid}
  WHERE id = ${id}`;
    // revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard/documents');
    // redirect('/dashboard/documents');
}

export async function createBranch(prevState: BranchState, formData: FormData) {

    const validatedFields = CreateBranch.safeParse({
        branch: formData.get('branch'),
        com_id: formData.get('com_id')
    });


    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Document',
        };
    }

    const { branch, com_id } = validatedFields.data;

    try {

        await sql`
    INSERT INTO branches(branch,com_id)
	VALUES (${branch},${com_id});
  `;
    } catch (error) {

        console.error(error);
        // return {
        //     message: 'Database Error: Failed to Create Invoice.',
        // };
    }
    revalidatePath('/dashboard/branches');
    redirect('/dashboard/branches');

}

export async function disableBranch(id: string, is_valid: boolean) {
    // const numericId = Number(id);
    await sql`UPDATE branches
  SET is_valid = ${is_valid}
  WHERE id = ${id}`;
    // revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard/branches');
    // redirect('/dashboard/documents');
}


export async function acceptSubmissionAdminOrManager(summissionId: string) {


    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const roleSlug = session.user.roleSlug;


    if (roleSlug === "admin" && summissionId !== undefined) {
        await sql`
            UPDATE submission 
            SET status = 'pending_manager'
            WHERE id = ${summissionId}
        `;
    } else if (roleSlug === "manager" && summissionId !== undefined) {
        await sql`
            UPDATE submission 
            SET status = 'approved'
            WHERE id = ${summissionId}
        `;
    } else {
        // return { error: "Unauthorized to update this field" };
    }
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}



export async function rejectSubmissionAdminOrManager(summissionId: string) {


    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const roleSlug = session.user.roleSlug;


    if (roleSlug === "admin" && summissionId !== undefined) {
        await sql`
            UPDATE submission 
            SET status = 'admin_rejected'
            WHERE id = ${summissionId}
        `;
    } else if (roleSlug === "manager" && summissionId !== undefined) {
        await sql`
            UPDATE submission 
            SET status = 'manager_rejected'
            WHERE id = ${summissionId}
        `;
    } else {
        // return { error: "Unauthorized to update this field" };
    }
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}
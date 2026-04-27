'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

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
    // document: z.string({ invalid_type_error: 'Please enter document name' }),
});

const DocumentSchema = z.object({
    id: z.string(),
    // id: z.coerce.number(),
    //   ...baseFields,
    document: z.string({ invalid_type_error: 'Please enter document name' }).min(1, 'Document name cannot be empty'),
    // is_valid: z.coerce.boolean({
    //     invalid_type_error: 'Please select valid/invalid'
    // })
    is_valid: z.preprocess((val) => val === "1", z.boolean())
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
    uploadedFilesByDocument: z.record(
        z.array(FileInfoSchema)
    ).refine(obj => Object.keys(obj).length > 0, {
        message: "You must upload at least one document",
    }),
    // mobile: z.string({ invalid_type_error: 'Please enter mobile' }).min(10, 'Customer mobile cannot be empty'),

});



const UserSchema = z.object({
    id: z.string(),
    name: z.string({ invalid_type_error: 'Please enter name' }).min(1, 'User name cannot be empty')
        .regex(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string(),
    // mobile: z.string({ invalid_type_error: 'Please enter mobile' }).min(10, 'Customer mobile cannot be empty'),

});

const UpdateUserSchema = z.object({
    name: z
        .string({ invalid_type_error: "Please enter name" })
        .min(1, "User name cannot be empty")
        .regex(/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"),

    // username: z.string(),

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
    // id: z.coerce.number(),
    //   ...baseFields,
    role: z.string({ invalid_type_error: 'Please enter role name' }).min(1, 'Role name cannot be empty'),
    // is_valid: z.coerce.boolean({
    //     invalid_type_error: 'Please select valid/invalid'
    // })
    is_valid: z.preprocess((val) => val === "1", z.boolean())
});




const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateDocument = DocumentSchema.omit({ id: true });
const UpdateDocument = DocumentSchema.omit({ id: true });

const CreateCustomer = CustomerSchema.omit({ id: true });
const CreateUser = UserSchema.omit({ id: true });
// const UpdateUser = UpdateUserSchema.omit({ id: true });

const CreateRole = RoleSchema.omit({ id: true });
const UpdateRole = RoleSchema.omit({ id: true });

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

// export type DocumentTypeState = {
//     errors?: {
//         document?: string[]
//     };
//     message?: string | null;
// }

export type CustomerState = {
    errors?: {

        name?: string[];
        // mobile?: string[];
        // lan?: string[];
        // lat?: string[];
        // email?: string[];
        uploadedFilesByDocument?: string[];
        // files?: string[];
    };
    message?: string | null;
}

export type UserState = {
    errors?: {

        name?: string[];
        password?: string[];
        username?: string[];
        // lat?: string[];
        // email?: string[];


    };
    message?: string | null;
}

export type UserUpdateState = {
    errors?: {
        name?: string[];
        // username?: string[];
        password?: string[];
    };
    message?: string | null;
};

export type RoleState = {
    errors?: {
        role?: string[]
    };
    message?: string | null;
}






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

export async function createCustomer(prevState: CustomerState, formData: FormData) {


    const raw = formData.get('uploadedFilesByDocument') as string;

    if (!raw) {
        throw new Error("Missing uploadedFilesByDocument");
    }

    // const uploadedFilesByDocument = JSON.parse(raw || "{}");
    let uploadedFilesByDocumentValidated;
    try {
        uploadedFilesByDocumentValidated = JSON.parse(raw || "{}");
    } catch {
        throw new Error("uploadedFilesByDocument must be valid JSON");

    }


    const keptFilesMapping = JSON.parse(formData.get('keptFilesMapping') as string);
    const deletedFilesMapping = JSON.parse(formData.get('deletedFilesMapping') as string);

    // 2. Extract the JSON hidden fields
    // const keptKeysJson = formData.get('keptKeys') as string;
    // const deleteQueueJson = formData.get('deleteQueue') as string;

    // let keptKeys: string[] = [];
    // let deleteQueue: string[] = [];

    // try {
    //     keptKeys = keptKeysJson ? JSON.parse(keptKeysJson) : [];
    //     deleteQueue = deleteQueueJson ? JSON.parse(deleteQueueJson) : [];
    // } catch (e) {
    //     // return { message: 'Invalid file data', errors: { files: ['Invalid file keys'] } };
    // }

    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        uploadedFilesByDocument: uploadedFilesByDocumentValidated,
        // mobile: formData.get('mobile'),
        // lat: formData.get('lat'),
        // lan: formData.get('lan'),

    });

    if (!validatedFields.success) {

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            values: {
                name: formData.get('name'),
                uploadedFilesByDocument: uploadedFilesByDocumentValidated,
            },
            message: 'Missing Fields. Failed to Create Customer',
            // errors: validatedFields.error.flatten().fieldErrors,
            // message: 'Missing Fields. Failed to Create Customer',
        };
    }

    // // try {

    // //     for (const mapping of keptFilesMapping) {
    // //         const { documentId, keys } = mapping; // keys is an array of file keys (strings)
    // //         for (const tempKey of keys) {
    // //             const finalKey = tempKey.replace(/^temp\//, 'documents/');

    // //             // Copy object to new location
    // //             await r2.send(new CopyObjectCommand({
    // //                 Bucket: process.env.R2_BUCKET,
    // //                 CopySource: `${process.env.R2_BUCKET}/${tempKey}`,
    // //                 Key: finalKey,
    // //             }));

    // //             // Delete the original temp object
    // //             await r2.send(new DeleteObjectCommand({
    // //                 Bucket: process.env.R2_BUCKET,
    // //                 Key: tempKey,
    // //             }));

    // //             // const fileName = tempKey.split('/').pop()?.replace(/^[a-f0-9-]+-/, '') || 'unknown';
    // //             //         await txn`
    // //             //             INSERT INTO customer_details (document_id, master_id, file_key, file_name)
    // //             //             VALUES (${documentId}, ${lastInsertedRowId}, ${finalKey}, ${fileName})
    // //             //         `;


    // //         }
    // //     }

    //     // 2. Delete queued files
    //     for (const mapping of deletedFilesMapping) {
    //         const { documentId, keys } = mapping;
    //         for (const key of keys) {
    //             await r2.send(new DeleteObjectCommand({
    //                 Bucket: process.env.R2_BUCKET,
    //                 Key: key,
    //             }));
    //         }
    //     }
    //     // for (const tempKey of keptKeys) {
    //     //     const finalKey = tempKey.replace(/^temp\//, 'documents/');
    //     //     // Copy object
    //     //     await r2.send(new CopyObjectCommand({
    //     //         Bucket: process.env.R2_BUCKET,
    //     //         CopySource: `${process.env.R2_BUCKET}/${tempKey}`,
    //     //         Key: finalKey,
    //     //     }));
    //     //     // Delete the temp object
    //     //     await r2.send(new DeleteObjectCommand({
    //     //         Bucket: process.env.R2_BUCKET,
    //     //         Key: tempKey,
    //     //     }));
    //     // }

    //     // // 5. Delete queued files
    //     // for (const key of deleteQueue) {
    //     //     await r2.send(new DeleteObjectCommand({
    //     //         Bucket: process.env.R2_BUCKET,
    //     //         Key: key,
    //     //     }));
    //     // }
    // } catch (error) {
    //     console.error('R2 operation failed:', error);
    //     // return { message: 'Failed to process files', errors: {} };
    // }









    //  const { name, mobile, lat, lan } = validatedFields.data;
    const { name, uploadedFilesByDocument } = validatedFields.data;
    const email = String(formData.get('email') ?? '');
    const img_url = "/customers/evil-rabbit.png";
    const mobile = String(formData.get('mobile') ?? '0');
    const locationLink = String(formData.get('googleLink') ?? '0');
    // const lat = String(formData.get('lat') ?? '0');
    // const lan = String(formData.get('lan') ?? '0');



    await sql.begin(async (txn) => {
        // 1. Insert the customer
        const result = await txn`
    INSERT INTO customers (name, email, image_url, mobile,loc_link)
    VALUES (${name}, ${email}, ${img_url}, ${mobile}, ${locationLink})
    RETURNING id;
  `;
        const lastInsertedRowId = result[0].id;

        // 2. Insert all kept file records with final keys (documents/...)
        for (const mapping of keptFilesMapping) {
            const { documentId, keys } = mapping;
            for (const tempKey of keys) {
                // Generate final key by replacing prefix
                const finalKey = tempKey.replace(/^temp\//, 'documents/');

                // Extract original file name from the temp key
                // Assumes key format: temp/{documentId}/{uuid}-{fileName}
                const fileName = tempKey.split('/').pop()?.replace(/^[a-f0-9-]+-/, '') || 'unknown';

                await txn`
        INSERT INTO customer_details (document_id, master_id, file_key, file_name)
        VALUES (${documentId}, ${lastInsertedRowId}, ${finalKey}, ${fileName})
      `;
            }
        }
    });

    try {
        for (const mapping of keptFilesMapping) {
            const { keys } = mapping;
            for (const tempKey of keys) {
                const finalKey = tempKey.replace(/^temp\//, 'documents/');
                await r2.send(new CopyObjectCommand({
                    Bucket: process.env.R2_BUCKET,
                    CopySource: `${process.env.R2_BUCKET}/${tempKey}`,
                    Key: finalKey,
                }));
                await r2.send(new DeleteObjectCommand({
                    Bucket: process.env.R2_BUCKET,
                    Key: tempKey,
                }));
            }
        }

        // 4. Delete queued files (user‑deleted temp keys)
        for (const mapping of deletedFilesMapping) {
            const { keys } = mapping;
            for (const key of keys) {
                await r2.send(new DeleteObjectCommand({
                    Bucket: process.env.R2_BUCKET,
                    Key: key,
                }));
            }
        }
    } catch (error) {
        console.error('R2 operation failed:', error);
        // Log error, but the database already has the final keys.
        // You can run a separate cleanup job to move leftover temp files later.
    }

    // try {
    //     await sql.begin(async (txn) => {

    //         const result = await txn` INSERT INTO customers (name, email, image_url,mobile,latitude,longitude)
    //          VALUES (${name}, ${email}, ${img_url},${mobile},${lat},${lan})
    //          RETURNING id;`

    //         const lastInertedRowId = result[0].id;

    //         for (const [documentId, files] of Object.entries(uploadedFilesByDocument)) {
    //             for (const file of files as any[]) {
    //                 await txn`
    //         INSERT INTO customer_details (
    //            document_id, master_id, file_key, file_name
    //         )
    //         VALUES (
    //           ${documentId},
    //           ${lastInertedRowId},
    //           ${file.key},
    //           ${file.name}              
    //         )
    //       `;
    //             }

    //         }

    //     });


    //     // await sql`
    //     //     INSERT INTO customers (name, email, image_url,mobile)
    //     //     VALUES (${name}, ${email}, ${img_url},${mobile})
    //     //   `;
    // } catch (error) {

    //     console.error(error);
    //     // return {
    //     //     message: 'Database Error: Failed to Create Invoice.',
    //     // };
    // }
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');


}

export async function disableCustomer(id: string, isEnabled: boolean) {
    const numericId = Number(id);
    await sql`UPDATE customers
  SET is_enabled = ${isEnabled}
  WHERE id = ${numericId}`;
    // revalidatePath('/dashboard/invoices');
    revalidatePath('/dashboard/documents');
    // redirect('/dashboard/documents');
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
    INSERT INTO users (name, password,phone, user_name,role)
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
    const validatedFields = CreateRole.safeParse({
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Role',
        };
    }

    const { role } = validatedFields.data;

    try {

        await sql`
    INSERT INTO tbl_roles(
	role)
	VALUES (${role})
  `;
    } catch (error) {

        console.error(error);
        // return {
        //     message: 'Database Error: Failed to Create Invoice.',
        // };
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



export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);

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
    console.log("rolid");
    console.log(roleId);
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
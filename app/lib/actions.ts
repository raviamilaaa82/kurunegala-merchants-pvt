'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
// import { UpdateInvoice } from '../ui/invoices/buttons';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });

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

const CustomerSchema = z.object({
    id: z.string(),
    name: z.string({ invalid_type_error: 'Please enter name' }).min(1, 'Customer name cannot be empty'),
    mobile: z.string({ invalid_type_error: 'Please enter mobile' }).min(10, 'Customer mobile cannot be empty'),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateDocument = DocumentSchema.omit({ id: true });
const UpdateDocument = DocumentSchema.omit({ id: true });

const CreateCustomer = CustomerSchema.omit({ id: true });

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

export type DocumentTypeState = {
    errors?: {
        document?: string[]
    };
    message?: string | null;
}

export type CustomerState = {
    errors?: {

        name?: string[];
        mobile?: string[];
        // email?: string[];
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
    console.log(formData.get('is_valid'));//in here it is showing correct value. 
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
    console.log(is_valid); // in here its is always true

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
    // console.log("uploaded from");
    //   const uploaded = JSON.parse(formData.get("uploadedFilesByDocument") || "{}");
    //   console.log(uploaded);
    //    console.log("uploaded");
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        mobile: formData.get('mobile'),

    });

    if (!validatedFields.success) {

        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice',
        };
    }

    const { name, mobile } = validatedFields.data;
    const email = formData.get('email');
    const img_url = "/customers/evil-rabbit.png";
    try {
        //         await sql`
        //     INSERT INTO customers (name, email, image_url,mobile)
        //     VALUES (${name}, ${email}, ${img_url},${mobile})
        //   `;
    } catch (error) {

        console.error(error);
        // return {
        //     message: 'Database Error: Failed to Create Invoice.',
        // };
    }
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');


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
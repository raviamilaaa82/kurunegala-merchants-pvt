import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { sql } from './app/lib/db';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });


// async function getUser(email: string): Promise<User | undefined> {
//     try {
//         const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//         return user[0];
//     } catch (error) {
//         console.error('Failed to fetch user:', error);
//         throw new Error('Failed to fetch user.');
//     }
// }

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {

                // console.log("1. authorize called with email:", credentials?.email);

                const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    //newly added code
                    const result = await sql`
                        SELECT
                            u.id,
                            u.email,
                            u.name,
                            u.password,
                            r.id           AS role_id,
                            r.slug         AS role_slug,
                            r.display_name AS role_name,
                            ARRAY_AGG(rp.permission) AS permissions
                        FROM users u
                        JOIN roles r ON r.id = u.role_id
                        LEFT JOIN role_permissions rp ON rp.role_id = r.id
                        WHERE u.email = ${email}
                        GROUP BY u.id, r.id
                        `;

                    // console.log('1. result:', result);          // check query result

                    const user = result[0];
                    // console.log('2. user:', user);              // check user found
                    // console.log('3. password input:', password); // check password coming in
                    // console.log('4. password in db:', user?.password);
                    if (!user) return null;

                    // if (!user) {
                    //     console.log('❌ No user found');
                    //     return null;
                    // }
                    //newly added code below is commented because same thing right above this line
                    // const user = await getUser(email);
                    // if (!user) return null;
                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    // console.log('5. passwordsMatch:', passwordsMatch);
                    if (!passwordsMatch) return null;//this is new code (same thing )
                    // if (!passwordsMatch) {
                    //     console.log('❌ Password mismatch');
                    //     return null;
                    // }
                    // if (passwordsMatch) return user; //this is existing code
                    //newly added code from here to 
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        roleId: user.role_id,
                        roleSlug: user.role_slug,
                        roleName: user.role_name,
                        permissions: user.permissions?.filter(Boolean) ?? [],
                    };
                    // till here to 
                }
                // console.log('Invalid credentials');
                return null;



            }
        })],
});
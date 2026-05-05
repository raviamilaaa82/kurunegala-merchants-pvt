import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

import { sql } from './app/lib/db';



export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                // const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) })
                //     .safeParse(credentials);
                const parsedCredentials = z.object({ user_name: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { user_name, password } = parsedCredentials.data;
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
                        WHERE u.user_name = ${user_name} AND u.is_enabled='true'
                        GROUP BY u.id, r.id
                        `;

                    const user = result[0];

                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) return null;//this is new code (same thing )


                    try {
                        await sql`
                            INSERT INTO user_activity (user_id, user_name, action, page)
                            VALUES (${user.id}, ${user.name ?? ''}, 'login', NULL)
                        `;
                    } catch (err) {
                        console.error('Failed to log login activity:', err);
                    }
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
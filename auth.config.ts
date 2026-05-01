import next from "next";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            // const isOnManageUser = nextUrl.pathname.startsWith('/dashboard/roles');
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            // const isOnAdmin = nextUrl.pathname.startsWith('/admin'); //newly added

            //newly   /dashboard/documents
            // if (isOnAdmin) {
            //     // ✅ Added: block non-admins from /admin
            //     const permissions = auth?.user?.permissions ?? [];
            //     return isLoggedIn && permissions.includes('manage:users');
            // }

            // if (isOnManageUser) {
            //     const permissions = auth?.user?.permissions ?? [];

            //     return isLoggedIn && permissions.includes('view:role');
            // }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;// Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('dashboard', nextUrl));
            }
            // return true;

        },

        // ✅ Added: save role & permissions into JWT newly added
        async jwt({ token, user }) {
            if (user) {
                // token.id = user.id;
                token.sub = user.id;
                token.name = user.name;
                token.roleId = user.roleId;
                token.roleSlug = user.roleSlug;
                token.roleName = user.roleName;
                token.permissions = user.permissions;
            }
            return token;
        },
        // ✅ Added: expose to session (client-side) //newly added
        async session({ session, token }) {
            session.user.id = token.sub as string;
            session.user.name = token.name;
            session.user.roleId = token.roleId;
            session.user.roleSlug = token.roleSlug;
            session.user.roleName = token.roleName;
            session.user.permissions = token.permissions;
            return session;
        },

    },
    providers: [],// Add providers with an empty array for now

} satisfies NextAuthConfig;
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


            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;// Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('dashboard', nextUrl));
            }
            // return true;

        },


        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.roleId = user.roleId;
                token.roleSlug = user.roleSlug;
                token.roleName = user.roleName;
                token.permissions = user.permissions;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.sub as string;
            session.user.name = token.name;
            session.user.roleId = token.roleId as number;
            session.user.roleSlug = token.roleSlug as string;
            session.user.roleName = token.roleName as string;
            session.user.permissions = token.permissions as string[];
            return session;
        },

    },
    providers: [],// Add providers with an empty array for now

} satisfies NextAuthConfig;
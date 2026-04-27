// proxy.ts  (root level — rename of middleware.ts in newer Next.js)

// proxy.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    // ✅ existing tutorial behaviour — redirect to login if not logged in
    const isOnDashboard = pathname.startsWith('/dashboard');
    if (isOnDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // ✅ added — block /admin unless user has manage:users permission
    // const permissions = req.auth?.user?.permissions ?? [];
    // if (pathname.startsWith('/admin') && !permissions.includes('manage:users')) {
    //     return NextResponse.redirect(new URL('/dashboard', req.url));
    // }
    //  // ✅ added — block /admin unless user has manage:users permission  . this is after chaning locations of admin to dashboard/admin
    const cusPermissions = req.auth?.user?.permissions ?? [];
    if (pathname.startsWith('/dashboard/customers') && !cusPermissions.includes('manage:customers')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // const permissions = req.auth?.user?.permissions ?? [];
    // if (pathname.startsWith('/dashboard/admin') && !permissions.includes('manage:users')) {
    //     return NextResponse.redirect(new URL('/dashboard', req.url));
    // }
    const docPermissions = req.auth?.user?.permissions ?? [];
    if (pathname.startsWith('/dashboard/documents') && !docPermissions.includes('manage:documents')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const userPermissions = req.auth?.user?.permissions ?? [];
    if (pathname.startsWith('/dashboard/users') && !userPermissions.includes('manage:users')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const rolePermissions = req.auth?.user?.permissions ?? [];
    if (pathname.startsWith('/dashboard/roles') && !rolePermissions.includes('manage:roles')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    const perPermissions = req.auth?.user?.permissions ?? [];
    if (pathname.startsWith('/dashboard/permissions') && !perPermissions.includes('manage:permissions')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};




// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
// import { NextResponse } from 'next/server';

// const { auth } = NextAuth(authConfig);

// export default auth((req) => {
//     const { pathname } = req.nextUrl;
//     const permissions = req.auth?.user?.permissions ?? [];

//     if (pathname.startsWith('/admin')) {
//         if (!permissions.includes('manage:users')) {
//             return NextResponse.redirect(new URL('/dashboard', req.url));
//         }
//     }
// });

// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };



// import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';

// export default NextAuth(authConfig).auth;

// export const config = {
//     // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };






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




    const permissions = req.auth?.user?.permissions ?? [];  // 👈 one variable

    if (pathname.startsWith('/dashboard/documents') && !permissions.includes('manage:documents')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (pathname.startsWith('/dashboard/users') && !permissions.includes('manage:users')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (pathname.startsWith('/dashboard/roles') && !permissions.includes('manage:roles')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (pathname.startsWith('/dashboard/branches') && !permissions.includes('manage:branch')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (pathname.startsWith('/dashboard/permissions') && !permissions.includes('manage:permissions')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    if (pathname.startsWith('/dashboard/history') && !permissions.includes('manage:history')) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }



});

export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
    matcher: ['/((?!api|_next/static|_next/image|uploads|.*\\.png$).*)'],
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





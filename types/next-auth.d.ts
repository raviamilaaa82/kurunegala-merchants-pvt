import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        name?: string;
        roleId?: number;
        roleSlug?: string;
        roleName?: string;
        permissions?: string[];
    }

    interface Session {
        user: {
            id: string;
            name?: string;
            email: string;
            roleId?: number;
            roleSlug?: string;
            roleName?: string;
            permissions?: string[];
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        name?: string;
        roleId?: number;
        roleSlug?: string;
        roleName?: string;
        permissions?: string[];
    }
}
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface User {
        roleId?: number;
        roleSlug?: string;
        roleName?: string;
        permissions?: string[];
    }

    interface Session {
        user: {
            id: string;
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
        roleId?: number;
        roleSlug?: string;
        roleName?: string;
        permissions?: string[];
    }
}
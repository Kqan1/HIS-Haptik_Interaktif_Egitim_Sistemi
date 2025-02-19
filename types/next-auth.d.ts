import { DefaultUser } from 'next-auth';
import { ROLE } from "@prisma/client";

declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & {
            id: string;
            username: string;
            email: string;
            password: string;
            role: ROLE;
            createdAt: Date;
        };
    };
    interface User extends DefaultUser {
        id: string;
        username: string;
        email: string;
        password: string;
        role: ROLE;
        createdAt: Date;
    };
};
declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
        email: string;
        password: string;
        role: ROLE;
        createdAt: Date;
    };
};
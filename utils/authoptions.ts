import { db } from "@/lib/db";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    // adapter: PrismaAdapter(db),
    pages: {
        // signIn: "/login",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "email",
                    type: "text",
                    placeholder: "email",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const dbUser = await db.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!dbUser) return null;

                const isPasswordValid = await compare(
                    credentials.password,
                    dbUser.password
                );

                if (!isPasswordValid) return null;

                return {
                    id: dbUser.id,                    
                    username: dbUser.username,
                    email: dbUser.email,
                    password: dbUser.password,
                    createdAt: dbUser.createdAt,
                };
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,                    
                    username: token.username,
                    email: token.email,
                    password: token.password,
                    createdAt: token.createdAt,
                },
            };
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,                    
                    username: u.username,
                    email: u.email,
                    password: u.password,
                    createdAt: u.createdAt,
                };
            }
            return token;
        },
    },
};
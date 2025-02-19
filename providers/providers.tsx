import NextThemesProvider from "@/providers/next-themes-provider";
import NextAuthProvider from "@/providers/next-auth-provider";

export default function Providers({ children }: { children: React.ReactNode; }) {
    return (
        <NextThemesProvider>
            <NextAuthProvider>
                { children }
            </NextAuthProvider>
        </NextThemesProvider>
    );
};
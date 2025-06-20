import "../styles/globals.css";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site-config";
import { fontSans } from "@/utils/fonts";
import { cn } from "@/lib/utils";

import Providers from "@/providers/providers";
import MaxWidthWrapper from "@/components/maxwidthwrapper";
// import AuthDebug from "@/components/auth-debug";
import Nav from "@/components/nav";
import Header from "@/components/header";

export const metadata: Metadata = siteConfig.metadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className="h-full" suppressHydrationWarning>
            <body className={cn("bg-background relative h-full font-sans antialiased overflow-x-hidden text-foreground", fontSans.variable)}>
                <main className="relative flex min-h-screen flex-col bg-background">
                    <Providers>
                        <Header />
                        <MaxWidthWrapper className="flex-1 grow">
                            {children}
                        </MaxWidthWrapper>                        
                        <Nav />
                        {/*<AuthDebug />*/}
                    </Providers>
                </main>
            </body>
        </html>
    );
};
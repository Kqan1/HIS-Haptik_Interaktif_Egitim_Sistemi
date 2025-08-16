"use client";
import { LinkType } from "@/app/page";
import { cn } from "@/lib/utils";
import { Home, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLinks: LinkType[] = [{
    Label: "Home",
    Icon: Home,
    Href: "/",
}, {
    Label: "Settings",
    Icon: Settings,
    Href: "/settings",
}, {
    Label: "Profile",
    Icon: User,
    Href: "/profile",
}];

export default function Nav() {
    const pathname = usePathname();
    
    return (
        <div className="flex justify-center w-[400px] mx-auto">
            <nav className="max-w-screen-md w-full grid grid-flow-col grid-rows-1 py-1 px-4 border border-zinc-300">
                {NavLinks.map((link, index) => (
                    <NavLink Label={link.Label} Icon={link.Icon} Href={link.Href} Active={pathname === link.Href} key={index} />
                ))}
            </nav>
        </div>
    );
};

function NavLink({ Label, Icon, Href, Active }: LinkType) {
    return (
        <Link href={Href} className="flex flex-col justify-center items-center">
            <div className={cn("py-0.5 px-6 rounded-full", Active && "bg-zinc-300")}>
                <Icon />
            </div>
            {Label}
        </Link>
    );
};
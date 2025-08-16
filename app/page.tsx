import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BrainCircuit, File, Folders, LucideIcon, NotebookPen, PencilLine } from "lucide-react";
import Link from "next/link";

export interface LinkType {
    Label: string;
    Icon: LucideIcon;
    Href: string;
    Active?: boolean;
};

const Links: LinkType[] = [{
    Label: "Manual Screen Control",
    Href: "/manual",
    Icon: PencilLine
}, {
    Label: "Notebook",
    Href: "/notes",
    Icon: NotebookPen
}, {
    Label: "Ai Teacher",
    Href: "/ai-learning",
    Icon: BrainCircuit
}, {
    Label: "Lesson Records",
    Href: "/lecture-records",
    Icon: Folders
}, {
    Label: "PDF",
    Href: "/pdf",
    Icon: File
},];

export default function Home() {
    return (
        <div className="grid grid-cols-2 place-items-center gap-2">
            { Links.map((link, index)=>(
                <LinkCard key={index} Href={link.Href} Label={link.Label} Icon={link.Icon} />
            )) }
        </div>
    );
};

function LinkCard({ Label, Href, Icon }: LinkType) {
    return (
        <Link href={Href} className={cn(buttonVariants({ variant: "outline" }), "size-44 flex flex-col items-center justify-center gap-2")}>
            <Icon className="!size-8" />
            <p className="font-medium text-wrap text-center text-l">{Label}</p>
        </Link>
    );
};
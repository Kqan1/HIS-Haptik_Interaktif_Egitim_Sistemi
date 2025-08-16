import { Button, buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Book, ListOrdered, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface CardType {
    href: string;
    title: string;
    date: string;
};

export default function LectureRecords() {
    const Cards: CardType[] = [{
        href: "/test",
        date: "15/2/2025",
        title: "Math class",
    }, {
        href: "/test",
        date: "15/2/2025",
        title: "Math class",
    }, {
        href: "/test",
        date: "15/2/2025",
        title: "physics class",
    }, {
        href: "/test",
        date: "15/2/2025",
        title: "Literature Class",
    }];

    return (
        <div className="space-y-4">
            <Heading
                title="Lesson Records"
                description="You can listen to your recorded lessons here"
                Icon={Book}
            />
            <div className="space-y-2">
                <div className={buttonVariants({ variant: "outline", className: "w-full !justify-between !h-auto !p-1 hover:!bg-inherit" })}>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" className="px-3">
                            <Plus /> New Records
                        </Button>
                        <Button variant="destructive" className="px-3">
                            <Trash2 /> Delete Records
                        </Button>
                        <Separator orientation="vertical" className="h-8" />
                    </div>
                    <p className="flex items-center gap-1 border rounded p-2 cursor-pointer">
                        <ListOrdered /> 
                    </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                    {Cards.map((card)=>(
                        <Card
                            key={card.href}
                            href={`/lecture-records/${card.href}`}
                        >
                            <p>{card.title}</p>
                            <p className="w-full text-end text-sm">{card.date}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

function Card({ children, href }: { children: React.ReactNode; href: string; }) {
    return (
        <Link
            href={href}
            className={buttonVariants({ variant: "outline", className: "flex-col !items-start !h-auto" })}
        >
            {children}
        </Link>
    )
};
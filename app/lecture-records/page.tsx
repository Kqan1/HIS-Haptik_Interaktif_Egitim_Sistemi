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
        date: "2/15/2025",
        title: "Matematik Dersi",
    }, {
        href: "/test",
        date: "2/15/2025",
        title: "Matematik Dersi",
    }, {
        href: "/test",
        date: "2/15/2025",
        title: "Fizik Dersi",
    }, {
        href: "/test",
        date: "2/15/2025",
        title: "Edebiyat Dersi",
    }];

    return (
        <div className="space-y-4">
            <Heading
                title="Ders Kayıtları"
                description="Buradan kayıtlı derslerini yeniden dinleyebilirsin"
                Icon={Book}
            />
            <div className="space-y-2">
                <div className={buttonVariants({ variant: "outline", className: "w-full !justify-between !h-auto !p-1 hover:!bg-inherit" })}>
                    <div className="flex items-center gap-1">
                        <Button variant="outline">
                            <Plus /> Yeni Kayıt
                        </Button>
                        <Button variant="destructive">
                            <Trash2 /> Kayıtları sil
                        </Button>
                        <Separator orientation="vertical" className="h-8" />
                    </div>
                    <p className="flex items-center gap-1 cursor-pointer mr-2">
                        <ListOrdered /> Tarihe göre
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
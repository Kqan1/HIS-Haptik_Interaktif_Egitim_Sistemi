import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { db } from "@/lib/db";
import { Book, Plus } from "lucide-react";
import Link from "next/link";

interface NoteCardType {
    title: string;
    id: number;
};

export default async function Notes() {
    const notes = await db.notes.findMany({});
    
    return (
        <>
            <div className="flex items-center justify-between my-6">
                <Heading 
                    title={`Notes (${notes.length})`}
                    description="You can read your notes here"
                    Icon={Book}
                />
                <h1 className="text-3xl font-bold"></h1>
                <Link className={buttonVariants({ size: "icon" })} href="/notes/new">
                    <Plus />
                    <p className="sr-only">Now Note</p>
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {notes.map((note, index)=>(
                    <NoteCard title={note.title} id={note.id} key={index} />
                ))}
            </div>
        </>
    );
};

function NoteCard({ title, id }: NoteCardType) {
    return (
        <Link href={`/notes/${id}`} className="border border-zinc-300 rounded p-4 aspect-square">
            <h2 className="font-semibold text-2xl">{title}</h2>
        </Link>
    );
};
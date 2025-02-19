import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
}

export default function MaxWidthWrapper({ children, className }: Props) {
    return (
        <div className={cn(className, "mx-auto w-full max-w-screen-md border border-zinc-300 px-4 md:px-20 py-4")}>
            { children }
        </div>
    );
};
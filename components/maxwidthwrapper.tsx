import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
    className?: string;
}

export default function MaxWidthWrapper({ children, className }: Props) {
    return (
        <div className={cn(className, "mx-auto w-full max-w-[400px] border border-zinc-300 p-4")}>
            { children }
        </div>
    );
};
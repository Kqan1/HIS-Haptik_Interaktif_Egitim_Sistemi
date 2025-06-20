import { cn } from "@/lib/utils"

export function ProjeIcon({ className }: { className?: string; }) {
    return (
        <p className={cn("text-2xl", className)}>Proje Adı</p>
    );
};
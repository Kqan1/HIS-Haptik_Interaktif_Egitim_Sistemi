import { cn } from "@/lib/utils"

export function Skeleton({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    if ( children ){
        return (
            <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props}>
                { children }
            </div>
        )
    }
    
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    );
};
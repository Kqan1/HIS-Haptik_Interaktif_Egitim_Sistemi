import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface HeadingProps {
    title: string;
    description: string;
    className?: string;
    Icon?: LucideIcon;
}

export const Heading: React.FC<HeadingProps> = ({ title, description, className, Icon }) => {
    return (
        <div className={cn("flex", className)}>
            { Icon && 
                <div className="mr-2 h-full flex items-center">
                    <Icon size={42} />
                </div> 
            }
            <div className="">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>    
        </div>
    );
};
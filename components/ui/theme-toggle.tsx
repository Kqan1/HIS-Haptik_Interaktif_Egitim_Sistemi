"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme();

    const onClick = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Button 
            variant="outline" 
            size="icon"
            onClick={onClick}
            className={cn(className)}
        >
            <Sun className="size-5 dark:hidden" />
            <Moon className="size-5 hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};

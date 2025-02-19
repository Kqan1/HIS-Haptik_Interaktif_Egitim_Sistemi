"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Ear, Search } from "lucide-react";
import { PropsWithChildren, useState } from "react";

export default function Settings() {
    const [isPlaying, setIsPlaying] = useState(false);

    const playSound = () => {
        if (isPlaying) return;
        setIsPlaying(true);

        const audio = new Audio("/sound-test.mp3");
        let playCount = 3;

        const playLoop = () => {
            if (playCount > 0) {
                audio.currentTime = 0;
                audio.play().then(() => {
                    playCount--;
                });

                audio.onended = () => {
                    if (playCount > 0) {
                        playLoop();
                    } else {
                        setIsPlaying(false);
                    }
                };
            };
        };

        playLoop();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
                <div className="border rounded bg-zinc-50 size-60" /> {/* image */}
                <div className="test">Magtouch 1.0</div>
            </div>
            <Card className="flex justify-between">
                <p>Bağlantı Sağlandı</p>
                <Button>Bağlantıyı Kes</Button>
            </Card>
            <Card className="flex justify-between h-20">
                <Button variant="outline" className="flex flex-col h-auto w-[49.5%]">
                    <Search className="!size-10" />
                    <p>Tabletimi bul</p>
                </Button>
                <Button variant="outline" className="flex flex-col h-auto w-[49.5%]" onClick={playSound}>
                    <Ear className="!size-10" />
                    <p>Hoparlör Testi</p>
                </Button>
            </Card>
        </div>
    );
};

function Card({ children, className }: PropsWithChildren<{className: string}>){
    return (
        <div className={cn("flex items-center border rounded p-2 bg-zinc-50", className)}>
            {children}
        </div>
    );
};
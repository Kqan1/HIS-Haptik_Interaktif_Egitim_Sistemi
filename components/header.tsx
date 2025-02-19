"use client";
import { BatteryCharging, BatteryFull, BatteryLow, BatteryMedium } from "lucide-react"
import { useState } from "react";

type BatteryStatusType = "full" | "medium" | "low" | "charging"

export default function Header() {
    const [batterryStatus, setBatteryStatus] = useState<BatteryStatusType>("full");

    return (
        <div className="flex justify-center">
            <header className="max-w-screen-md w-full flex justify-between py-1 px-4 border border-zinc-300">
                <div className="">MagTouch {`Bağlantı Sağlandı`}</div>
                <div className="flex items-center gap-0.5">
                    <BatteryIndicator BatteryStatus={batterryStatus} />
                </div>
            </header>
        </div>
    );
};

function BatteryIndicator({ BatteryStatus }: { BatteryStatus: BatteryStatusType }) {
    switch (BatteryStatus) {
        case "full":
            return (
                <>
                    <p className="text-sm">98%</p>
                    <BatteryFull />
                </>
            );
            break;
            case "medium":
                return (
                    <>
                        <p className="text-sm">44%</p>
                        <BatteryMedium />
                    </>
                );
                break;
            case "low":
                return (
                    <>
                        <p className="text-sm">12%</p>
                        <BatteryLow />
                    </>
                );
            break;
            case "charging":
                return (
                    <>
                        <p className="text-sm">12%</p>
                        <BatteryCharging />
                    </>
                );
            break;
    
        default:
            break;
    }
    
};
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import React from 'react'

export default function Profile() {
    if (true) {
        return (
            <div className="">
                Work in progress
            </div>
        )
    }
    
    return (
        <div className="py-4 space-y-8">
            <div className="flex flex-col items-center justify-center gap-8">
                <Avatar className="size-60">
                    <AvatarImage src="/ito.jpg" />
                    <AvatarFallback>MT</AvatarFallback>
                </Avatar>
                <h2 className="font-medium text-2xl">{`Kullanıcı İsmi`}</h2>
            </div>
            <div className="flex flex-col gap-2">
                <Link 
                    href="/test"
                    className="p-4 border rounded shadow"
                >
                    <h3>Katıldığım Dersler</h3>
                </Link>
                <Link 
                    href="/test"
                    className="p-4 border rounded shadow"
                >
                    <h3>Katıldığım Dersler</h3>
                </Link>
                <Link 
                    href="/test"
                    className="p-4 border rounded shadow"
                >
                    <h3>Katıldığım Dersler</h3>
                </Link>
                <Link 
                    href="/test"
                    className="p-4 border rounded shadow"
                >
                    <h3>Katıldığım Dersler</h3>
                </Link>
            </div>
        </div>
    );
};
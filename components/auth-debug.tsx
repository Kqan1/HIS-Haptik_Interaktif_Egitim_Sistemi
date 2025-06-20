"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { ROLE } from "@prisma/client";

export default function AuthDebug() {

    function SignInToggle(role: ROLE){
        if (role === "STUDENT") {
            signIn("credentials", { email: "test@student.com", password: "test" })
        };
        if (role === "TEACHER") {
            signIn("credentials", { email: "test@teacher.com", password: "test" })
        };
    };

    return (
        <div className="fixed bottom-2 right-2 flex gap-2">
            <Button onClick={() => SignInToggle("STUDENT")}>
                Öğrenci
            </Button>
            <Button onClick={() => SignInToggle("TEACHER")}>
                Öğretmen
            </Button>
        </div>
    );
};
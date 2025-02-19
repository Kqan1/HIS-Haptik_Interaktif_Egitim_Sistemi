"use client";
import { Button } from "@/components/ui/button";
import Matrix from "@/components/ui/matrix";
import axios from "axios";
import { useState } from "react";

export default function NewNote() {
    const [matrix, setMatrix] = useState<number[][] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    console.log(matrix);

    const handleSave = async () => {
        try {
            await axios.post("/api/notes", {
                title: "test1",
                matrix,
            });
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        };
    };

    return (
        <div className="space-y-2">
            <Matrix 
                editable
                onChange={(newMatrix) => (setMatrix(newMatrix))}
                disabled={loading}
            />
            <Button
                onClick={handleSave}
                className="w-full"
            >
                Kaydet
            </Button>
        </div>
    );
};
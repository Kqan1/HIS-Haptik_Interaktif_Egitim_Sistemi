"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Matrix from "@/components/ui/matrix";
import axios from "axios";
import { useState } from "react";

export default function NewNote() {
    const [matrix, setMatrix] = useState<number[][] | null>(null);
    const [title, setTitle] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    console.log(matrix);

    const handleSave = async () => {
        if (!title.trim()) {
            alert("Lütfen bir başlık girin");
            return;
        }
        
        try {
            setLoading(true);
            await axios.post("/api/notes", {
                title: title.trim(),
                matrix,
            });
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        };
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                    Title
                </label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />
            </div>
            
            <Matrix 
                editable
                onChange={(newMatrix) => (setMatrix(newMatrix))}
                disabled={loading}
            />
            
            <Button
                onClick={handleSave}
                className="w-full"
                disabled={loading || !title.trim()}
            >
                {loading ? "Saving..." : "Save"}
            </Button>
        </div>
    );
};
"use client";

import { Button } from "@/components/ui/button";
import Matrix from "@/components/ui/matrix";
import axios from "axios";
import { useEffect, useState } from "react";

interface Note {
    id: number;
    title: string;
    pixelMatrix: {
        id: number;
        matrix: number[][];
    };
};

export default function NoteId({ params }: { params: { noteId: string } }) {
    const [note, setNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [matrix, setMatrix] = useState<number[][] | null>(null);

    useEffect(()=>{
        setMatrix(note?.pixelMatrix.matrix);
    }, [note]);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get<Note>(`/api/notes/${params.noteId}`);
                setNote(response.data);
            } catch (err) {
                setError("Not yüklenirken bir hata oluştu");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [params.noteId]);

    const handleSave = async () => {
        try {
            await axios.put(`/api/notes/${params.noteId}`, {
                title: "test2",
                matrix,
            });
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        };
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/notes/${params.noteId}`);
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        };
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
    };

    if (error || !note) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    };

    console.log(matrix)

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
            <Matrix 
                initialData={note.pixelMatrix.matrix}
                editable={true}
                onChange={(newMatrix) => (setMatrix(newMatrix))}
                size={note.pixelMatrix.matrix.length}
            />
            <div className="flex gap-2">
                <Button
                    onClick={handleSave}
                    className="w-1/2"
                    >
                    Kaydet
                </Button>
                <Button
                    onClick={handleDelete}
                    className="w-1/2"
                    variant="destructive"
                    >
                    Sil
                </Button>
            </div>
        </div>
    );
};
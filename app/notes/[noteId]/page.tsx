"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Matrix from "@/components/ui/matrix";
import { siteConfig } from "@/config/site-config";
import axios from "axios";
import { useEffect, useState } from "react";
import io from "socket.io-client";

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
    const [title, setTitle] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);
    const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Socket.io bağlantısını kur
        try {
            const socketInstance = io(`http://${siteConfig.links.python_server}:5000`);
            setSocket(socketInstance);

            console.log(`http://${siteConfig.links.python_server}:5000`);

            socketInstance.on('connect', () => {
                setIsConnected(true);
                console.log('Socket bağlantısı kuruldu');
            });

            socketInstance.on('disconnect', () => {
                setIsConnected(false);
                console.log('Socket bağlantısı kesildi');
            });

            return () => {
                socketInstance.disconnect();
            };
        } catch (error) {
            console.error('Socket bağlantısı kurulamadı:', error);
            setIsConnected(false);
        }
    }, []);

    useEffect(()=>{
        if (note?.pixelMatrix.matrix) {
            setMatrix(note.pixelMatrix.matrix);
            // Matris yüklendiğinde sunucuya gönder
            if (socket && isConnected) {
                socket.emit('init_grid', note.pixelMatrix.matrix);
            }
        }
        setTitle(note?.title || "");
    }, [note, socket, isConnected]);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await axios.get<Note>(`/api/notes/${params.noteId}`);
                setNote(response.data);
            } catch (err) {
                console.error("Not yüklenirken hata:", err);
                setError("Not yüklenirken bir hata oluştu");
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [params.noteId]);

    const handleSave = async () => {
        if (!title.trim()) {
            alert("Lütfen bir başlık girin");
            return;
        }
        
        try {
            setSaving(true);
            await axios.put(`/api/notes/${params.noteId}`, {
                title: title.trim(),
                matrix,
            });
        } catch (err) {
            console.error("Kaydetme hatası:", err);
        } finally {
            setSaving(false);
        };
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/notes/${params.noteId}`);
        } catch (err) {
            console.error("Silme hatası:", err);
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
        <div className="p-4 space-y-4">
            {/* Bağlantı durumu göstergesi */}
            <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
            </div>
            
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                    Title
                </label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Not başlığını girin..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={saving}
                />
            </div>
            
            <Matrix 
                initialData={note.pixelMatrix.matrix}
                editable={true}
                onChange={(newMatrix) => (setMatrix(newMatrix))}
            />
            
            <div className="flex gap-2">
                <Button
                    onClick={handleSave}
                    className="w-1/2"
                    disabled={saving || !title.trim()}
                    >
                    {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                    onClick={handleDelete}
                    className="w-1/2"
                    variant="destructive"
                    disabled={saving}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
};
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Tekil notu getir
export async function GET(
    request: Request,
    { params }: { params: { noteId: string } }
) {
    try {
        const note = await db.notes.findUnique({
            where: {
                id: parseInt(params.noteId)
            },
            include: {
                pixelMatrix: true
            }
        });

        if (!note) {
            return NextResponse.json(
                { error: "Not bulunamadı" },
                { status: 404 }
            );
        }

        return NextResponse.json(note);
    } catch (error) {
        return NextResponse.json(
            { error: "Not getirilirken bir hata oluştu" },
            { status: 500 }
        );
    }
}

// Notu güncelle
export async function PUT(
    request: Request,
    { params }: { params: { noteId: string } }
) {
    try {
        const body = await request.json();
        const { title, matrix } = body;

        // Önce matrisi güncelle
        const note = await db.notes.findUnique({
            where: {
                id: parseInt(params.noteId)
            },
            include: {
                pixelMatrix: true
            }
        });

        if (!note) {
            return NextResponse.json(
                { error: "Not bulunamadı" },
                { status: 404 }
            );
        }

        // Matrisi güncelle
        const test = await db.pixelMatrix.update({
            where: {
                id: note.pixelMatrixId
            },
            data: {
                matrix
            }
        });

        // Notu güncelle
        const updatedNote = await db.notes.update({
            where: {
                id: parseInt(params.noteId)
            },
            data: {
                title
            },
            include: {
                pixelMatrix: true
            }
        });

        return NextResponse.json(updatedNote);
    } catch (error) {
        return NextResponse.json(
            { error: "Not güncellenirken bir hata oluştu" },
            { status: 500 }
        );
    }
}

// Notu sil
export async function DELETE(
    request: Request,
    { params }: { params: { noteId: string } }
) {
    try {
        const note = await db.notes.delete({
            where: {
                id: parseInt(params.noteId)
            }
        });

        return NextResponse.json(note);
    } catch (error) {
        return NextResponse.json(
            { error: "Not silinirken bir hata oluştu" },
            { status: 500 }
        );
    }
} 
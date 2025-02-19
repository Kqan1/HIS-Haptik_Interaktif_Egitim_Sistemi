import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Tüm notları getir
export async function GET() {
    try {
        const notes = await db.notes.findMany({
            include: {
                pixelMatrix: true // Matris verilerini de getir
            }
        });
        
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json(
            { error: "Notlar getirilirken bir hata oluştu" },
            { status: 500 }
        );
    }
}

// Yeni not oluştur
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, matrix } = body;

        // Önce matris verisini kaydet
        const pixelMatrix = await db.pixelMatrix.create({
            data: {
                matrix: matrix
            }
        });

        // Sonra notu oluştur ve matrisle ilişkilendir
        const note = await db.notes.create({
            data: {
                title,
                pixelMatrixId: pixelMatrix.id
            },
            include: {
                pixelMatrix: true
            }
        });

        return NextResponse.json(note);
    } catch (error) {
        return NextResponse.json(
            { error: "Not oluşturulurken bir hata oluştu" },
            { status: 500 }
        );
    }
} 
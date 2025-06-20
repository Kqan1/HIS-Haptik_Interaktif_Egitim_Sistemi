import { CloudUpload } from "lucide-react";

export default function Upload() {
    return (
        <div className="">
            <h1 className="text-center py-4 font-semibold text-3xl">PDF Dosyası Yükle</h1>
            <div className="border border-dashed border-zinc-300 rounded aspect-square gap-4 flex flex-col items-center justify-center hover:bg-zinc-50 transition-colors">
                <CloudUpload size={48} />
                <p>Dosyaları Buraya Sürükle</p>
                <p>Kabul Edilen Dosya Tipleri: PDF</p>
            </div>
        </div>
    );
};
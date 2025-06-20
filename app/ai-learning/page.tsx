"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Matrix from "@/components/ui/matrix";
import { BrainCircuit, Mic, Send } from "lucide-react";
import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";

interface Message {
    id: number;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
    matrix?: number[][];
}

export default function Ai() {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [inputMessage, setInputMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [matrixData, setMatrixData] = React.useState<number[][]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const scrollToBottom = () => {
        const container = document.getElementById("chat-container");
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    const systemPrompt: string = `
    Sen, görme engelliler için tasarlanmış bir yapay zeka öğretmenisin. Amacın, öğrenciye konuyu sesli olarak açıklamak ve ardından bir **18x18 matris** içinde Braille alfabesi kullanarak matematiksel ifadeleri göstermek.
    
    ## **Kurallar:**
    1. **Türkçe konuşmalısın.**
    2. **Yanıtın sadece geçerli bir JSON olmalıdır.** Kesinlikle markdown veya ek açıklamalar içermemelidir.  
    3. **Yanıtın şu yapıda olmalıdır:**  
        - \`message\`: Konunun açıklaması (string).  
        - \`matrix\`: 18x18 boyutunda, sadece 0 ve 1 değerlerinden oluşan bir dizi.  
    4. **Matematiksel ifadeleri Braille formatına uygun üretmelisin.**
        - Braille'de **sayılar doğrudan yazılamaz**, bunun yerine **önce sayı işareti (⠼) ve ardından harf karşılığı (a-j) kullanılır.**
        - Örneğin:
            - "1" → **⠼⠁**
            - "2" → **⠼⠃**
            - "3" → **⠼⠉**
            - "10" → **⠼⠁⠚**
        - İşlem sembolleri:
            - **Toplama (+)** → **⠐⠖**
            - **Çıkarma (-)** → **⠐⠤**
            - **Çarpma (× veya *)** → **⠐⠦**
            - **Bölme (÷ veya /)** → **⠐⠌**
            -**Eşittir (=)** → **⠐⠶**
    5. Matrisi sol üstten sağa sonra aşağı doğru doldur.
    6. **Braille karakterleri satır satır değil, yan yana yazılmalıdır.**  
        - Örneğin, "f(x) = x + 2" ifadesi, matrisin ilk satırına sığacak şekilde **soldan sağa** yazılmalıdır.  
        - Eğer bir satır dolarsa, **bir alt satıra geçerek devam etmelisin.**  


    Yanıtın **kesinlikle şu JSON formatında olmalıdır**:  
    {
        "message": "Metin olarak konuyu açıkla...",
        "matrix": [[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],...]
    }
    
    Markdown, \`content: '... '\` içinde gömülü JSON veya kaçış karakterleri içeren string olmamalıdır. **Sadece saf JSON dönmelisin.**`;
    

    React.useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            content: inputMessage,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        {
                            "role": "system",
                            "content": systemPrompt
                        },                       
                        {
                            role: "user",
                            content: inputMessage,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 7000,
                }),
            });
            
            if (!response.ok) throw new Error("Yanıt alınamadı");
            
            const data = await response.json();
            const aiContent = data.choices[0].message.content;
            
            console.log("data: ", data)
            // Yanıtı JSON olarak parse et
            const parsedResponse = JSON.parse(aiContent);

            console.log("json: ", parsedResponse)

            // Matrix ve mesaj verilerini ayır
            setMatrixData(parsedResponse.matrix);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    content: parsedResponse.message,
                    sender: "ai",
                    timestamp: new Date(),
                    matrix: parsedResponse.matrix,
                },
            ]);

        } catch (err) {
            console.error("API Hatası:", err);
            setError("Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex">
                <div className="flex-1">
                    <div className="flex flex-col h-[90vh]">
                        <Heading 
                            className="py-4"
                            Icon={BrainCircuit}
                            title="AI Öğretmeni"
                            description="Buradan AI Öğretmen ile konuşarak öğrenebilirsin"
                        />
                        <div
                            id="chat-container"
                            className="flex-1 overflow-y-auto p-4 rounded border "
                        >
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-3 my-2 rounded-lg max-w-2xl ${
                                        message.sender === "user"
                                            ? "bg-blue-400 text-white self-end ml-auto"
                                            : "bg-gray-300 text-black self-start"
                                    }`}
                                >
                                    <div>{message.content}</div>
                                    <div className="text-xs text-gray-600 text-right">
                                        {message.timestamp.toLocaleTimeString()}
                                    </div>
                                    {/*message.matrix && (
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="mt-2">Matrisi Göster</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogTitle>Matrisi Göster</DialogTitle>
                                                <DialogDescription>
                                                    <Matrix initialData={message.matrix} editable={false} />
                                                </DialogDescription>
                                                <DialogClose asChild>
                                                    <Button>Kapalı</Button>
                                                </DialogClose>
                                            </DialogContent>
                                        </Dialog>
                                    )*/}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="text-center text-gray-500">AI düşünüyor...</div>
                            )}
                        </div>
                        {error && <div className="text-red-500 text-center p-2">{error}</div>}
                        <div className="py-2 bg-white flex gap-2 border-t">
                            <Input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Mesajınızı yazın..."
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                className="flex-grow"
                            />
                            <Button onClick={handleSendMessage} size="icon">
                                <Send />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { siteConfig } from '@/config/site-config';
import { Eraser, PencilLine, Trash2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

export default function Manual() {
    const [grid, setGrid] = useState<number[][]>([]);
    const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEraseMode, setIsEraseMode] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const lastPos = useRef<{ x: number, y: number } | null>(null);

    console.log(grid)

    // Varsayılan 15x10 matris oluştur (15 sütun, 10 satır)
    const createDefaultGrid = () => {
        return Array(10).fill(null).map(() => Array(15).fill(0));
    };

    useEffect(() => {
        // Başlangıçta varsayılan matrisi göster
        setGrid(createDefaultGrid());

        try {
            const socketInstance = io(`http://${siteConfig.links.python_server}:5000`);
            setSocket(socketInstance);

            console.log(`http://${siteConfig.links.python_server}:5000`)

            socketInstance.on('connect', () => {
                setIsConnected(true);
                console.log('Socket bağlantısı kuruldu');
            });

            socketInstance.on('disconnect', () => {
                setIsConnected(false);
                console.log('Socket bağlantısı kesildi');
            });

            socketInstance.on('init_grid', (initialGrid: number[][]) => {
                setGrid(initialGrid);
            });

            socketInstance.on('pixel_changed', (data: { x: number, y: number, value: number }) => {
                setGrid((prevGrid: number[][]) => {
                    const newGrid = [...prevGrid];
                    newGrid[data.y][data.x] = data.value;
                    return newGrid;
                });
            });

            return () => {
                socketInstance.disconnect();
            };
        } catch (error) {
            console.error('Socket bağlantısı kurulamadı:', error);
            setIsConnected(false);
        }
    }, []);

    const handlePixelChange = (x: number, y: number) => {
        const newValue = isEraseMode ? 0 : 1;
        
        // Yerel matrisi güncelle
        setGrid((prevGrid: number[][]) => {
            const newGrid = [...prevGrid];
            newGrid[y][x] = newValue;
            return newGrid;
        });

        // Socket bağlantısı varsa sunucuya gönder
        if (socket && isConnected) {
            socket.emit('pixel_update', { x, y, value: newValue });
        }
    };

    // Bresenham Çizgi Algoritması
    const drawLine = (x0: number, y0: number, x1: number, y1: number) => {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            handlePixelChange(x0, y0);

            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    };

    const handleMouseDown = (x: number, y: number) => {
        setIsDrawing(true);
        handlePixelChange(x, y);
        lastPos.current = { x, y };
    };

    const handleMouseEnter = (x: number, y: number) => {
        if (isDrawing && lastPos.current) {
            drawLine(lastPos.current.x, lastPos.current.y, x, y);
            lastPos.current = { x, y };
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        lastPos.current = null;
    };

    const handleReset = () => {
        // Yerel matrisi sıfırla
        setGrid(createDefaultGrid());
        
        // Socket bağlantısı varsa sunucuya gönder
        if (socket && isConnected) {
            socket.emit('reset_grid');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2 manual"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDragStart={(e) => e.preventDefault()}
            draggable={false}>
            
            {/* Bağlantı durumu göstergesi */}
            <div className="fixed top-4 right-4 flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium">
                    {isConnected ? 'Bağlı' : 'Bağlantı Yok'}
                </span>
            </div>
            
            <ToggleGroup type="single" className="p-1 border rounded space-x-1 flex justify-between bg-white w-11/12 bottom-16" variant="outline">
                <div className="space-x-2">
                    <ToggleGroupItem 
                        value="draw"
                        onClick={() => setIsEraseMode(false)}
                    >
                        <PencilLine />
                        <p>Pen</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                        value="erase"
                        onClick={() => setIsEraseMode(true)}
                    >
                        <Eraser />
                        <p>Eraser</p>
                    </ToggleGroupItem>
                </div>
                <div className="flex items-center space-x-2">
                    <Separator orientation="vertical" className="h-8" />
                    <Button
                        variant="destructive"
                        value="reset"
                        onClick={handleReset}
                    >
                        <Trash2 />
                        <p>Reset</p>
                    </Button>
                </div>
            </ToggleGroup>
            <div className="grid grid-cols-[repeat(15,auto)] gap-0 select-none">
                {grid.map((row: number[], y: number) => (
                    row.map((cell: number, x: number) => (
                        <div
                            key={`${x}-${y}`}
                            className={`size-6 border border-gray-200 cursor-pointer ${
                                cell === 1 ? 'bg-black' : 'bg-white'
                            }`}
                            onMouseDown={() => handleMouseDown(x, y)}
                            onMouseEnter={() => handleMouseEnter(x, y)}
                            draggable={false}
                        />
                    ))
                ))}
            </div>
        </div>
    );
} 
'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Eraser, PencilLine, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface MatrixProps {
    initialData?: number[][];
    editable?: boolean;
    onChange?: (matrix: number[][]) => void;
    disabled?: boolean;
}

const GRID_SIZE = 15; // Yatay grid boyutu
const GRID_HEIGHT = 10; // Dikey grid boyutu

export default function Matrix({ 
    initialData,
    editable = true,
    onChange,
    disabled=false,
}: MatrixProps) {
    const [grid, setGrid] = useState<number[][]>([]);

    useEffect(() => {
        if (Array.isArray(initialData)) {
            // Gelen veriyi 15x10'a tamamla
            const newGrid = Array(GRID_HEIGHT).fill(null).map((_, y) => 
                Array(GRID_SIZE).fill(0).map((_, x) => 
                    initialData[y]?.[x] ?? 0
                )
            );
            setGrid(newGrid);
        } else {
            // Varsayılan 15x10 grid oluştur
            setGrid(Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_SIZE).fill(0)));
        }
    }, [initialData]);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isEraseMode, setIsEraseMode] = useState(false);
    const lastPos = useRef<{ x: number, y: number } | null>(null);

    const handlePixelChange = (x: number, y: number) => {
        const newValue = isEraseMode ? 0 : 1;
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            newGrid[y][x] = newValue;
            onChange?.(newGrid);
            return newGrid;
        });
    };

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
        if (!editable) return;
        setIsDrawing(true);
        handlePixelChange(x, y);
        lastPos.current = { x, y };
    };

    const handleMouseEnter = (x: number, y: number) => {
        if (!editable) return;
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
        const newGrid = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_SIZE).fill(0));
        setGrid(newGrid);
        onChange?.(newGrid);
    };



    // Grid boşsa veya geçersizse bir loading göster
    if (!Array.isArray(grid) || grid.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDragStart={(e) => e.preventDefault()}
            draggable={false}>
            <div className="border p-4 space-y-2 rounded">
                {editable && (
                    <ToggleGroup type="single" className="p-1 border rounded space-x-1" variant="outline">
                        <ToggleGroupItem 
                            value="draw"
                            onClick={() => setIsEraseMode(false)}
                            disabled={disabled}
                        >
                            <PencilLine />
                            Pen
                            <p className="sr-only">Çizme Düğmesi</p>
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                            value="erase"
                            onClick={() => setIsEraseMode(true)}
                            disabled={disabled}
                        >
                            <Eraser />
                            Eraser
                            <p className="sr-only">Silme Düğmesi</p>
                        </ToggleGroupItem>
                        <Separator orientation="vertical" className="h-8" />
                        <Button
                            variant="destructive"
                            value="reset"
                            onClick={handleReset}
                            disabled={disabled}
                        >
                            <Trash2 />
                            Delete
                        </Button>
                    </ToggleGroup>
                    
                )}
                <div className={`grid gap-0 select-none`} style={{ 
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
                }}>
                    {grid.map((row: number[], y: number) => (
                        row.map((cell: number, x: number) => (
                            <div
                                key={`${x}-${y}`}
                                className={`size-6 border border-gray-200 ${
                                    editable ? 'cursor-pointer' : ''
                                } ${
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
        </div>
    );
}


/*
'use client';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState, useRef, useEffect } from 'react';

interface MatrixProps {
    initialData?: number[][];
    editable?: boolean;
    onChange?: (matrix: number[][]) => void;
}

const GRID_SIZE = 32; // Sabit grid boyutu

export default function Matrix({ 
    initialData,
    editable = true,
    onChange,
}: MatrixProps) {
    const [grid, setGrid] = useState<number[][]>([]);

    useEffect(() => {
        if (Array.isArray(initialData)) {
            // Gelen veriyi 32x32'ye tamamla
            const newGrid = Array(GRID_SIZE).fill(null).map((_, y) => 
                Array(GRID_SIZE).fill(0).map((_, x) => 
                    initialData[y]?.[x] ?? 0
                )
            );
            setGrid(newGrid);
        } else {
            // Varsayılan 32x32 grid oluştur
            setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0)));
        }
    }, [initialData]);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isEraseMode, setIsEraseMode] = useState(false);
    const lastPos = useRef<{ x: number, y: number } | null>(null);

    const handlePixelChange = (x: number, y: number) => {
        const newValue = isEraseMode ? 0 : 1;
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            newGrid[y][x] = newValue;
            onChange?.(newGrid);
            return newGrid;
        });
    };

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
        if (!editable) return;
        setIsDrawing(true);
        handlePixelChange(x, y);
        lastPos.current = { x, y };
    };

    const handleMouseEnter = (x: number, y: number) => {
        if (!editable) return;
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
        const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
        setGrid(newGrid);
        onChange?.(newGrid);
    };

    // Grid boşsa veya geçersizse bir loading göster
    if (!Array.isArray(grid) || grid.length === 0) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDragStart={(e) => e.preventDefault()}
            draggable={false}>
            <div className="border p-4">
                {editable && (
                    <ToggleGroup type="single">
                        <ToggleGroupItem value="a">A</ToggleGroupItem>
                        <ToggleGroupItem value="b">B</ToggleGroupItem>
                        <ToggleGroupItem value="c">C</ToggleGroupItem>
                    </ToggleGroup>
                    // TODO: YAP ACİL
                    <div className="flex gap-2 mb-4">
                        <button 
                            onClick={() => setIsEraseMode(false)}
                            className={`flex-1 py-2 px-4 rounded ${
                                !isEraseMode 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Çiz
                        </button>
                        <button 
                            onClick={() => setIsEraseMode(true)}
                            className={`flex-1 py-2 px-4 rounded ${
                                isEraseMode 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            Sil
                        </button>
                    </div>
                )}
                <div className={`grid gap-0 select-none`} style={{ 
                    gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
                }}>
                    {grid.map((row: number[], y: number) => (
                        row.map((cell: number, x: number) => (
                            <div
                                key={`${x}-${y}`}
                                className={`w-4 h-4 border border-gray-200 ${
                                    editable ? 'cursor-pointer' : ''
                                } ${
                                    cell === 1 ? 'bg-black' : 'bg-white'
                                }`}
                                onMouseDown={() => handleMouseDown(x, y)}
                                onMouseEnter={() => handleMouseEnter(x, y)}
                                draggable={false}
                            />
                        ))
                    ))}
                </div>
                {editable && (
                    <button 
                        onClick={handleReset}
                        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Sıfırla
                    </button>
                )}
            </div>
        </div>
    );
}

*/
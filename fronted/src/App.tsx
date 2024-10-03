import './App.css'
import {useEffect, useRef, useState} from "react";
import {Draw, WsDraw} from "./types.ts";


const App = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ws = useRef<WebSocket | null>(null);
    const [moving,setMoving] = useState<boolean>(false);
    const [draw,setDraw] = useState<Draw[]>([]);
    const [pixels, setPixels] = useState<{ x: number; y: number }[]>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8040/drawing-board');
        if ("onclose" in ws.current) {
            ws.current.onclose = () => console.log("ws closed");
        }
        if ("onmessage" in ws.current) {
            ws.current.onmessage = event => {
                const decodedDraw = JSON.parse(event.data) as WsDraw;

                if (decodedDraw.type === 'NEW_DRAW') {
                    setDraw((draw) => [...draw, decodedDraw.payload]);
                }
            };
        }

        return () => {
            if (ws.current) {
                if ("close" in ws.current) {
                    ws.current.close();
                }
            }
        }

    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && draw.length > 0) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const Pixels = draw.flat();
                Pixels.forEach(pixel => {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(pixel.x, pixel.y, 2, 2);
                });
            }
        }
    }, [draw]);


    const startMove = () => setMoving(true);
    const endMove = () => {
        if (pixels.length > 0) {
            setMoving(false)
            if ("send" in ws.current) {
                ws.current.send(JSON.stringify({
                    type: 'SET_DRAW',
                    payload:pixels,
                }));
            }
            setPixels([]);
        }
    }


    const drawing = (event) => {
        if (!moving) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, 2, 2);
        setPixels(prev => [...prev, { x, y }]);
    };


    return(
        <>
            <h1 className="mb-5">Drawing board</h1>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseMove={drawing}
                onMouseDown={startMove}
                onMouseUp={endMove}
                style={{border: '1px solid black'}}
            />
        </>
    )
}

export default App

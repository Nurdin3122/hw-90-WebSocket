import './App.css'
import {useEffect, useRef, useState} from "react";
import {Draw, WsDraw} from "./types.ts";

const App = () => {
    const canvasRef = useRef(null);
    const ws = useRef<WebSocket | null>(null);
    const [draw,setDraw] = useState<Draw[]>([])

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8003/drawing-board');
        if ("onclose" in ws.current) {
            ws.current.onclose = () => console.log("ws closed");
        }
        if ("onmessage" in ws.current) {
            ws.current.onmessage = event => {
                const decodedMessage = JSON.parse(event.data) as WsDraw;
                if (decodedMessage.type === 'NEW_DRAW') {
                    setDraw((draw) => [...draw, decodedMessage.payload]);
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


    const drawing = (event) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, 2, 2);
    };


    return(
        <>
            <h1 className="mb-5">Drawing board</h1>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseMove={drawing}
                style={{border: '1px solid black'}}
            />
        </>
    )
}

export default App

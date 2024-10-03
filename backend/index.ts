import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {WebSocket} from "ws";
import { incomingDraw } from "./types.D";


const app = express();
expressWs(app);
const port = 8003;
app.use(cors());
const router = express.Router();

const connectedClient :WebSocket[]= [];
let draw:[] = [];

router.ws('/drawing-board', (ws, req) => {
    console.log('client connected');
    connectedClient.push(ws);

    ws.on("message",(message) => {
        const decodedDraw = JSON.parse(message.toString()) as incomingDraw;
    })





    ws.on('close', () => {
        console.log('client disconnected!');
    });
});



app.use(router);



app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});


import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {WebSocket} from "ws";
import { incomingDraw } from "./types.D";



const app = express();
expressWs(app);
const port = 8040;
app.use(cors());
const router = express.Router();

const connectedClient :WebSocket[]= [];

router.ws('/drawing-board', (ws, req) => {
    console.log('client connected');
    connectedClient.push(ws);

    ws.on("message",(message) => {
        const decodedDraw = JSON.parse(message.toString()) as incomingDraw;
        console.log(decodedDraw)
       if (decodedDraw.type === "SET_DRAW") {
           connectedClient.forEach(client => {
               client.send(JSON.stringify({
                   type:"NEW_DRAW",
                   payload:decodedDraw.payload
               }));
           })
       }
    })


    ws.on('close', () => {
        console.log('client disconnected!');
    });
});



app.use(router);



app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});


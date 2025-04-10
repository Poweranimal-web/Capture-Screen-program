import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';
import path from 'path';
const app = express();
const serverHttp = http.createServer(app);
const server = new WebSocketServer({ 
  port: 8080 
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});
export default function runServer(){
    server.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('message', (pngBuffer : Buffer) => {
            server.clients.forEach(async (client) => {
                if (client != socket){
                    if (client.readyState === 1) {
                        await client.send(pngBuffer);
                    }
                }
            });
        });
    
        socket.on('close', () => {
            console.log('Client disconnected');
        });
    });
    console.log('WebSocket server is running on ws://localhost:8080');
}
serverHttp.listen(8081, () => {
    console.log('🚀 Server running: http://localhost:8081');
  });

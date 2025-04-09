import { WebSocketServer } from 'ws';
import saveToPNG from "./pngconverter";

const server = new WebSocketServer({ 
  port: 8080 
});
export default function runServer(){
    server.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('message', (frame : Buffer) => {
            saveToPNG(frame,1280, 960,"./screeen.png");
        });
    
        socket.on('close', () => {
            console.log('Client disconnected');
        });
    });
    console.log('WebSocket server is running on ws://localhost:8080');
}

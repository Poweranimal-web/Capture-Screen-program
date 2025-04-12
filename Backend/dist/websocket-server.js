"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runServer;
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const serverHttp = http_1.default.createServer(app);
const server = new ws_1.WebSocketServer({
    server: serverHttp,
    path: '/ws'
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../index.html'));
});
function runServer() {
    server.on('connection', (socket) => {
        console.log('Client connected');
        let latestFrame = null;
        let isSending = false;
        socket.on('message', (data) => {
            //  Always keep only the latest frame
            latestFrame = data;
            if (!isSending) {
                isSending = true;
                sendLoop();
            }
        });
        function sendLoop() {
            // Nothing to send? Done.
            if (!latestFrame) {
                isSending = false;
                return;
            }
            const frame = latestFrame;
            latestFrame = null;
            for (const client of server.clients) {
                if (client.readyState === client.OPEN && client !== socket) {
                    const buf = client._socket?.bufferSize ?? 0;
                    if (buf > 512000) {
                        console.warn('Dropping frame: client too slow');
                        continue;
                    }
                    const start = Date.now();
                    client.send(frame, () => {
                        const end = Date.now();
                        console.log(`Send duration: ${end - start}ms, Frame size: ${frame.length} bytes`);
                    });
                }
            }
            // Immediately schedule next loop to check for new frame
            setImmediate(sendLoop);
        }
        socket.on('close', () => {
            console.log('Client disconnected');
        });
        socket.on('error', (err) => {
            console.error('WebSocket error:', err);
        });
    });
}
serverHttp.listen(8081, () => {
    console.log('🚀 Server running: http://localhost:8081');
});

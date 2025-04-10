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
        let isProcessing = false;
        socket.on('message', (data) => {
            // Always replace the previous frame with the newest one
            latestFrame = data;
            // Start processing if not already
            if (!isProcessing) {
                isProcessing = true;
                processNextFrame();
            }
        });
        function processNextFrame() {
            if (!latestFrame) {
                isProcessing = false;
                return;
            }
            const frame = latestFrame;
            latestFrame = null;
            // Broadcast the latest frame to other clients
            for (const client of server.clients) {
                if (client !== socket && client.readyState === client.OPEN) {
                    client.send(frame);
                }
            }
            // Continue processing as soon as possible
            setImmediate(processNextFrame);
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

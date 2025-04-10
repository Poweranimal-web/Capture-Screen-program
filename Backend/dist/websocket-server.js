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
    port: 8080
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../index.html'));
});
function runServer() {
    server.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('message', (pngBuffer) => {
            server.clients.forEach(async (client) => {
                if (client != socket) {
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

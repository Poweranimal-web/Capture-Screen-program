"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runServer;
const ws_1 = require("ws");
const pngconverter_1 = __importDefault(require("./pngconverter"));
const server = new ws_1.WebSocketServer({
    port: 8080
});
function runServer() {
    server.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('message', (frame) => {
            (0, pngconverter_1.default)(frame, 1280, 960, "./screeen.png");
        });
        socket.on('close', () => {
            console.log('Client disconnected');
        });
    });
    console.log('WebSocket server is running on ws://localhost:8080');
}

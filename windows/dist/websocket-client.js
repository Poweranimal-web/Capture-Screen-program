"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runClient = runClient;
exports.SendData = SendData;
const ws_1 = __importDefault(require("ws"));
let client;
let isReady = false;
const MAX_BUFFERED_BYTES = 512 * 1024; // 512 KB
function runClient() {
    client = new ws_1.default('wss://goods-centuries-privacy-class.trycloudflare.com/ws'); // Your host IP
    client.on('open', () => {
        console.log('Node.js app connected');
        isReady = true;
    });
    client.on('message', (msg) => {
        console.log('Received from server:', msg.toString());
    });
    client.on('close', () => {
        console.log('WebSocket disconnected');
        isReady = false;
    });
    client.on('error', (err) => {
        console.log('WebSocket error:', err);
    });
}
function SendData(data) {
    const rawSocket = client._socket;
    if (client.readyState === ws_1.default.OPEN &&
        rawSocket &&
        rawSocket.bufferSize < MAX_BUFFERED_BYTES) {
        client.send(data);
    }
    else {
        console.warn("Skipping frame: socket not ready or buffer full");
    }
}

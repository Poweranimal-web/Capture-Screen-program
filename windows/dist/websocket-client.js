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
function runClient() {
    client = new ws_1.default('ws://192.168.50.37:8080'); // Your host IP
    client.on('open', () => {
        console.log('WebSocket connected');
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
        console.error('WebSocket error:', err);
    });
}
function SendData(data) {
    if (isReady && client?.readyState === ws_1.default.OPEN) {
        client.send(data);
    }
    else {
        console.warn('Cannot send: WebSocket not open');
    }
}

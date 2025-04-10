import { WebSocketServer } from 'ws';
import express from 'express';
import http from 'http';
import path from 'path';

const app = express();
const serverHttp = http.createServer(app);
const server = new WebSocketServer({ 
  server: serverHttp,
  path: '/ws'
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

export default function runServer() {
  server.on('connection', (socket) => {
    console.log('Client connected');

    let latestFrame: Buffer | null = null;
    let isProcessing : Boolean = false;

    socket.on('message', (data: Buffer) => {
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


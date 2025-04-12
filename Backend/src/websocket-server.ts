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
    let isSending = false;

    socket.on('message', (data: Buffer) => {
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
          const buf = (client as any)._socket?.bufferSize ?? 0;
          if (buf > 512_000) {
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


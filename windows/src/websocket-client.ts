import WebSocket from 'ws';
let client: WebSocket;
let isReady = false;
const MAX_BUFFERED_BYTES = 512 * 1024; // 512 KB

export function runClient(): void {
  client = new WebSocket('wss://goods-centuries-privacy-class.trycloudflare.com/ws'); // Your host IP

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


export function SendData(data: Buffer): void {
  const rawSocket = (client as any)._socket;
  if (
    client.readyState === WebSocket.OPEN &&
    rawSocket &&
    rawSocket.bufferSize < MAX_BUFFERED_BYTES
  ) {
    client.send(data);
  } else {
    console.warn("Skipping frame: socket not ready or buffer full");
  }
}

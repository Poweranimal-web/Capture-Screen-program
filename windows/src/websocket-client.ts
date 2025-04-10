import WebSocket from 'ws';

let client: WebSocket;
let isReady = false;

export function runClient(): void {
  client = new WebSocket('wss://burden-hot-counted-quotes.trycloudflare.com/ws'); // Your host IP

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

export function SendData(data: Buffer) {
  if (isReady && client?.readyState === WebSocket.OPEN) {
    client.send(data);
  } else {
    console.warn('Cannot send: WebSocket not open');
  }
}
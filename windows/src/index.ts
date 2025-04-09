import path from 'path';
import * as clientWebsocket from "./websocket-client"
const addon = require(path.join(__dirname, './addon/build/Release/screen_capture.node')) as {
  captureScreen: () => {
    width: number;
    height: number;
    data: Buffer;
  };
};
clientWebsocket.runClient();
setTimeout(() => {
  while(true){
    const frame = addon.captureScreen();
    clientWebsocket.SendData(frame.data);
  }
}, 1000); 

// saveToPNG(frame.data,frame.width,frame.height, "./screeen.png");
// console.log('First 16 bytes of frame:', frame.data.subarray(0, 16));
// console.log(`Captured ${frame.width}x${frame.height}, size: ${frame.data.length} bytes`);
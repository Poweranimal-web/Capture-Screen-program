import path from 'path';
import * as clientWebsocket from "./websocket-client"
import saveToPNGBuffer from './pngconverter';
const addon = require(path.join(__dirname, './addon/build/Release/screen_capture.node')) as {
  captureScreen: () => {
    width: number;
    height: number;
    data: Buffer;
  };
};
clientWebsocket.runClient();
setTimeout(async () => {
  while(true){
    const frame = addon.captureScreen();
    let pngBuffer : Buffer = await saveToPNGBuffer(frame.data, 1280, 960);     
    clientWebsocket.SendData(pngBuffer);
  }
}, 2000); 

// saveToPNG(frame.data,frame.width,frame.height, "./screeen.png");
// console.log('First 16 bytes of frame:', frame.data.subarray(0, 16));
// console.log(`Captured ${frame.width}x${frame.height}, size: ${frame.data.length} bytes`);
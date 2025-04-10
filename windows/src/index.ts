import path from 'path';
import * as clientWebsocket from "./websocket-client"
import saveToPNGBuffer from './pngconverter';
import { deflateSync, inflateSync } from 'zlib';
const addon = require(path.join(__dirname, './addon/build/Release/screen_capture.node')) as {
  captureScreen: () => {
    width: number;
    height: number;
    data: Buffer;
  };
};
clientWebsocket.runClient();

const translate_screen = async() =>{
    const frame = addon.captureScreen();
    let pngBuffer : Buffer = await saveToPNGBuffer(frame.data, 1280, 960);
    let compressedBuffer : Buffer = deflateSync(pngBuffer);     
    clientWebsocket.SendData(compressedBuffer);
}
setInterval(() => translate_screen(), 100);

// saveToPNG(frame.data,frame.width,frame.height, "./screeen.png");
// console.log('First 16 bytes of frame:', frame.data.subarray(0, 16));
// console.log(`Captured ${frame.width}x${frame.height}, size: ${frame.data.length} bytes`);
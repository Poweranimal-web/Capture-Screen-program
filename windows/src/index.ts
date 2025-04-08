import path from 'path';
import saveToPNG from "./pngconverter"
const addon = require(path.join(__dirname, './addon/build/Release/screen_capture.node')) as {
  captureScreen: () => {
    width: number;
    height: number;
    data: Buffer;
  };
};
const frame = addon.captureScreen();
saveToPNG(frame.data,frame.width,frame.height, "./screeen.png");
console.log('First 16 bytes of frame:', frame.data.subarray(0, 16));
console.log(`Captured ${frame.width}x${frame.height}, size: ${frame.data.length} bytes`);
import path from 'path';

const addon = require(path.join(__dirname, './addon/build/Release/screen_capture.node')) as {
  captureScreen: () => {
    width: number;
    height: number;
    data: Buffer;
  };
};
const frame = addon.captureScreen();
console.log(`Captured ${frame.width}x${frame.height}, size: ${frame.data.length} bytes`);
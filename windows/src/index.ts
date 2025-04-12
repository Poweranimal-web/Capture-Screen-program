import path from 'path';
import * as clientWebsocket from "./websocket-client"
import saveToJPEGBuffer from './pngconverter';
const addon = require(path.join(__dirname, './addon/build/Release/screen_capture.node')) as {
  captureScreen: () => {
    width: number;
    height: number;
    data: Buffer;
  };
};
clientWebsocket.runClient();
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
async function share_screen() {
  for (;;) {
    const frame = addon.captureScreen();
    const Buffer = await saveToJPEGBuffer(frame.data,frame.width,frame.height);
    clientWebsocket.SendData(Buffer);
    await new Promise(resolve => setTimeout(resolve, FRAME_INTERVAL));
  }
}
share_screen();
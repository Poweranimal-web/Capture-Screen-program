import captureScreen from "./capture-wrapper";
// import {printGav} from "./library";
// export {printGav}
// let text : string = "hello World";
// console.log(text);
// let text2 : string = printGav();
// console.log(text2);
const frame = captureScreen();
console.log(`Captured ${frame.width}x${frame.height}, size: ${frame.data.length} bytes`);
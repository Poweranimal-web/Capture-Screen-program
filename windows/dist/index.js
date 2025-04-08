"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const pngconverter_1 = __importDefault(require("./pngconverter"));
const addon = require(path_1.default.join(__dirname, './addon/build/Release/screen_capture.node'));
const frame = addon.captureScreen();
(0, pngconverter_1.default)(frame.data, frame.width, frame.height, "./screeen.png");
console.log('First 16 bytes of frame:', frame.data.subarray(0, 16));
console.log(`Captured ${frame.width}x${frame.height}, size: ${frame.data.length} bytes`);

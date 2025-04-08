"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const addon = require(path_1.default.join(__dirname, './addon/build/Release/screen_capture.node'));
const frame = addon.captureScreen();
console.log(`Captured ${frame.width}x${frame.height}, size: ${frame.data.length} bytes`);

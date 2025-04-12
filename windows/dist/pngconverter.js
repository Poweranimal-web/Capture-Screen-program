"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = saveToPNGBuffer;
const sharp_1 = __importDefault(require("sharp"));
async function saveToPNGBuffer(buffer, width, height) {
    return (0, sharp_1.default)(buffer, {
        raw: { width, height, channels: 4 },
    }).resize(960).jpeg({ quality: 25, }).toBuffer();
}

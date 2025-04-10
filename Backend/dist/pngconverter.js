"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = saveToPNGBuffer;
const sharp_1 = __importDefault(require("sharp"));
function convertBGRAtoRGBA(bgra) {
    const rgba = Buffer.alloc(bgra.length);
    for (let i = 0; i < bgra.length; i += 4) {
        rgba[i] = bgra[i + 2]; // R
        rgba[i + 1] = bgra[i + 1]; // G
        rgba[i + 2] = bgra[i]; // B
        rgba[i + 3] = bgra[i + 3]; // A
    }
    return rgba;
}
async function saveToPNGBuffer(buffer, width, height) {
    let rgba = convertBGRAtoRGBA(buffer);
    return await (0, sharp_1.default)(rgba, {
        raw: { width, height, channels: 4 },
    }).png().toBuffer();
}

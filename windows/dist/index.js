"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printGav = void 0;
const library_1 = require("./library");
Object.defineProperty(exports, "printGav", { enumerable: true, get: function () { return library_1.printGav; } });
let text = "hello World";
console.log(text);
let text2 = (0, library_1.printGav)();
console.log(text2);

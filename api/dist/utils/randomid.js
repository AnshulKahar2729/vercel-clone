"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomId = void 0;
const randomId = (MAX_LENGTH) => {
    const letters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let id = '';
    for (let i = 0; i < MAX_LENGTH; i++) {
        id += letters[Math.floor(Math.random() * letters.length)];
    }
    return id;
};
exports.randomId = randomId;

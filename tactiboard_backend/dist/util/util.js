"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJaDateString = void 0;
const getJaDateString = () => {
    var _a, _b, _c, _d, _e, _f;
    const date = new Date();
    // 日本時間に変換
    const options = {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    const formatter = new Intl.DateTimeFormat('ja-JP', options);
    const parts = formatter.formatToParts(date);
    const year = (_a = parts.find(part => part.type === 'year')) === null || _a === void 0 ? void 0 : _a.value;
    const month = (_b = parts.find(part => part.type === 'month')) === null || _b === void 0 ? void 0 : _b.value;
    const day = (_c = parts.find(part => part.type === 'day')) === null || _c === void 0 ? void 0 : _c.value;
    const hour = (_d = parts.find(part => part.type === 'hour')) === null || _d === void 0 ? void 0 : _d.value;
    const minute = (_e = parts.find(part => part.type === 'minute')) === null || _e === void 0 ? void 0 : _e.value;
    const second = (_f = parts.find(part => part.type === 'second')) === null || _f === void 0 ? void 0 : _f.value;
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
exports.getJaDateString = getJaDateString;

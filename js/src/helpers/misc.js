"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = void 0;
const response = (res, data) => {
    data.status =
        data.status == undefined || data.status == null ? 500 : data.status;
    res.status(data.status).json(data);
    return;
};
exports.response = response;

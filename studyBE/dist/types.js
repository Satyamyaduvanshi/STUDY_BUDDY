"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateType = exports.signinType = exports.signupType = void 0;
const zod_1 = require("zod");
exports.signupType = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.signinType = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.updateType = zod_1.z.object({
    name: zod_1.z.string()
});

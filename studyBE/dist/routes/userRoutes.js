"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controller/UserController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userRouter = (0, express_1.Router)();
userRouter.post("/signup", UserController_1.signup);
userRouter.post("/signin", UserController_1.signin);
userRouter.get("/profile", authMiddleware_1.default, UserController_1.profile);
userRouter.delete("/deleteUser", authMiddleware_1.default, UserController_1.deleteUser);
exports.default = userRouter;

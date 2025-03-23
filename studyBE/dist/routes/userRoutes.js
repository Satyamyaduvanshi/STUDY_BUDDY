"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controller/UserController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userRoutes = (0, express_1.Router)();
userRoutes.post("/signup", UserController_1.signup);
userRoutes.post("/signin", UserController_1.signin);
userRoutes.get("/profile", authMiddleware_1.default, UserController_1.profile);
userRoutes.delete("/deleteuser", authMiddleware_1.default, UserController_1.deleteUser);
userRoutes.put("/updateuser", authMiddleware_1.default, UserController_1.updateUser);
exports.default = userRoutes;

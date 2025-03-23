"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt_secret = process.env.JWT_SECRET || "";
function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Unauthorized: No token provided"
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decode = jsonwebtoken_1.default.verify(token, jwt_secret);
        if (!decode || typeof decode !== "object" || !decode.id) {
            res.status(403).json({
                message: "Unauthorized: Invalid token"
            });
            return;
        }
        req.id = decode.id;
        next();
    }
    catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        return;
    }
}
exports.default = auth;

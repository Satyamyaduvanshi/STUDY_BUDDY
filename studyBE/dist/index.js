"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const types_1 = require("./types");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const authMiddleware_1 = __importDefault(require("./authMiddleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret) {
    throw new Error("missing jwt_secret");
}
app.use(express_1.default.json());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.signupType.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "validation failed put correct input"
        });
        return;
    }
    try {
        const hashPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        yield client.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword
            }
        });
        res.status(201).json({
            message: "signup successful"
        });
        return;
    }
    catch (e) {
        console.error("sis jwt payloadignup ERROR:", e);
        res.status(500).json({
            message: "error while signup"
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.signinType.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "validation failed"
        });
    }
    try {
        const user = yield client.user.findFirst({
            where: {
                email: req.body.email
            },
            select: {
                password: true,
                id: true
            }
        });
        if (!user) {
            res.status(404).json({
                message: "user not found"
            });
        }
        const match = bcrypt_1.default.compare(req.body.password, user === null || user === void 0 ? void 0 : user.password);
        if (!match) {
            res.status(401).json({
                message: "wrong password"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            id: user === null || user === void 0 ? void 0 : user.id
        }, jwt_secret);
        res.status(200).json({ token });
        return;
    }
    catch (e) {
        console.error("Signin error: ", e);
        res.status(500).json({
            message: "something goes wrong in signin"
        });
    }
}));
app.get("/profile", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client.user.findFirst({
            where: {
                id: req.id
            },
            select: {
                name: true,
                email: true,
            }
        });
        if (!user) {
            console.log("hello reached 1");
            res.status(404).json({
                message: "user not found"
            });
            return;
        }
        console.log("reached 2");
        res.status(200).json(user);
    }
    catch (e) {
        console.error("profile error: ", e);
        res.status(500).json({
            message: "error connecting to DB"
        });
        return;
    }
}));
app.listen(3000);

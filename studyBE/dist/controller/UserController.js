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
exports.updateUser = exports.profile = exports.deleteUser = exports.signin = exports.signup = void 0;
const client_1 = require("@prisma/client");
const types_1 = require("../types");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret) {
    throw new Error(" jwt not found");
}
const client = new client_1.PrismaClient();
//* signup 
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.signupType.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "validation falied"
        });
        return;
    }
    const { name, email, password } = req.body;
    try {
        const exitsUser = yield client.user.findUnique({
            where: {
                email: email
            }
        });
        if (exitsUser) {
            res.status(403).json({
                message: "user already exist"
            });
            return;
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        yield client.user.create({
            data: {
                name,
                email,
                password: hashPassword
            }
        });
        res.status(200).json({
            message: "user created successfully"
        });
        return;
    }
    catch (e) {
        console.error("signup error: ", e);
        res.status(500).json({
            message: "db error"
        });
        return;
    }
});
exports.signup = signup;
//* signin
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.signinType.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "validation falied"
        });
        return;
    }
    const { email, password } = req.body;
    try {
        const response = yield client.user.findUnique({
            where: {
                email: email
            },
            select: {
                password: true,
                id: true
            }
        });
        if (!response) {
            res.status(403).json({
                message: "user not found"
            });
            return;
        }
        const match = yield bcrypt_1.default.compare(password, response.password);
        if (!match) {
            res.status(401).json({
                message: "incorrect password"
            });
            return;
        }
        const token = yield jsonwebtoken_1.default.sign({
            id: response.id
        }, jwt_secret);
        res.status(200).json({
            authorization: `Bearer ${token}`,
        });
    }
    catch (e) {
        console.error("signin error: ", e);
        res.status(500).json({
            message: "error in db"
        });
        return;
    }
});
exports.signin = signin;
//* delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.user.delete({
            where: {
                id: req.id
            }
        });
        if (!response) {
            res.status(404).json({
                message: "user not found"
            });
            return;
        }
        res.status(200).json({
            message: "user deleted successfull"
        });
    }
    catch (e) {
        console.error("delete user error: ", e);
        res.status(500).json({
            message: "error in db"
        });
        return;
    }
});
exports.deleteUser = deleteUser;
//* show user its profile
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.id);
        const response = yield client.user.findFirst({
            where: {
                id: req.id
            }, select: {
                name: true,
                email: true
            }
        });
        if (!response) {
            res.status(404).json({
                message: "user not found"
            });
            return;
        }
        console.log(response);
        res.status(200).json({
            user: response
        });
    }
    catch (e) {
        console.error("profile error: ", e);
        res.status(500).json({
            message: "error connectin to db"
        });
        return;
    }
});
exports.profile = profile;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = types_1.updateType.safeParse(req.body);
    const { name } = req.body;
    try {
        const response = yield client.user.update({
            where: {
                id: req.id
            }, data: {
                name: name
            }
        });
        res.status(200).json({
            message: `name successfully changes to ${name}`
        });
    }
    catch (e) {
        console.error("update user error: ", e);
        res.status(500).json({
            message: "error in DB"
        });
        return;
    }
});
exports.updateUser = updateUser;

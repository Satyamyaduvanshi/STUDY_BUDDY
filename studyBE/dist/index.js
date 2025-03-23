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
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const RoomController_1 = require("./controller/RoomController");
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const client = new client_1.PrismaClient();
//  Enable CORS for frontend (React on port 5173)
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allows cookies/auth if needed
}));
app.use(express_1.default.json());
app.use(index_1.default);
app.listen(3000, () => console.log("REST API running on port 3000"));
// WebSocket Server
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on("connection", (socket) => {
    console.log(" New WebSocket connection established");
    // First message must be authentication
    socket.once("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = JSON.parse(data.toString());
            //console.log(message);
            if (message.event === "authentication" && message.token) {
                //console.log("inside authentication verification if/else");
                const userId = yield (0, RoomController_1.authenticate)(socket, message.token);
                if (userId) {
                    console.log(` User ${userId} authenticated`);
                    socket.userId = userId; // Save user ID on the socket
                    try {
                        const user = yield client.user.findUnique({
                            where: {
                                id: userId
                            },
                            select: {
                                name: true
                            }
                        });
                        console.log(`this is user name ${user === null || user === void 0 ? void 0 : user.name}`);
                        socket.send(JSON.stringify({
                            message: "Authenticated",
                            userId,
                            name: user === null || user === void 0 ? void 0 : user.name
                        }));
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else {
                    //console.log(" Authentication failed 2");
                    socket.send(JSON.stringify({
                        error: "Authentication failed 2",
                    }));
                    socket.close();
                }
            }
            else {
                //console.log(" Authentication required 1");
                socket.send(JSON.stringify({
                    error: "Authentication required 1",
                }));
                socket.close();
            }
        }
        catch (error) {
            console.error(" Authentication error:", error);
            socket.send(JSON.stringify({ error: "Invalid authentication format" }));
            socket.close();
        }
    }));
    //  Handle other WebSocket events
    socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { event, roomId, duration, description, roomName, message } = JSON.parse(data.toString());
            // console.log(data);
            // console.log("roomId: ",roomId || "not given right now");
            // console.log("duration: ",duration);
            // console.log("description: ",description);
            // console.log("roomName: ",roomName);
            const userId = socket.userId;
            if (!userId) {
                return socket.send(JSON.stringify({
                    error: "Unauthorized",
                }));
            }
            switch (event) {
                case "createRoom":
                    yield (0, RoomController_1.createRoom)(socket, userId, roomName, description, duration);
                    break;
                case "joinRoom":
                    yield (0, RoomController_1.joinRoom)(socket, roomId, userId);
                    break;
                case "leaveRoom":
                    yield (0, RoomController_1.leaveRoom)(socket, userId);
                    break;
                case "listRooms":
                    yield (0, RoomController_1.listRooms)(socket);
                    break;
                case "sendMessage":
                    yield (0, RoomController_1.handleChatMessage)(roomId, userId, message);
                default:
                    socket.send(JSON.stringify({
                        error: "Invalid event",
                    }));
            }
        }
        catch (e) {
            console.error(" WebSocket error:", e);
            socket.send(JSON.stringify({
                error: "Something went wrong",
            }));
        }
    }));
    //  Handle disconnection
    socket.on("close", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Socket disconnected:", socket.userId);
        const userId = socket.userId;
        if (userId) {
            RoomController_1.rooms.forEach((room, roomId) => {
                if (room.users.has(userId)) {
                    room.users.delete(userId);
                }
            });
            yield client.studySession.deleteMany({
                where: { userId }
            });
            console.log(`Cleaned up user ${userId} on disconnect`);
        }
    }));
});
console.log(" WebSocket server running on port 8080");

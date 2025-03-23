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
exports.rooms = void 0;
exports.authenticate = authenticate;
exports.createRoom = createRoom;
exports.deletRooom = deletRooom;
exports.joinRoom = joinRoom;
exports.leaveRoom = leaveRoom;
exports.listRooms = listRooms;
exports.handleChatMessage = handleChatMessage;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const client = new client_1.PrismaClient();
exports.rooms = new Map();
const MAX_ROOM_CAPACITY = 10;
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET NOT DEFINE IN ROOMCONTROLLER");
}
const jwt_secret = process.env.JWT_SECRET;
//* authentication in websocket
function authenticate(socket, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("inside authenticate funcation");
            const realToken = token.split(" ")[1];
            const decode = jsonwebtoken_1.default.verify(realToken, jwt_secret);
            if (!decode || !decode.id) {
                throw new Error("invalid token");
            }
            socket.userId = decode.id;
            return decode.id;
        }
        catch (e) {
            console.error("authentication error: ", e);
            return null;
        }
    });
}
//*  create room 
function createRoom(socket, adminId, roomName, description, duration) {
    return __awaiter(this, void 0, void 0, function* () {
        //console.log("outside try/catch createRoom funcation");
        try {
            //console.log("inside try createRoom funcation");
            const createdAt = new Date;
            const expiresAt = new Date(createdAt.getTime() + duration * 60 * 1000);
            //console.log(duration);
            //console.log(createdAt);
            //console.log(expiresAt);
            let room;
            if (true) {
                //console.log("inside if/else of room creation");
                try {
                    const inroom = yield client.rooms.create({
                        data: {
                            adminId,
                            duration,
                            roomName,
                            description,
                            expiresAt,
                            createdAt
                        },
                        select: {
                            id: true,
                            expiresAt: true
                        }
                    });
                    room = inroom;
                    //console.log("room id after room creation",room.id);
                }
                catch (e) {
                    console.error(e);
                }
            }
            if (room) {
                //console.log("db: room created");
            }
            exports.rooms.set(room.id, {
                users: new Map(),
                expiration: setTimeout(() => {
                    deletRooom(room.id);
                }, duration * 60 * 1000)
            });
            socket.send(JSON.stringify({
                message: "room created",
                roomId: room.id,
                expiresAt
            }));
        }
        catch (e) {
            socket.send(JSON.stringify({
                error: "failed to create a room"
            }));
        }
    });
}
//* delete room
function deletRooom(roomId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.rooms.delete({
                where: {
                    id: roomId
                }
            });
            yield client.studySession.deleteMany({
                where: {
                    roomId: roomId
                }
            });
            if (exports.rooms.has(roomId)) {
                exports.rooms.get(roomId).users.forEach((socket) => {
                    socket.send(JSON.stringify({
                        message: "room deleted: ",
                        roomId
                    }));
                });
                exports.rooms.delete(roomId);
            }
        }
        catch (e) {
            console.error(`room deleted ${roomId} `, e);
        }
    });
}
//* join room
function joinRoom(socket, roomId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let room;
            try {
                console.log("inside trycatch db creation");
                const inroom = yield client.rooms.findUnique({
                    where: {
                        id: roomId
                    },
                    include: {
                        studySessions: {
                            select: {
                                id: true
                            }
                        }
                    }
                });
                console.log("after db operation");
                room = inroom;
            }
            catch (e) {
                console.log("inside error log db creation log");
                console.error(e);
            }
            if (!room)
                return socket.send(JSON.stringify({
                    error: "room not found"
                }));
            if (room.studySessions.length >= MAX_ROOM_CAPACITY) {
                return socket.send(JSON.stringify({
                    error: "room is full"
                }));
            }
            try {
                console.log("DB: studysession creation start");
                console.log(userId);
                console.log(roomId);
                yield client.studySession.create({
                    data: {
                        userId,
                        roomId
                    }
                });
                console.log("DB: studysession creation complete");
            }
            catch (e) {
                console.error(e);
            }
            if (!exports.rooms.has(roomId)) {
                exports.rooms.set(roomId, {
                    users: new Map(),
                    expiration: setTimeout(() => {
                        deletRooom(roomId);
                    }, room.expiresAt.getTime() - Date.now())
                });
            }
            exports.rooms.get(roomId).users.set(userId, socket);
            socket.send(JSON.stringify({
                message: "room joined",
                roomId,
                expiresAt: room.expiresAt
            }));
            exports.rooms.get(roomId).users.forEach((userSocket, id) => {
                userSocket.send(JSON.stringify({
                    message: "User joined",
                    userId
                }));
            });
        }
        catch (e) {
            socket.send(JSON.stringify({
                error: "failed to join room"
            }));
        }
    });
}
//* leave room
function leaveRoom(socket, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield client.studySession.findFirst({
                where: {
                    userId
                }
            });
            if (!session)
                return socket.send(JSON.stringify({
                    error: "user not in any room"
                }));
            yield client.studySession.deleteMany({
                where: { userId }
            });
            const room = exports.rooms.get(session.roomId);
            if (room) {
                room.users.delete(userId);
            }
            socket.send(JSON.stringify({
                message: "left room",
                roomID: session.roomId
            }));
        }
        catch (e) {
            socket.send(JSON.stringify({
                error: "falied to leave room"
            }));
        }
    });
}
//* list room 
function listRooms(socket) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const activeRooms = yield client.rooms.findMany({
                select: {
                    id: true,
                    roomName: true,
                    description: true,
                    expiresAt: true
                },
                where: {
                    expiresAt: {
                        gt: new Date()
                    }
                },
            });
            socket.send(JSON.stringify({
                event: "listRooms",
                rooms: activeRooms
            }));
        }
        catch (e) {
            socket.send(JSON.stringify({
                error: "error to fetch all rooms"
            }));
        }
    });
}
//message
function handleChatMessage(roomId, userId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.rooms.has(roomId)) {
            return;
        }
        // Optional: Save message in DB if you want chat history persistence
        // await client.chatMessage.create({
        //     data: {
        //         roomId,
        //         userId,
        //         message,
        //         sentAt: new Date()
        //     }
        // });
        // Broadcast message to all users in room
        exports.rooms.get(roomId).users.forEach((userSocket, id) => {
            userSocket.send(JSON.stringify({
                event: "newMessage",
                roomId,
                message,
                userId
            }));
        });
    });
}

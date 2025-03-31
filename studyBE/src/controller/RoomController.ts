import { WebSocket } from "ws";
import dotevn from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";



dotevn.config();


const client = new PrismaClient();
export const rooms = new Map<number,{users: Map<number,WebSocket>;expiration: NodeJS.Timeout }>();
const MAX_ROOM_CAPACITY = 10;

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET NOT DEFINE IN ROOMCONTROLLER");
}
const jwt_secret = process.env.JWT_SECRET

//* authentication in websocket
export async function authenticate(socket: WebSocket, token: string) {
    try {
        console.log("inside authenticate funcation");     
        const realToken = token.split(" ")[1]
        const decode = jwt.verify(realToken,jwt_secret) as { id:number }
        if(!decode || !decode.id){
            throw new Error("invalid token");
        }

        (socket as any ).userId = decode.id
        return decode.id;

    } catch (e) {
        console.error("authentication error: ",e);
        return null 
    }   
}
//*  create room 
export async function createRoom(socket: WebSocket, adminId: number, roomName: string, description: string, duration: number) {
    //console.log("outside try/catch createRoom funcation");
    
    try {
        //console.log("inside try createRoom funcation");
        
        const createdAt = new Date
        const expiresAt = new Date(createdAt.getTime() + duration*60*1000)
        
        //console.log(duration);
        

        //console.log(createdAt);
        //console.log(expiresAt);
        
        let room:any;
        
        if(true){
            //console.log("inside if/else of room creation");
        try {

            const inroom = await client.rooms.create({
                data:{
                    adminId,
                    duration,
                    roomName,
                    description,
                    expiresAt,
                    createdAt
                },
                select:{
                    id: true,
                    expiresAt: true
                }
            })
            room = inroom
            //console.log("room id after room creation",room.id);
            
        } catch (e) {
            console.error(e);
            
            
        }
        
        
     }
        

        if(room){
            //console.log("db: room created");
            
        }

        rooms.set(room.id,{
            users: new Map(),
            expiration: setTimeout(() => {
                deletRooom(room.id)
            }, duration*60*1000)
        })
        
        socket.send(JSON.stringify({
            message: "room created",
            roomId: room.id,
            expiresAt
        }))

    } catch (e) {
        socket.send(JSON.stringify({
            error: "failed to create a room"
        })
    )}
   
}

//* delete room

export async function deletRooom(roomId:number) {
    try {
        await client.rooms.delete({
            where:{
                id:roomId
            }
        })
        await client.studySession.deleteMany({
            where: {
              roomId: roomId
            }
        });

        if(rooms.has(roomId)){
            rooms.get(roomId)!.users.forEach((socket)=>{
                socket.send(JSON.stringify({
                    message: "room deleted: ",
                    roomId
                }))
            })
            rooms.delete(roomId)
        }

    } catch (e) {
        console.error(`room deleted ${roomId} `,e);
        
        
    }
    
}

//* join room

export async function joinRoom(socket:WebSocket,roomId: number,userId:number) {
   
    try {
        let room;

        try {

            console.log("inside trycatch db creation");
            
            const inroom = await client.rooms.findUnique({
                where:{
                    id: roomId
                },
                include:{
                    studySessions:{
                        select:{
                            id: true
                        }
                    }
                }
            })

            console.log("after db operation");
            
            room = inroom
            
        } catch (e) {
            console.log("inside error log db creation log");
            
            console.error(e);
        }
        
    
        if(!room) return socket.send(JSON.stringify({
            error: "room not found"
        }))
    
        if(room.studySessions.length >= MAX_ROOM_CAPACITY){
            return socket.send(JSON.stringify({
                error: "room is full"
            }))
        }

        try {
            console.log("DB: studysession creation start");
            console.log(userId);
            console.log(roomId);
                        
            
            await client.studySession.create({
                data:{
                    userId,
                    roomId
                }
            })

            console.log("DB: studysession creation complete");
            
            
        } catch (e) {
            console.error(e);
            
        }
        

        if(!rooms.has(roomId)){
            rooms.set(roomId,{
                users: new Map(),
                expiration: setTimeout(() => {
                    deletRooom(roomId)
                }, room.expiresAt.getTime() - Date.now())
            })
        }

        rooms.get(roomId)!.users.set(userId,socket);

        socket.send(JSON.stringify({
            event: "room joined",
            roomId,
            expiresAt:  room.expiresAt
        }))

        rooms.get(roomId)!.users.forEach((userSocket, id) => {
            userSocket.send(JSON.stringify({
                message: "User joined",
                userId
            }));
        });
        
          
        
    } catch (e) {
        socket.send(JSON.stringify({
            error: "failed to join room"
        }))
        
    }
}

//* leave room

export async function leaveRoom(socket:WebSocket, userId: number) {

    try {
        const session = await client.studySession.findFirst({
            where:{
                userId
            }
        })

        if(!session) return socket.send(JSON.stringify({
            error: "user not in any room"
        }))

        await client.studySession.deleteMany({
            where: { userId }
        });
        
        const room = rooms.get(session.roomId);
        if(room){
            room.users.delete(userId);
        }

        socket.send(JSON.stringify({
            message: "left room",
            roomID: session.roomId
        }))

        
    } catch (e) {
        socket.send(JSON.stringify({
            error: "falied to leave room"
        }))
        
    }

    
}

//* list room 

export async function listRooms(socket:WebSocket) {

    try {

        const activeRooms = await client.rooms.findMany({
            select: { 
                id: true,
                roomName:true,
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
        }))


    } catch (e) {
        socket.send(JSON.stringify({
            error: "error to fetch all rooms"
        }))
        
    }
    
}

//message

export async function handleChatMessage(roomId: number, userId: number, message: string) {
    if (!rooms.has(roomId)) {
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
    rooms.get(roomId)!.users.forEach((userSocket, id) => {
        userSocket.send(JSON.stringify({
            event: "newMessage",
            roomId,
            message,
            userId
        }));
    });
}

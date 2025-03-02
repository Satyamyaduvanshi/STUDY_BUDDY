import { WebSocket } from "ws";
import dotevn from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";



dotevn.config();


const client = new PrismaClient();
const rooms = new Map<number,{users: Map<number,WebSocket>;expiration: NodeJS.Timeout }>();
const jwt_secret = process.env.JWT_SECRET || " "
const MAX_ROOM_CAPACITY = 10;

//* authentication in websocket
export async function authenticate(socket: WebSocket, token: string) {
    try {
        console.log("inside authenticate funcation");
        
        const realToken = token.split(" ")[1]

        console.log(realToken);
        
        
        
        
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
    console.log("outside try/catch createRoom funcation");
    
    try {
        console.log("inside try createRoom funcation");
        
        const createdAt = new Date
        const expiresAt = new Date(createdAt.getTime() + duration*60*1000)
        
        console.log(duration);
        

        console.log(createdAt);
        console.log(expiresAt);
        
        const room = await client.rooms.create({
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
        console.log(room.id);
        

        if(room){
            console.log("db: room created");
            
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
        const room = await client.rooms.findUnique({
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
    
        if(!room) return socket.send(JSON.stringify({
            error: "room not found"
        }))
    
        if(room.studySessions.length >= MAX_ROOM_CAPACITY){
            return socket.send(JSON.stringify({
                error: "room is full"
            }))
        }
    
        await client.studySession.create({
            data:{
                userId,
                roomId
            }
        })

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
            message: "room joined",
            roomId,
            expiresAt:  room.expiresAt
        }))
        
    } catch (e) {
        socket.send(JSON.stringify({
            error: "failed to join room"
        }))
        
    }
}

//* leave room

export async function leaveRoom(socket:WebSocket, userId: number) {

    try {
        const session = await client.studySession.findUnique({
            where:{
                userId
            }
        })

        if(!session) return socket.send(JSON.stringify({
            error: "user not in any room"
        }))

        await client.studySession.delete({
            where:{
                userId
            }
        })
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
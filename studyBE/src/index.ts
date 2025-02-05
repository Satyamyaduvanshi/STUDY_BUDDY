import express  from "express";
import dotenv from "dotenv";
import routes from "./routes/index";

dotenv.config();
const app = express();

app.use(express.json());

app.use(routes);





app.listen(3000);

//* websocket server

import { WebSocket, WebSocketServer } from "ws";
import { authenticate,createRoom,joinRoom,leaveRoom,listRooms } from "./controller/RoomController";

const wss = new WebSocketServer({port:8080});

wss.on("connection",(socket:WebSocket)=>{

    socket.once("message",async(data)=>{
        const message = JSON.parse(data.toString());

        if(message.event === "authentication" && message.token){
            const userId = await authenticate(socket,message.token);

            if(userId){
                console.log(`User ${userId} authenticated`);
                socket.send(JSON.stringify({
                    message: "Authenticated",
                    userId
                }))
            }else{
                socket.send(JSON.stringify({
                    error: "Authentication failed"
                }))
                socket.close();
            }
        }else{
            socket.send(JSON.stringify({
                error: "authentication required"
            }))
            socket.close();
        }

    })


    socket.on("message", async (data) => {
        
        try {
            const {event,roomId,duration,description,roomName} = JSON.parse(data.toString());

            const userId = (socket as any).userId

            if(!userId) {
                return socket.send(JSON.stringify({
                    error: "unauthorized"
                }))
            }

            if(event === "createRoom"){
                await createRoom(socket,userId,duration,description,roomName);
            }
            else if(event === "joinRoom"){
                await joinRoom(socket,roomId,userId);
            }
            else if(event === "leaveRoom"){
                await leaveRoom(socket,userId);
            }
            else if(event === "listRooms"){
                await listRooms(socket);
            }
            
            
        } catch (e) {
            console.error("error: ",e);
            socket.send(JSON.stringify({
                error: "something went wrong"
            }))
            
            
        }
    })

    socket.on("close",()=>{
        console.log("user disconnected");
        
    })


})

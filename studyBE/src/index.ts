import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import cors from "cors";
import { WebSocket, WebSocketServer } from "ws";
import {
  authenticate,
  createRoom,
  joinRoom,
  leaveRoom,
  listRooms,
} from "./controller/RoomController";

dotenv.config();
const app = express();

//  Enable CORS for frontend (React on port 5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allows cookies/auth if needed
  })
);

app.use(express.json());
app.use(routes);

app.listen(3000, () => console.log("REST API running on port 3000"));

// WebSocket Server
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket: WebSocket) => {
  console.log(" New WebSocket connection established");

  // First message must be authentication
  socket.once("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      //console.log(message);
      

      if (message.event === "authentication" && message.token) {

        //console.log("inside authentication verification if/else");
        
        const userId = await authenticate(socket, message.token);

        if (userId) {
          console.log(` User ${userId} authenticated`);
          (socket as any).userId = userId; // Save user ID on the socket

          socket.send(
            JSON.stringify({
              message: "Authenticated",
              userId,
            })
          );
        } else {
          //console.log(" Authentication failed 2");
          socket.send(
            JSON.stringify({
              error: "Authentication failed 2",
            })
          );
          socket.close();
        }
      } else {
        //console.log(" Authentication required 1");
        socket.send(
          JSON.stringify({
            error: "Authentication required 1",
          })
        );
        socket.close();
      }
    } catch (error) {
      console.error(" Authentication error:", error);
      socket.send(JSON.stringify({ error: "Invalid authentication format" }));
      socket.close();
    }
  });

  //  Handle other WebSocket events
  socket.on("message", async (data) => {
    try {
      const { event, roomId, duration, description, roomName } = JSON.parse(
        data.toString()
      );

      // console.log(data);
      

      // console.log("roomId: ",roomId || "not given right now");
      // console.log("duration: ",duration);
      // console.log("description: ",description);
      // console.log("roomName: ",roomName);
      
      
      
      
      const userId = (socket as any).userId;

      if (!userId) {
        return socket.send(
          JSON.stringify({
            error: "Unauthorized",
          })
        );
      }

      switch (event) {
        case "createRoom":
          await createRoom(socket, userId, roomName, description,duration);
          break;
        case "joinRoom":
          await joinRoom(socket, roomId, userId);
          break;
        case "leaveRoom":
          await leaveRoom(socket, userId);
          break;
        case "listRooms":
          await listRooms(socket);
          break;
        default:
          socket.send(
            JSON.stringify({
              error: "Invalid event",
            })
          );
      }
    } catch (e) {
      console.error(" WebSocket error:", e);
      socket.send(
        JSON.stringify({
          error: "Something went wrong",
        })
      );
    }
  });

  //  Handle disconnection
  socket.on("close", () => {
    console.log("🔌 User disconnected");
  });
});

console.log(" WebSocket server running on port 8080");

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface RoomProps {
  id: number;
  roomName: string;
  description: string;
  duration: number;
  expiresAt: string;
}

type joinProps={
  id: number,
  expiresAt: string;
}

interface MessageProps {
  roomId: number;
  userId: number;
  userName: string;
  message: string;
}

interface WebSocketContextType {
  sendMessage: (message: object) => void;
  rooms: RoomProps[];
  username: string;
  messages: MessageProps[];
  currentRoom: joinProps | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<joinProps | null>>;
}

const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => {
    throw new Error("sendMessage must be used within WebSocketProvider");
  },
  rooms: [],
  username: "",
  messages: [],
  currentRoom: null,
  setCurrentRoom: () => {},
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [username, setUsername] = useState<string>("");
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [currentRoom, setCurrentRoom] = useState<joinProps | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
      const token = localStorage.getItem("authorization");
      if (!token) {
        console.error("❌ No authentication token found!");
        return;
      }
      ws.send(JSON.stringify({ event: "authentication", token }));
    };

    ws.onmessage = (event) => {
      try {
        
        const data = JSON.parse(event.data);
        console.log("📩 Received:", data);

        if (data.message === "Authenticated") {
          console.log(`✅ User ${data.userId} authenticated successfully`);
          setUsername(data.name);
          ws.send(JSON.stringify({ event: "listRooms" }));
        }else if (data.event === "room joined") {
          setCurrentRoom({
            id: data.roomId,
            // roomName:"room",
            // description:"welcome to this room",
            // duration:0,
            expiresAt: data.expiresAt,
          });
      
          console.log("🟢 Joined Room:", data);
        }
        else if (data.error) {
          console.error("❌ Error:", data.error);
          if (data.error === "room not found") {
            Swal.fire({
              icon: "error",
              title: "Room Not Found!",
              text: "Taking you back...",
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
            });
            setTimeout(() => navigate("/"), 2500);
          }
        } else if (data.event === "listRooms") {
          setRooms(data.rooms);
        } else if (data.event === "newMessage") {
          setMessages((prev) => [
            ...prev,
            {
              roomId: data.roomId,
              userId: data.userId,
              userName: data.userName, // Ensure this is included
              message: data.message,
            },
          ]);
        } 
      } catch (err) {
        console.error("❌ Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (e) => console.error("⚠️ WebSocket Error:", e);
    ws.onclose = () => console.log("⚠️ WebSocket Disconnected");

    return () => {
      ws.close();
      console.log("🧹 Cleanup: WebSocket closed");
    };
  }, [navigate]);

  const sendMessage = (message: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
      console.log("📤 Sent:", message);
    } else {
      console.error("⚠️ WebSocket not open. Message not sent:", message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, rooms, username, messages, currentRoom, setCurrentRoom }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
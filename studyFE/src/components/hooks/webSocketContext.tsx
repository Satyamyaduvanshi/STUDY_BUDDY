import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';




interface RoomProps {
  id: number;
  roomName: string;
  description: string;
  duration: number;
}

interface WebSocketContextType {
  sendMessage: (message: object) => void;
  rooms: RoomProps[];
  username: string;
}

// Default context (with dummy values & fallback function)
const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => {
    throw new Error("sendMessage function must be used within a WebSocketProvider");
  },
  rooms: [],
  username: "",
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [rooms, setRooms] = useState<RoomProps[]>([]);
  const [username, setName] = useState<string>("");
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
          setName(data.name);
        } else if (data.error) {
          console.error("❌ Error:", data.error);

          if (data.error === "room not found") {
            
            Swal.fire({
              icon: 'error',
              title: 'Room Not Found!',
              text: 'Taking you back ...',
              background: '#038478',
              color: '#800020',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true,
            });
      
            
            setTimeout(() => {
              navigate("/");
            }, 2500);
          } 

        } else if (data.event === "listRooms") {
          setRooms(data.rooms);
        }
      
      } catch (error) {
        console.error("❌ Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (event) => console.error("⚠️ WebSocket Error:", event);
    ws.onclose = () => console.log("⚠️ WebSocket Disconnected");

    return () => {
      ws.close();
      console.log("🧹 Cleanup: WebSocket closed");
    };
  }, []);

  const sendMessage = (message: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("⚠️ WebSocket not open. Message not sent:", message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, rooms, username }}>
      {children}
    </WebSocketContext.Provider>
  );
};


// Custom hook to use WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
};

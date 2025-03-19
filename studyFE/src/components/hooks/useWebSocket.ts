import { useEffect, useRef, useState } from "react";

interface RoomProps {
    id: number;
    roomName: string;
    description: string;
    duration: number;
}

export const useWebSocket = () => {
    const socketRef = useRef<WebSocket | null>(null);
    const [rooms, setRooms] = useState<RoomProps[]>([]);
    const [username, setName] = useState<string>("");

    // Connect WebSocket
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
                } else if (data.event === "roomList") {
                    setRooms(data.rooms);
                }
            } catch (error) {
                console.error("❌ Failed to parse WebSocket message:", error);
            }
        };

        ws.onerror = (event) => console.error("⚠️ WebSocket Error:", event);
        ws.onclose = () => console.log("⚠️ WebSocket Disconnected");

        return () => {
            if (ws) {
                ws.close();
                console.log("🧹 Cleanup: WebSocket closed");
            }
        };
    }, []);

    const sendMessage = (message: object) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.error("⚠️ WebSocket not open. Message not sent:", message);
        }
    };

    return { sendMessage, rooms, username };
};

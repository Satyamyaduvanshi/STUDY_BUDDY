import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

interface RoomProps {
    id: number;
    name: string;
    description: string;
}

const Dashboard = () => {
    const name = "Satyam";
    const socketRef = useRef<WebSocket | null>(null);
    const [rooms, setRooms] = useState<RoomProps[]>([]);

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
            const data = JSON.parse(event.data);
            console.log("📩 Received:", data);

            if (data.message === "Authenticated") {
                console.log(`✅ User ${data.userId} authenticated successfully`);
            } else if (data.error) {
                console.error("❌  error:", data.error);
            } else if (data.event === "roomList") {
                setRooms(data.rooms);
            }
        };

        ws.onerror = (error) => console.error("⚠️ WebSocket Error:", error);
        ws.onclose = () => console.log("⚠️ WebSocket Disconnected");

        return () => {
            ws.close();
            console.log("🧹 Cleanup: WebSocket closed");
        };
    }, []);

    const sendMessage = (message: any) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.error("⚠️ WebSocket not open. Message not sent:", message);
        }
    };

    const createRoom = (duration: number, description: string, roomName: string) => {
        sendMessage({ event: "createRoom", duration, description, roomName });
    };

    const joinRoom = (roomId: number) => {
        sendMessage({ event: "joinRoom", roomId });
    };

    const leaveRoom = () => {
        sendMessage({ event: "leaveRoom" });
    };

    const listRooms = () => {
        sendMessage({ event: "listRooms" });
    };

    return (
        <div className="relative h-dvh w-screen overflow-hidden p-4 mt-24">
            <h1 className="text-xl font-bold">Welcome {name}! Let's Start Studying</h1>

            <div className="mt-4">

                <form className="max-w-sm" >
                    <div className="mb-5">
                        <label 
                        className=" block text-black mb-2 text-sm font-medium "
                        >
                            Room Name
                        </label>
                        <input type="text" required placeholder="study room name..." className="rounded-lg border p-2"/>
                    </div>
                    <div className="mb-5">
                    <label 
                        className=" block text-black mb-2 text-sm font-medium "
                        >
                           Description
                        </label>
                        <input type="text" required placeholder="description..." className="rounded-lg border p-2" />
                    </div>
                    <div className="mb-5">
                    <label 
                        className=" block text-black mb-2 text-sm font-medium "
                        >
                           Duration
                        </label>
                        <input type="number" required placeholder="1,2,3... mins" className="rounded-lg border p-2" />
                    </div>

                    <Button text="Create Room" variant="primary" />

                </form>


                <button className="p-2 bg-blue-500 text-white rounded" onClick={() => createRoom(60, "Study Room", "Maths Group")}>
                    Create Room
                </button>
                <button className="p-2 bg-green-500 text-white rounded ml-2" onClick={listRooms}>
                    List Rooms
                </button>
            </div>

            <div className="mt-4">
                <h2 className="text-lg font-semibold">Available Rooms:</h2>
                <ul>
                    {rooms.map((room) => (
                        <li key={room.id} className="mt-2 border p-2 rounded">
                            {room.name} - {room.description}
                            <button className="ml-2 bg-gray-500 text-white p-1 rounded" onClick={() => joinRoom(room.id)}>
                                Join
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="p-2 bg-red-500 text-white rounded mt-4" onClick={leaveRoom}>
                Leave Room
            </button>
        </div>
    );
};

export default Dashboard;

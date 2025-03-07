import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";


interface RoomProps{
    id: number,
    roomName: string,
    description: string,
    duration: number

}

interface FormProps {
    roomName: string,
    description: string,
    duration: number
}

const Dashboard = () => {
    const name = "Satyam";
    const socketRef = useRef<WebSocket | null>(null);
    const [rooms, setRooms] = useState<RoomProps[]>([]);
    const [formsData,setFormData] = useState<FormProps>({
        roomName:"",
        description:"",
        duration:0
    })

    // ws 
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

        ws.onerror = (event) => console.error("⚠️ WebSocket Error:", event.type);
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
        sendMessage({ event: "createRoom", roomName, description, duration });
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

    //-----------------------------------------------------------------------------------------------------
    // Form

    const handleChange = (e:React.ChangeEvent< HTMLInputElement | HTMLTextAreaElement>)=>{

        const {name,value} = e.target
        
        setFormData({
            ...formsData,
            [name]: name === "duration" ? Number(value) : value
        });
        
    }

    function FormSubmit(e:React.ChangeEvent<HTMLFormElement>){
        e.preventDefault()

        const {roomName,description,duration} = formsData;

        if(!roomName || !description || !duration){
            alert("please fill in all fields of CreateRoom.")
            return
        }

        createRoom(duration,description,roomName);
    }

    return (
        <div className="relative h-dvh w-screen overflow-hidden p-4 mt-24">
            <h1 className="text-4xl font-bold pl-24 p-2">Hello {name}! </h1>

            <div className="mt-4 ml-28 p-6">

            <form className="max-w-sm space-y-5 border rounded-xl p-6" onSubmit={FormSubmit}>
                <div>
                    <label htmlFor="roomName" className="block text-black text-lg mb-2 font-bold">
                      Room Name
                    </label>
                    <input
                        id="roomName"
                        name="roomName"
                        type="text"
                        value={formsData.roomName}
                        onChange={handleChange}
                        required
                        placeholder="Study room name..."
                        className="w-full rounded-lg border p-2"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-black text-lg mb-2 font-bold">
                      Description
                    </label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        value={formsData.description}
                        onChange={handleChange}
                        required
                        placeholder="Description..."
                        className="w-full rounded-lg border p-2"
                    />
                </div>

                <div>
                    <label htmlFor="duration" className="block text-black text-lg mb-2 font-bold">
                        Duration (mins)
                    </label>
                    <input
                        id="duration"
                        name="duration"
                        type="number"
                        value={formsData.duration}
                        onChange={handleChange}
                        required
                        placeholder="1, 2, 3..."
                        className="w-full rounded-lg border p-2"
                    />
                </div>

                <Button type="submit" variant="primary" text="Create Room" ></Button>

                </form>

                <div/>

                
            
            </div>



            {/* <div className="mt-4">
                <h2 className="text-lg font-semibold">Available Rooms:</h2>
                <ul>
                    {rooms.map((room) => (
                        <li key={room.id} className="mt-2 border p-2 rounded">
                            {room.roomName} - {room.description}
                            <button className="ml-2 bg-gray-500 text-white p-1 rounded" onClick={() => joinRoom(room.id)}>
                                Join
                            </button>
                        </li>
                    ))}
                </ul>
            </div> */}

            {/* <button className="p-2 bg-red-500 text-white rounded mt-4" onClick={leaveRoom}>
                Leave Room
            </button> */}
        </div>
    );
};

export default Dashboard;

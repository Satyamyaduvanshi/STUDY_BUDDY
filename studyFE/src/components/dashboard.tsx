import React, { useState } from "react";
import { Button } from "./ui/button";
import { useWebSocket } from "./hooks/webSocketContext";
import { useNavigate } from "react-router-dom";

interface FormProps {
    roomName: string;
    description: string;
    duration: number;
}

const Dashboard = () => {

    const nagivate = useNavigate();
    
    const { sendMessage, rooms, username } = useWebSocket();

    const [formData, setFormData] = useState<FormProps>({
        roomName: "",
        description: "",
        duration: 0,
    });
    const [joinRoomBox, setJoinRoomFieldBox] = useState<number | "">("");

    const createRoom = () => {
        if (!formData.roomName || !formData.description || formData.duration <= 0) {
            alert("Please fill in all fields correctly.");
            return;
        }
        sendMessage({ event: "createRoom", ...formData });
    };

    const joinRoom = () => {
        if (!joinRoomBox) {
            console.log("room id is not given");
            alert("Please enter a valid Room ID.");
            return;
        }
    
        nagivate(`/room/:${joinRoomBox}`);
    };
    

   
    // Form Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "duration" ? Number(value) || 0 : value,
        }));
    };

    const handleJoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJoinRoomFieldBox(e.target.value ? Number(e.target.value) : "");
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createRoom();
    };

    const handleJoinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        joinRoom();
    };

    return (
        <div className="relative h-dvh w-screen overflow-hidden p-4 mt-24">
            <h1 className="text-4xl font-bold text-center p-4">Hello {username}!</h1>

            <div className="grid grid-cols-3 gap-8 items-center px-20">
                {/* Create Room Form */}
                <div className="p-4">
                    <form className="space-y-5 border rounded-xl p-6 w-64" onSubmit={handleFormSubmit}>
                        <h2 className="text-lg font-semibold text-center">Create Room</h2>

                        <div>
                            <label htmlFor="roomName" className="block text-black text-sm mb-1 font-bold">
                                Room Name
                            </label>
                            <input
                                id="roomName"
                                name="roomName"
                                type="text"
                                value={formData.roomName}
                                onChange={handleChange}
                                required
                                placeholder="Study room name..."
                                className="w-full rounded-lg border p-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-black text-sm mb-1 font-bold">
                                Description
                            </label>
                            <input
                                id="description"
                                name="description"
                                type="text"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Description..."
                                className="w-full rounded-lg border p-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="duration" className="block text-black text-sm mb-1 font-bold">
                                Duration (mins)
                            </label>
                            <input
                                id="duration"
                                name="duration"
                                type="number"
                                value={formData.duration}
                                onChange={handleChange}
                                required
                                min="1"
                                placeholder="1, 2, 3..."
                                className="w-full rounded-lg border p-2"
                            />
                        </div>

                        <Button type="submit" text="Create Room" variant="primary" />
                    </form>
                </div>

                {/* Join Room Form */}
                <div className="p-4 flex justify-center scale-150">
                    <form className="border p-8 rounded-lg w-96 shadow-lg bg-white" onSubmit={handleJoinSubmit}>
                        <h2 className="text-2xl font-bold text-center mb-4">Join Room</h2>
                        <input
                            type="number"
                            id="joinRoom"
                            value={joinRoomBox}
                            onChange={handleJoinChange}
                            required
                            placeholder="Enter Room ID"
                            className="w-full rounded-lg border p-3 text-lg"
                        />
                        <Button text="Join Room" variant="primary" classname="mt-4 w-full" type="submit" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import { useWebSocket } from "./hooks/webSocketContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface FormProps {
  roomName: string;
  description: string;
  duration: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { sendMessage, rooms, username } = useWebSocket();

  const [formData, setFormData] = useState<FormProps>({
    roomName: "",
    description: "",
    duration: 0,
  });

  const [joinRoomId, setJoinRoomId] = useState<number | "">("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const sortedRooms = useMemo(() => {
    return rooms ? [...rooms].sort((a, b) => b.id - a.id) : [];
  }, [rooms]);

  const createRoom = () => {
    if (!formData.roomName || !formData.description || formData.duration <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }
    sendMessage({ event: "createRoom", ...formData });
  };

  const joinRoom = (id?: number) => {
    const targetId = id !== undefined ? id : joinRoomId;
    if (!targetId) {
      alert("Please enter a valid Room ID.");
      return;
    }
    navigate(`/room/${targetId}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) || 0 : value,
    }));
  };

  const handleJoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinRoomId(e.target.value ? Number(e.target.value) : "");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createRoom();
  };

  const handleJoinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    joinRoom();
  };

  const getMinutesLeft = (expiresAt: string) => {
    const expireTime = new Date(expiresAt).getTime();
    const now = new Date().getTime();
    const diffMs = expireTime - now;
    const diffMins = Math.max(Math.ceil(diffMs / (1000 * 60)), 0);
    return diffMins;
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden overflow-y-auto bg-gradient-to-b from-black via-green-800 to-black">
     
      <motion.div
        className="absolute top-24 left-8 text-white text-4xl md:text-5xl font-bold ml-12 md:ml-24 mt-20"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        {greeting}, {username}!
      </motion.div>

      <motion.div
        className="mt-48 md:mt-48 p-8 md:p-16 flex flex-col items-center justify-center w-11/12 md:w-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Join Room</h2>
        <form className="flex flex-col items-center w-full md:w-96" onSubmit={handleJoinSubmit}>
          <input
            type="number"
            id="joinRoom"
            value={joinRoomId}
            onChange={handleJoinChange}
            required
            placeholder="Enter Room ID"
            className="w-full rounded-xl p-4 text-lg bg-white/90 text-black mb-6 border-none"
          />
          <Button text="Join Room" variant="primary" classname="w-full" type="submit" />
        </form>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4 md:px-12 mt-32 md:mt-64 mb-12">
        
        <motion.div
          className="rounded-2xl p-6 shadow-lg flex flex-col border justify-center items-center bg-white/10 backdrop-blur-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4 text-white">Create Room</h2>
          <form id="createRoom" className="space-y-4 w-full md:w-80" onSubmit={handleFormSubmit}>
            <input
              id="roomName"
              name="roomName"
              type="text"
              value={formData.roomName}
              onChange={handleChange}
              required
              placeholder="Room Name"
              className="w-full rounded-lg border p-3"
            />
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Description"
              className="w-full rounded-lg border p-3"
            />
            <input
              id="duration"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              placeholder="Duration (mins)"
              className="w-full rounded-lg border p-3"
            />
            <Button type="submit" text="Create Room" variant="primary" classname="w-full" />
          </form>
        </motion.div>

       
        <motion.div
          className="rounded-2xl p-6 shadow-lg flex flex-col items-center bg-white/10 backdrop-blur-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 id="listRooms" className="text-xl font-bold mb-4 text-white">Available Rooms</h2>
          {sortedRooms.length > 0 ? (
            <div className="space-y-4 w-full md:w-80 text-center">
              {sortedRooms.map((room) => (
                <div key={room.id} className="bg-black rounded-lg p-4 shadow text-white">
                  <p><strong>ID:</strong> {room.id}</p>
                  <p><strong>Name:</strong> {room.roomName}</p>
                  <p><strong>Description:</strong> {room.description}</p>
                  <p><strong>Expires in:</strong> {getMinutesLeft(room.expiresAt)} mins</p>
                  <Button
                    text="Join"
                    variant="primary"
                    classname="w-full mt-2"
                    onClick={() => joinRoom(room.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white">No available rooms yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
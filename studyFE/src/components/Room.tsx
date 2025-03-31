import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "./hooks/webSocketContext";
import { Button } from "./ui/button";

const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { sendMessage, rooms, messages, username, currentRoom } = useWebSocket();
  const [mainRoomId, setMainRoomId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Parse room ID from URL
  useEffect(() => {
    if (roomId) {
      const parsedId = parseInt(roomId);
      if (!isNaN(parsedId)) setMainRoomId(parsedId);
    }
  }, [roomId]);

  // Join room when roomId is set
  useEffect(() => {
    if (mainRoomId !== null && rooms.some((room) => room.id === mainRoomId)) {
      sendMessage({ event: "joinRoom", roomId: mainRoomId });
    }
  }, [mainRoomId, rooms]);

  // Start timer only after currentRoom is set
  useEffect(() => {
    console.log("currentRoom: ", currentRoom);

    //currentRoom.expiresAt = '2025-04-01T01:22:27.136Z'

    if (currentRoom?.expiresAt) {
      const expiryTime = new Date(currentRoom.expiresAt).getTime();
      const updateRemainingTime = () => {
        const now = Date.now();
        const diff = Math.max(Math.floor((expiryTime - now) / 1000), 0);
        setRemainingTime(diff);
      };

      updateRemainingTime(); // Update immediately
      const interval = setInterval(updateRemainingTime, 1000);

      return () => clearInterval(interval);
    } else {
      setRemainingTime(0); // Reset timer if no room is joined
    }
  }, [currentRoom]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const leaveRoom = () => {
    sendMessage({ event: "leaveRoom" });
    navigate("/");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && mainRoomId !== null) {
      sendMessage({
        event: "sendMessage",
        roomId: mainRoomId,
        message: newMessage,
        userName: username,
      });
      setNewMessage("");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 w-full bg-gradient-to-b from-black via-green-800 to-black">
      <h2 className="text-2xl text-white font-semibold mb-4">Room ID: {mainRoomId}</h2>
      <div className="text-5xl font-bold mb-6 text-white">
        {remainingTime > 0 ? formatTime(remainingTime) : "Time's Up!"}
      </div>
      <div className="border w-full max-w-3xl h-96 overflow-y-auto p-4 bg-black shadow-md rounded-md">
        {messages
          .filter((msg) => msg.roomId === mainRoomId)
          .map((msg, idx) => (
            <div key={idx} className={`mb-2 text-white ${msg.userName === username ? "text-right" : "text-left"}`}>
              <span className="font-bold">{msg.userId}: </span> {msg.message}
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex w-full max-w-3xl mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Type your message..."
        />
        <Button text="Send" variant="primary" type="submit" classname="ml-2 p-2" />
      </form>
      <Button onClick={leaveRoom} text="Leave Room" variant="primary" classname="mt-4 bg-red-600 text-white" />
    </div>
  );
};

export default Room;
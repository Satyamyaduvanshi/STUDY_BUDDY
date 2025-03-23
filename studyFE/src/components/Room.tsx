import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useWebSocket } from "./hooks/webSocketContext";
import { useEffect, useState, useRef } from "react";

const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { sendMessage, rooms, messages, username, currentRoom } = useWebSocket();
  const [mainRoomId, setMainRoomId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Set roomId
  useEffect(() => {
    if (roomId) {
      const parsedId = parseInt(roomId);
      if (!isNaN(parsedId)) setMainRoomId(parsedId);
    }
  }, [roomId]);

  // Join Room after rooms fetched
  useEffect(() => {
    if (mainRoomId !== null && rooms.length > 0) {
      const roomExists = rooms.some(room => room.id === mainRoomId);
      if (roomExists) {
        sendMessage({ event: "joinRoom", roomId: mainRoomId });
      }
    }
  }, [mainRoomId, rooms, sendMessage]);

  // Handle Timer Logic
  useEffect(() => {
    if (currentRoom && currentRoom.expiresAt) {
      const expiry = new Date(currentRoom.expiresAt).getTime();

      const interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.max(Math.floor((expiry - now) / 1000), 0);
        setRemainingTime(diff);
        if (diff <= 0) clearInterval(interval);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentRoom]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Leave Room
  const leaveRoom = () => {
    sendMessage({ event: "leaveRoom" });
    navigate("/");
  };

  // Send Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && mainRoomId !== null) {
      sendMessage({ event: "sendMessage", roomId: mainRoomId, message: newMessage });
      setNewMessage("");
    }
  };

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <h2 className="text-2xl mb-4">Room ID: {mainRoomId}</h2>

      {/* Central Timer */}
      <div className="text-5xl font-bold mb-6 text-green-800">
        {remainingTime > 0 ? formatTime(remainingTime) : "Time's Up!"}
      </div>

      <div className="border w-3/4 h-96 overflow-y-scroll mb-4 p-4 rounded">
        {currentRoom && messages
          .filter(msg => msg.roomId === mainRoomId)
          .map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.userName === username ? "text-right" : "text-left"}`}>
              <span className="font-bold">{msg.userName}: </span>{msg.message}
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex w-3/4 mb-4">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          className="border p-2 rounded w-full mr-2"
          placeholder="Type your message..."
        />
        <Button text="Send" variant="secondary" />
      </form>

      <Button text="Leave Room" variant="primary" onClick={leaveRoom} />
    </div>
  );
};

export default Room;

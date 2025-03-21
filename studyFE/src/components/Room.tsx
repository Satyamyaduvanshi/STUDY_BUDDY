import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useWebSocket } from "./hooks/webSocketContext";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';  // ⬅️ Import SweetAlert2

const Room = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { sendMessage, rooms } = useWebSocket();
    const [mainRoomId, setMainRoomId] = useState<number | null>(null);

    console.log("this is room id from param:", roomId);

    // Parse roomId from URL or from localStorage
    useEffect(() => {
        if (roomId) {
            const NroomId = parseInt(roomId);
            if (!isNaN(NroomId)) {
                setMainRoomId(NroomId);
            }
        } else {
            const localRoomId = localStorage.getItem("joinRoomId");
            if (localRoomId) {
                const Nlocal = parseInt(localRoomId);
                if (!isNaN(Nlocal)) {
                    setMainRoomId(Nlocal);
                }
            }
        }
    }, [roomId]);

    // Check if room exists, then join or show popup
    useEffect(() => {
        if (mainRoomId !== null) {
            localStorage.setItem("joinRoomId", mainRoomId.toString());

            const roomExists = rooms.some(room => room.id === mainRoomId);

            if (roomExists) {
                sendMessage({ event: "joinRoom", roomId: mainRoomId });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Room Not Found!',
                    text: 'Taking you back to dashboard...',
                    background: '#fff0f5',
                    color: '#800080',
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                });

                setTimeout(() => {
                    localStorage.removeItem("joinRoomId");
                    navigate("/");
                }, 2500);
            }
        }
    }, [mainRoomId, rooms, sendMessage, navigate]);

    const leaveRoom = () => {
        sendMessage({ event: "leaveRoom" });
        localStorage.removeItem("joinRoomId");
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">Room ID: {mainRoomId}</h2>
            <Button text="Leave Room" variant="primary" onClick={leaveRoom} />
        </div>
    );
};

export default Room;

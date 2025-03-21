import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useWebSocket } from "./hooks/webSocketContext";
import { useEffect, useState } from "react";

const Room = () => {
    const navigate = useNavigate();
    const {roomId} = useParams();
    const {sendMessage} = useWebSocket();

    const [mainRoomId , setMainRoomId] = useState<number | null>(null)

    
    
    

    useEffect(()=>{
        
        
        if(roomId){
            const NroomId = parseInt(roomId)
            if(!isNaN(NroomId)){
                setMainRoomId(NroomId)
            }
        }else{
            // localStorage.setItem("joinRoomId",roomId?.toString())
            const localRoomId = localStorage.getItem("joinRoomId");
            if(localRoomId){
                const Nlocal = parseInt(localRoomId);
                if(!isNaN(Nlocal)){
                    setMainRoomId(Nlocal)
                }
            }

        }
    },[roomId])
  

    useEffect(()=>{
      
        if(mainRoomId !== null){
            localStorage.setItem("joinRoomId",mainRoomId.toString())

            sendMessage({event:"joinRoom",roomId: mainRoomId})
        }

    },[mainRoomId,sendMessage])
   
    const leaveRoom = ()=>{
        sendMessage({event:"leaveRoom"})
        localStorage.removeItem("joinRoomId")
        navigate("/")
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen">

            <h2 className="text-2xl mb-4">Room ID: {mainRoomId}</h2>
            <Button text="Leave Room" variant="primary" onClick={leaveRoom} />

        </div>
    );
};

export default Room;

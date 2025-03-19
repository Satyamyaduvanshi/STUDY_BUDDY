import { Button } from "./ui/button"
import { useWebSocket } from "./hooks/useWebSocket"


const Room = (roomid:number)=>{

    const {sendMessage,rooms} = useWebSocket()

    const leaveRoom = () => {
        sendMessage({ event: "leaveRoom" });
    };

    return(
        <div>

                <div>
                    <Button text="Leave Room" variant="primary" onClick={()=>( leaveRoom())} />
                </div>
            
        </div>
    )



}

export default Room
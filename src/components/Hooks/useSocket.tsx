import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (uri: string): Socket => {
    const { current: socket } = useRef(io(uri))
    useEffect(() => {
        return () => {
            if (socket) socket.close()
        }
    }, [socket])

    return socket
}
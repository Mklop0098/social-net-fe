import { createContext, PropsWithChildren, useContext } from "react";
import { SocketIoHookReturn } from "../../type";
import { host } from '../../api/ultils'
import { io } from "socket.io-client";

export const SocketIoContext = createContext<SocketIoHookReturn>({} as SocketIoHookReturn);


export const useSocket = (): SocketIoHookReturn => {
    return useContext(SocketIoContext);
};


export const SocketIoContextProvider: React.FC<PropsWithChildren> = (props) => {

    const socket = io(host)

    return (
        <SocketIoContext.Provider value={{ socket }}>
            {props.children}
        </SocketIoContext.Provider>
    );
}
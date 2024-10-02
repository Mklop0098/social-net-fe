import { createContext, PropsWithChildren, useContext, useState } from "react";
import { NotifyHookReturn, NotifyType } from "../../type";


export const NotifyContext = createContext<NotifyHookReturn>({} as NotifyHookReturn);


export const useNotify = (): NotifyHookReturn => {
    return useContext(NotifyContext);
};


export const NotifyContextProvider: React.FC<PropsWithChildren> = (props) => {

    const [notifies, setNotifies] = useState<NotifyType[]>([])

    const setNotifiesList = (notifies: NotifyType[]) => {
        setNotifies(notifies)
    }

    return (
        <NotifyContext.Provider value={{ notifies, setNotifiesList }}>
            {props.children}
        </NotifyContext.Provider>
    );
}
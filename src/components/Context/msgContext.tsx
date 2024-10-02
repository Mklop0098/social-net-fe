import { PropsWithChildren, createContext, useContext, useState } from 'react';
import { ChatListType, MsgHookReturn } from '../../type';

export const MsgContext = createContext<MsgHookReturn>({} as MsgHookReturn);


export const useMsg = (): MsgHookReturn => {
    return useContext(MsgContext);
};


export const MsgContextProvider: React.FC<PropsWithChildren> = (props) => {
    const [activeChatList, setActiveChatList] = useState<ChatListType[]>([]);
    const [minimizeChatBoxList, setMinimizeChatBoxList] = useState<ChatListType[]>([]);
    const [newMessage, setNewMessage] = useState<boolean>(false)

    const addChatList = (userId: string) => {
        const user = activeChatList.find(user => user.userId === userId)
        if (!user) {

            if (activeChatList.length < 3) {
                const minimizeUser = minimizeChatBoxList.find(user => user.userId === userId)
                if (minimizeUser) {
                    setMinimizeChatBoxList(minimizeChatBoxList.filter(user => user.userId !== userId))
                }
                setActiveChatList([...activeChatList, { userId }])

            }
            else {
                const minimizeUser = minimizeChatBoxList.find(user => user.userId === userId)
                if (!minimizeUser) {
                    setMinimizeChatBoxList([...minimizeChatBoxList, activeChatList[2]])
                }
                else {
                    setMinimizeChatBoxList([...minimizeChatBoxList.filter(user => user.userId !== userId), activeChatList[2]])
                }
                setActiveChatList(activeChatList => {
                    const newActiveChatList = JSON.parse(JSON.stringify(activeChatList))
                    newActiveChatList.splice(2, 1)
                    newActiveChatList.splice(0, 0, { userId })
                    return newActiveChatList
                })
            }
        }
    }

    const minimizeChatBox = (userId: string) => {
        const user = activeChatList.find(user => user.userId === userId)
        if (user) {
            setActiveChatList(activeChatList.filter(user => user.userId !== userId))
            setMinimizeChatBoxList([...minimizeChatBoxList, { userId }])
        }
        return
    }

    const removeChatBox = (userId: string, state: 'active' | 'minimize') => {
        if (state === 'active') {
            setActiveChatList(activeChatList.filter(user => user.userId !== userId))
        }
        else {
            setMinimizeChatBoxList(minimizeChatBoxList.filter(user => user.userId !== userId))
        }
    }


    return (
        <MsgContext.Provider value={{ activeChatList, minimizeChatBoxList, newMessage, setNewMessage, addChatList, minimizeChatBox, removeChatBox }}>
            {props.children}
        </MsgContext.Provider>
    );
};
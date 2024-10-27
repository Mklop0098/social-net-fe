import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { FriendArrayType, FriendHookReturn } from "../../type";
import { getFriendData } from "../../api/userAPI/useFriend";
import { useUser } from "./userContext";
import { useSocket } from '../Context/socketIOContext'

export const FriendContext = createContext<FriendHookReturn>({} as FriendHookReturn);


export const useFriend = (): FriendHookReturn => {
    return useContext(FriendContext);
};


export const FriendContextProvider: React.FC<PropsWithChildren> = (props) => {

    const [requestList, setRequestList] = useState<FriendArrayType[]>([])
    const [friendList, setFriendList] = useState<FriendArrayType[]>([])
    const [friendLoading, setFriendLoading] = useState(true)
    const { socket } = useSocket()
    const [onlineFriends, setOnlineFriends] = useState<string[]>([])

    const { currentUser } = useUser()

    useEffect(() => {

        if (socket) {
            if (currentUser && socket) {
                socket.emit("add-user", currentUser._id)
            }

            socket?.on("onlineUser", (updatedOnlineUsers) => {
                console.log(updatedOnlineUsers)
                setOnlineFriends(updatedOnlineUsers)
            });

            socket?.on("addUserOnline", (updatedOnlineUsers) => {
                console.log(updatedOnlineUsers)
                setOnlineFriends(updatedOnlineUsers)
            });

            socket?.on("userOffline", (updatedOnlineUsers) => {
                console.log(updatedOnlineUsers)
                setOnlineFriends(updatedOnlineUsers)
            });
        }

    }, [socket])



    const resetFriendContext = () => {
        setFriendList([])
        setRequestList([])
    }

    const addOnlineFriend = (friend: string) => {
        console.log(onlineFriends, friend)
        setOnlineFriends([...onlineFriends, friend])
    }

    const removeOnlineFriend = (friend: string) => {
        console.log(onlineFriends, friend)
        setOnlineFriends(onlineFriends.filter(f => f !== friend))
    }

    useEffect(() => {
        if (currentUser) {
            const getFriendList = async (userId: string) => {
                const res = await getFriendData(userId)
                if (res.data.status) {
                    const requestList: FriendArrayType[] = res.data.friendData[0].requestList
                    const friendList: FriendArrayType[] = res.data.friendData[0].friendList
                    setRequestList(requestList)
                    setFriendList(friendList)
                }
                setFriendLoading(false)
            }
            getFriendList(currentUser._id)
        }
    }, [currentUser])

    return (
        <FriendContext.Provider value={{ friendList, requestList, friendLoading, onlineFriends, setOnlineFriends, resetFriendContext, addOnlineFriend, removeOnlineFriend }}>
            {props.children}
        </FriendContext.Provider>
    );
}
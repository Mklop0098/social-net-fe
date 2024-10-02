import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { FriendArrayType, FriendHookReturn } from "../../type";
import { getFriendData } from "../../api/userAPI/useFriend";
import { useUser } from "./userContext";


export const FriendContext = createContext<FriendHookReturn>({} as FriendHookReturn);


export const useFriend = (): FriendHookReturn => {
    return useContext(FriendContext);
};


export const FriendContextProvider: React.FC<PropsWithChildren> = (props) => {

    const [requestList, setRequestList] = useState<FriendArrayType[]>([])
    const [friendList, setFriendList] = useState<FriendArrayType[]>([])

    const { currentUser } = useUser()

    const resetFriendContext = () => {
        setFriendList([])
        setRequestList([])
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
            }
            getFriendList(currentUser._id)
        }
    }, [currentUser])

    return (
        <FriendContext.Provider value={{ friendList, requestList, resetFriendContext }}>
            {props.children}
        </FriendContext.Provider>
    );
}
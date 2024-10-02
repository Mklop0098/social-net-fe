import React, { useEffect, useState } from "react"
import { useMsg } from "./Context/msgContext"
import { ChatListType, UserType } from "../type"
import { IoMdClose } from "react-icons/io"
import { getUser } from "../api/userAPI/userAuth"

type ChatBoxProps = {
    user: ChatListType
}

const MiniChatBox: React.FC<ChatBoxProps> = (props) => {

    const { user } = props
    const { addChatList, removeChatBox } = useMsg()

    const [currentFriend, setCurrentFriend] = useState<UserType>({} as UserType)

    useEffect(() => {
        const getCurrentFriend = async () => {
            const res = await getUser(user.userId)
            if (res.data.status) {
                setCurrentFriend(res.data.userData[0])
            }
        }
        getCurrentFriend()
    }, [user.userId])


    return (
        <div className="w-14 h-14 bg-gray-200 rounded-full mt-4 relative group cursor-pointer"
            style={{ backgroundImage: `url(${currentFriend.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
        >

            <div className="h-full flex items-center justify-center" onClick={() => addChatList(user.userId)}>
                {/* {user.userId.slice(0, 6)} */}
            </div>
            <div
                onClick={() => removeChatBox(user.userId, 'minimize')}
                className="w-5 h-5 bg-gray-400 rounded-full absolute z-100 top-0 right-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
            >
                <IoMdClose size={14} color="white" />
            </div>
        </div>
    )
}

export default MiniChatBox

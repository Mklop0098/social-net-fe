import React, { useState, useEffect } from 'react'
import { AiFillLike } from 'react-icons/ai'
import { IoSend } from 'react-icons/io5'
import { MessageReturnType } from '../type'
import { useUser } from './Context/userContext'
import { useSocket } from './Context/socketIOContext'
import { SendMessage } from '../api/userAPI/useMessage'

type ChatInputProps = {
    messages: MessageReturnType[]
    setMessages: (mess: MessageReturnType[]) => void
    friendId: string
}

const ChatInput: React.FC<ChatInputProps> = (props) => {

    const { messages, setMessages, friendId } = props

    const [msg, setMsg] = useState<string>("")
    const { currentUser } = useUser()

    const { socket } = useSocket()

    const handleSubmit = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
        e.preventDefault()
        if (msg.length > 0) {
            socket?.emit("send-msg", {
                to: friendId,
                from: currentUser._id,
                msg,
            });
            setMsg("")

            await SendMessage(currentUser._id, friendId, msg)
            const msgs = [...messages];
            msgs.push({ fromSelf: true, message: msg });
            setMessages(msgs);
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMsg(e.target.value)
        socket?.emit("on-typing", {
            to: friendId,
            from: currentUser._id,
            state: e.target.value.length > 0
        });
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            socket?.emit("on-typing", {
                to: friendId,
                from: currentUser._id,
                state: ""
            });
        }, 1000)
        return () => clearTimeout(handler)
    }, [msg])

    return (
        <div className=" h-[50px] flex flex-row items-center px-2 justify-between mt-2">
            <div className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer ">
                <AiFillLike className='text-blue-500' size={24} />
            </div>
            <div>
                <input type="text" className="focus:outline-none bg-gray-100 py-1 px-4 rounded-full" value={msg} onChange={handleChange} />
            </div>
            <div className="flex items-center justify-center ">
                <IoSend size={20} className="text-blue-500 cursor-pointer" onClick={e => handleSubmit(e)} />
            </div>
        </div>
    )
}

export default ChatInput

import React, { useEffect, useState } from "react";
import { FaWindowMinimize } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { ChatListType, MessageReturnType, UserType } from "../../type";
import { useMsg } from "../Context/msgContext";
import { useSocket } from "../Context/socketIOContext";
import { getUser } from "../../api/userAPI/userAuth";
import ChatInput from "./ChatInput";
import MessageBox from "./MessageBox";
import { useUser } from "../Context/userContext";
import { GetAllMessage } from "../../api/userAPI/useMessage";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

type ChatBoxProps = {
    user: ChatListType;
};

export type TypingType = {
    from: string;
    to: string;
    state: boolean;
};

const ChatBox: React.FC<ChatBoxProps> = (props) => {
    const { user } = props;
    const { minimizeChatBox, removeChatBox } = useMsg();
    const [currentFriend, setCurrentFriend] = useState<UserType>({} as UserType);
    const { currentUser } = useUser();
    const [messages, setMessages] = useState<MessageReturnType[]>([]);

    const { socket } = useSocket();
    const [arrivalMessage, setArrivalMessage] = useState<MessageReturnType>(
        {} as MessageReturnType
    );
    const [isTyping, setIsTyping] = useState<TypingType>({} as TypingType);

    useEffect(() => {
        socket?.on(
            "msg-receive",
            (data: { from: string; to: string; msg: { text: string, imgs: string[] } }) => {
                if (data.from === user.userId) {
                    setArrivalMessage({ fromSelf: false, message: data.msg.text, imgs: data.msg.imgs });
                }
            }
        );

        socket?.on("typing-render", (data: TypingType) => {
            setIsTyping(data);
        });

        socket?.on("typing-stop", () => {
            setIsTyping({} as TypingType);
        });
    }, []);

    useEffect(() => {
        const getCurrentFriend = async () => {
            const res = await getUser(user.userId);
            if (res.data.status) {
                setCurrentFriend(res.data.userData[0]);
            }
        };
        getCurrentFriend();
    }, [user.userId]);

    useEffect(() => {
        if (arrivalMessage) {
            setMessages([...messages, arrivalMessage]);
        }
    }, [arrivalMessage]);

    useEffect(() => {
        if (currentUser) {
            socket?.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        const getMessage = async () => {
            const res = await GetAllMessage(currentUser._id, currentFriend._id);
            if (res.data.status) {
                console.log(res.data)

                setMessages(res.data.projectedMessages);
            }
        };
        getMessage();
    }, [currentFriend]);

    return (
        <div className="w-[320px] h-full mx-2 bg-white shadow-2xl rounded-lg flex flex-col">
            <div className="p-2 flex flex-row items-center justify-between rounded-lg rounded-b-none shadow-md">
                {currentFriend._id ? (
                    <div className="flex flex-row items-center">
                        <div
                            className="w-10 h-10 bg-blue-200 rounded-full mr-2"
                            style={{
                                backgroundImage: `url(${currentFriend.avatar})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                            }}
                        ></div>
                        <div className="flex flex-col">
                            <span>
                                {currentFriend.firstName + " " + currentFriend.lastName}
                            </span>
                        </div>
                    </div>
                ) : (
                    <Stack>
                        <div className="flex flex-row items-center">
                            <Skeleton variant="circular" width={40} height={40} />
                            <div className="flex flex-col ml-2">
                                <Skeleton variant="text" width={120} height={30} />
                            </div>
                        </div>
                    </Stack>
                )}
                <div className="flex flex-row items-center">
                    <div
                        className="mr-2 cursor-pointer"
                        onClick={() => minimizeChatBox(user.userId)}
                    >
                        <FaWindowMinimize />
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => removeChatBox(user.userId, "active")}
                    >
                        <IoMdClose size={22} />
                    </div>
                </div>
            </div>

            <MessageBox
                messages={messages}
                friendId={currentFriend._id}
                isTyping={isTyping}
            />

            <ChatInput
                friendId={currentFriend._id}
                messages={messages}
                setMessages={setMessages}
            />
        </div>
    );
};

export default ChatBox;

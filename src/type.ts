import { Socket } from "socket.io-client"
import {ReactNode} from 'react'

export type IconType = {
    fill: boolean,
    fillColor: string
    size: number
}

export type RegisterInputType = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPass: string
}

export type LoginInputType = {
    email: string,
    password: string,
}

export type ToastType = {
    open: boolean,
    msg: string
}

export type MsgHookReturn = {
    activeChatList: ChatListType[]
    newMessage: boolean
    minimizeChatBoxList: ChatListType[]
    isReply: string,
    setIsReply: (reply: string) => void
    addChatList: (userId: string) => void
    minimizeChatBox: (userId: string) => void
    removeChatBox: (userId: string, state: 'active' | 'minimize') => void
    setNewMessage: (newMessage: boolean) => void
}

export type ChatListType = {
    userId: string,
}

export type UserHookReturn = {
    currentUser: UserType
    updateCurrentUser: (currentUser: UserType) => void
}

export type NotifyHookReturn = {
    notifies: NotifyType[],
    setNotifiesList: (notifies: NotifyType[]) => void
}

export type FriendHookReturn = {
    friendList: FriendArrayType[],
    requestList: FriendArrayType[],
    friendLoading: boolean,
    onlineFriends: string[],
    setOnlineFriends: (list: string[]) => void
    resetFriendContext: () => void,
    addOnlineFriend: (friend: string) => void
    removeOnlineFriend: (friend: string) => void
}

export type NotifyType = {
    notifyMsg: string,
    type: string,
    createAt: Date,
    readed: boolean
    from: string
}

export type UserType = {
    avatar: string,
    backgroundImage: string,
    firstName: string,
    lastName: string,
    email: string,
    _id: string
}

export type FriendArrayType = {
    friendId: string
}

export type MessageReturnType = {
    fromSelf: boolean
    message: string
    imgs: string[]

}

export type SocketIoHookReturn = {
    socket: Socket | undefined
}

export type ModalContextProviderReturn = {
    showModal: (modal: ModalType) => void,
    hideModal: () => void,
};

export type ModalType = {
    body: ReactNode,
    toggle: boolean,
    width?: number,
    height?: number,
    root?: string,
    onClick?: <T>(args?: T) => void
};


export type ReactType = {
    userId: string
}

export type CommentType = {
    _id: string;
    child: CommentType[];
    parents: string[];
    userId: string;
    comment: string;
    createAt: Date;
}

export type ShareType = {
    userId: string,
    createAt: Date,
    comment: string
}

export type PostListType = {

    comments: CommentType[],
    createAt: Date,
    imgaes: string[],
    likes: ReactType[],
    owner: string,
    posts: string,
    shared: ShareType[],
    _id: string
}

export type StoryType = {
    link: string,
    createAt: Date,
    background: string,
    likes: ReactType[],
    owner: string,
    story: string,
    _id: string
}

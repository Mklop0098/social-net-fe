import { useUser } from "../Context/userContext"
import { UserType, CommentType, PostListType } from "../../type";
import { useEffect, useState } from "react";
import { getAllUser } from "../../api/userAPI/userAuth";
import { timeAgo } from "../../ultils";
import { useSocket } from "../Context/socketIOContext";
import { useMsg } from '../Context/msgContext'
import { ImFilePicture } from "react-icons/im";
import { IoMdSend } from "react-icons/io";
import './style.css'

type ShowCommentProps = {
    comment: CommentType
    post: PostListType
    parents: string[]
    onChange: (value: string) => void
    onSubmit: (parents: string[]) => Promise<void>
}

export const ShowComment: React.FC<ShowCommentProps> = (props) => {

    const { comment, post, parents, onChange, onSubmit } = props

    const { currentUser } = useUser()
    const [users, setUsers] = useState<UserType[]>([])
    const { socket } = useSocket()
    const { isReply, setIsReply } = useMsg()
    const [showAll, setShowAll] = useState(false)

    const getCurrentFriend = (userId: string) => {
        const test = users.find(user => user._id === userId)
        if (test) {
            return test?.firstName + ' ' + test?.lastName
        }
        return ''
    }

    const getUserData = (userId: string) => {
        const test = users.find(user => user._id === userId)

        if (test) {
            return test
        }

        return {} as UserType
    }

    useEffect(() => {
        if (currentUser && socket) {
            socket.emit("add-user", currentUser._id)
        }
        if (currentUser._id) {
            const getAllUserInfo = async () => {
                const res = await getAllUser(currentUser._id)
                if (res.data.status) {
                    setUsers(res.data.users)
                }
            }
            getAllUserInfo()
        }
    }, [currentUser])

    useEffect(() => {
        if (currentUser._id) {
            const getAllUserInfo = async () => {
                const res = await getAllUser(currentUser._id)
                if (res.data.status) {
                    setUsers(res.data.users)
                }
            }
            getAllUserInfo()
        }
    }, [currentUser])

    return (
        <div className="relative overflow-hidden">
            <div className="comment-before"></div>
            <div className="flex flex-row items-start mt-4 ">
                <div className="w-8 h-8 bg-blue-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${comment.userId !== currentUser._id ? getUserData(comment.userId).avatar : currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                </div>
                <div className="ml-4 flex-1">
                    <div className="bg-gray-100 rounded-xl flex w-fit flex-col py-1 px-3 text-md">
                        <div className="flex flex-row items-center">
                            <div
                                className="font-semibold text-sm">
                                {getCurrentFriend(comment.userId) !== '' ? getCurrentFriend(comment.userId) : currentUser.firstName + " " + currentUser.lastName}
                            </div>
                            {
                                comment.userId === post.owner && <div className="pl-4 text-sm text-blue-500">Tác giả</div>
                            }
                        </div>
                        <p>{comment.comment}</p>
                    </div>
                    <div className="flex flex-row">
                        <p className="text-sm mt-1 ml-2.5 text-gray-500">{timeAgo(comment.createAt)}</p>
                        <button className="text-sm mt-1 ml-2.5 text-gray-500" onClick={() => setIsReply(comment._id)}>Reply</button>
                    </div>
                    {
                        comment.child.length > 0 && (
                            showAll ?
                                comment.child.length > 0 && comment.child.map((child, key) => (
                                    <ShowComment comment={child} post={post} key={key} parents={[...parents, child._id]} onChange={onChange} onSubmit={onSubmit} />
                                ))
                                :
                                <div onClick={() => setShowAll(true)}>
                                    xem {comment.child.length} câu trả lời
                                </div>
                        )
                    }
                    {
                        isReply === comment._id && <div className="flex flex-row items-start mt-4">
                            <div className="w-8 h-8 bg-blue-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                            </div>
                            <div className="ml-2 flex-1">
                                <div className="bg-gray-100 rounded-xl flex w-fit flex-col py-2 px-4 text-md w-full flex flex-col ">
                                    <input type="text" className="outline-none bg-transparent" placeholder={JSON.stringify(parents)} onChange={e => onChange(e.target.value)} />
                                    <div className="py-3 flex justify-between">
                                        <div>
                                            <ImFilePicture className="text-gray-500" />
                                        </div>
                                        <button onClick={() => {
                                            onSubmit(parents)
                                            setIsReply('')
                                            setShowAll(true)
                                        }}>
                                            <IoMdSend />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
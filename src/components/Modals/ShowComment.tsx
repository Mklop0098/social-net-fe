import { useUser } from "../Context/userContext"
import { UserType, CommentType, PostListType } from "../../type";
import { useEffect, useState } from "react";
import { timeAgo } from "../../ultils";
import { useSocket } from "../Context/socketIOContext";
import { useMsg } from '../Context/msgContext'
import { ImFilePicture } from "react-icons/im";
import { IoMdSend } from "react-icons/io";
import { getUser } from '../../api/userAPI/userAuth'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
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
    const [owner, setOwner] = useState<UserType>({} as UserType)
    const { socket } = useSocket()
    const { isReply, setIsReply } = useMsg()
    const [showAll, setShowAll] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getOwner = async () => {
            const res = await getUser(comment.userId)
            if (res.data.status) {
                setOwner(res.data.userData[0])
                setLoading(false)
            }
        }
        getOwner()
    }, [comment])

    useEffect(() => {
        if (currentUser && socket) {
            socket.emit("add-user", currentUser._id)
        }
    }, [currentUser])


    if (loading) {
        return (
            <Stack>
                <div className="flex flex-row items-center my-1">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" className="w-[70%] ml-4" height={60} />
                </div>
            </Stack>
        )
    }

    return (
        <div className="relative overflow-hidden">
            <div className="comment-before"></div>
            <div className="flex flex-row items-start mt-4 ">
                <div className="w-8 h-8 bg-blue-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${owner.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                </div>
                <div className="ml-4 flex-1">
                    <div className="bg-gray-100 rounded-xl flex w-fit flex-col py-1 px-3 text-md">
                        <div className="flex flex-row items-center">
                            <div
                                className="font-semibold text-sm">
                                {owner.firstName + " " + owner.lastName}
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
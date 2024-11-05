import { IoMdClose } from "react-icons/io";
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { VscComment } from "react-icons/vsc";
import { FaEarthAsia } from "react-icons/fa6";
import { PiShareFatLight } from "react-icons/pi";
import { BsDot } from "react-icons/bs";
import { IoSend } from 'react-icons/io5'

import { useUser } from '../../components/Context/userContext'
import { useSocket } from "../../components/Context/socketIOContext";
import { useModal } from "../../components/Context/modalContext";
import { useFriend } from '../../components/Context/friendContext'
import { usePost } from '../../components/Context/postContext'

import { Divider } from "@mui/material";
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useEffect, useState, useRef } from "react";

import { ShowComment } from '../../components/Modals/ShowComment';
import { ShareModal } from '../../components/Modals/ShareModal'

import { ModalType, PostListType, ReactType, CommentType, UserType, ToastType } from "../../type";
import { timeAgo } from "../../ultils";

import { addRequestList } from "../../api/userAPI/useFriend";
import { createNotify } from "../../api/userAPI/userNotify"
import { getPostById } from '../../api/userAPI/usePost'
import { getUser } from '../../api/userAPI/userAuth'

import './style.css'

type PostProps = {
    post: PostListType
    setToast: (toast: ToastType) => void
}

type PostCaculate = {
    comments: {
        userId: string;
        comment: string;
        createAt: Date
    }[];
    likes: ReactType[];
    shared: ReactType[];
}

const Post: React.FC<PostProps> = (props) => {

    const [expand, setExpand] = useState(false)
    const { post, setToast } = props
    const { socket } = useSocket()
    const { currentUser } = useUser()
    const [currentPost, setCurrentPost] = useState<PostCaculate>({} as PostCaculate)
    const { showModal } = useModal()
    const { friendList } = useFriend()
    const [reply, setReply] = useState("")
    const [value, setValue] = useState("")
    const [postData, setPostData] = useState<PostListType>({} as PostListType)
    const { handleLikePost, handleComment } = usePost()
    const [owner, setOwner] = useState<UserType>({} as UserType)
    const [loading, setLoading] = useState(true)
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const getPost = async () => {
            const res = await getPostById(post._id)
            if (res.status) {
                setPostData(res.data.post[0])
            }
        }
        getPost()
    }, [])

    useEffect(() => {
        setCurrentPost({ comments: post.comments, likes: post.likes, shared: post.shared })
    }, [postData])

    useEffect(() => {
        if (currentUser && socket) {
            socket.emit("add-user", currentUser._id)
        }
    }, [currentUser])


    const convertToNested = (comments: CommentType[]) => {
        const res: CommentType[] = []
        const addChildToComment = (comments: CommentType[], parents: string[], newChild: CommentType): boolean => {
            for (const comment of comments) {
                if (
                    comment.parents.length === parents.length &&
                    comment.parents.every((parent, index) => parent === parents[index])
                ) {
                    comment.child.push(newChild);
                    return true;
                }

                if (addChildToComment(comment.child, parents, newChild)) {
                    return true;
                }
            }
            return false;
        };
        if (comments.length > 0) {
            comments.map(comment => {
                if (comment.parents.length === 1) {
                    res.push(comment)
                }
                else if (comment.parents.length > 1) {
                    const tmp: string[] = JSON.parse(JSON.stringify(comment.parents))
                    tmp.pop()
                    addChildToComment(res, tmp, comment);
                }
            })
        }
        return res
    }

    const handleShare = () => {
        const test: ModalType = {
            toggle: true,
            root: 'modal-root',
            width: 36,
            height: 90,
            body: <ShareModal post={post} setToast={setToast} />,
        }
        showModal(test);
    }

    const checkFriend = (id: string) => {
        const isFriend = friendList.find(friend => friend.friendId === id)
        return !!isFriend
    }

    const handleSendRequest = async (friendId: string) => {
        const res = await createNotify(friendId, `${currentUser.firstName + " " + currentUser.lastName} đã gửi đến bạn một lời mời kết bạn`, 'friendRequest', currentUser._id)
        await addRequestList(friendId, currentUser._id)
        setToast({ open: true, msg: res.data.msg })
    }

    useEffect(() => {
        const getUserById = async () => {
            const res = await getUser(post.owner)
            if (res.data.status) {
                setOwner(res.data.userData[0])
                setLoading(false)
            }
        }
        const getPost = async () => {
            const res = await getPostById(post._id)
            if (res.status) {
                setPostData(res.data.post[0])
            }
        }
        getUserById()
        getPost()
    }, [])

    useEffect(() => {
        setCurrentPost({ comments: postData.comments, likes: postData.likes, shared: postData.shared })
    }, [postData])

    useEffect(() => {
        if (currentUser && socket) {
            socket.emit("add-user", currentUser._id)
        }
    }, [currentUser])

    const handleLike = async () => {
        handleLikePost(post)
        const liked = currentPost.likes.find(user => user.userId === currentUser._id)
        if (liked) {
            setCurrentPost(currentPost => {
                const likes = currentPost.likes.filter(like => like.userId !== currentUser._id)
                currentPost.likes = likes
                const newPost = JSON.parse(JSON.stringify(currentPost))
                return newPost
            })
        }
        else {
            setCurrentPost(currentPost => {
                currentPost.likes.push({ userId: currentUser._id })
                const newPost = JSON.parse(JSON.stringify(currentPost))
                return newPost
            })
        }

    }

    const likeInclude = () => {
        if (currentPost.likes?.find(user => user.userId === currentUser._id)) {
            return true
        }

        return false
    }

    const handleCommentPost = async (parents?: string[]) => {
        if (value !== '') {
            const res = await handleComment(post, value, parents)
            if (res.data.status) {
                setPostData(res.data.result[0])
            }
            setValue("")
        }
    }

    const handleReply = async (parents?: string[]) => {
        if (reply !== '') {
            const res = await handleComment(post, reply, parents)
            if (res.data.status) {
                setPostData(res.data.result[0])
            }
            setReply("")
        }
    }

    const checkContentHeight = () => {
        if (ref.current && ref.current.clientHeight > 100) {
            return true
        }
        return false
    }


    return (
        <div className="flex flex-col bg-white max-h-[86vh]">
            <div className="flex flex-row justify-between items-center p-4">
                {
                    loading ? <Stack>
                        <div className="flex flex-col justify-center">
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row items-center">
                                    <Skeleton variant="circular" width={50} height={50} />
                                    <div className="pl-3">
                                        <Skeleton variant="text" width={100} />
                                        <div className="flex flex-row items-center">
                                            <Skeleton variant="text" width={100} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Stack> :
                        <>
                            <div className="flex flex-row items-center ">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${owner.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                </div>
                                <div className="pl-3">
                                    <div className='font-semibold flex flex-row w-full justify-between'>
                                        <div>
                                            {
                                                owner.firstName + ' ' + owner.lastName
                                            }
                                        </div>
                                        <div>
                                            {
                                                (!checkFriend(post.owner) && currentUser._id !== post.owner) &&
                                                <button
                                                    onClick={() => handleSendRequest(post.owner)}
                                                    className="text-blue-500 ml-4 font-medium flex flex-row items-center"
                                                >
                                                    <BsDot />
                                                    <span>Thêm bạn bè</span>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center">
                                        <div className="text-gray-500 text-sm pr-1">
                                            {timeAgo(post.createAt) + ' ago'}
                                        </div>
                                        <FaEarthAsia size={14} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 rounded-full hover:bg-gray-200">
                                <IoMdClose size={20} />
                            </div>
                        </>
                }
            </div>
            <div>
                <div className={` px-4 ${!expand && 'max-h-[120px]'}  overflow-hidden mb-4`} ref={ref}>
                    <div>
                        {post.posts}
                    </div>
                </div>
                <span className={`${!checkContentHeight() && 'hidden'} mx-4 cursor-pointer font-medium`} onClick={() => setExpand(!expand)}>{expand ? 'ẩn bớt' : '... xem thêm'}</span>

            </div>
            <div className="flex flex-col p-4 pb-2">
                <div className="flex flex-row justify-between pb-4">
                    <div className="flex flex-row items-center">
                        <div className="p-1 bg-blue-500 rounded-full">
                            <AiFillLike className="text-white" size={12} />
                        </div>
                        <p className="pl-2 text-gray-500">{currentPost.likes?.length}</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="flex flex-row items-center text-gray-500">
                            <p className="pr-1">{currentPost.comments?.length}</p>
                            <p className="text-sm ">bình luận</p>
                        </div>
                        <div className="flex flex-row items-center text-gray-500 pl-4">
                            <p className="pr-1">{currentPost.shared?.length}</p>
                            <p className="text-sm ">lượt chia sẻ</p>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className={`grid grid-cols-${currentUser._id !== post.owner ? 3 : 2} gap-4 pt-2 pb-2`}>
                    <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer" onClick={() => handleLike()}>
                        {
                            likeInclude() ? <AiFillLike size={24} className="text-blue-500" /> :
                                <AiOutlineLike size={24} />
                        }
                        <p className={`${likeInclude() && 'text-blue-500'} font-semibold pl-2`}>Thích</p>
                    </div>
                    <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer">

                        <VscComment size={24} />
                        <p className="font-semibold pl-2">Bình luận</p>
                    </div>
                    {
                        currentUser._id !== post.owner &&
                        <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer" onClick={handleShare}>
                            <PiShareFatLight size={24} />
                            <p className="font-semibold pl-2">Chia sẻ</p>
                        </div>
                    }
                </div>
                <Divider />
                <div className="flex flex-col pb-2 my-4">
                    {
                        postData.comments && convertToNested(JSON.parse(JSON.stringify(postData.comments))).map((com, key) => (
                            <ShowComment comment={com} post={post} key={key} parents={[com._id]} onChange={setReply} onSubmit={handleReply} />
                        ))
                    }
                </div>
            </div>
            <div className="flex flex-row p-4 items-center shadow-md absolute bottom-0 w-full">
                <div className="w-12 h-12 bg-blue-200 rounded-full overflow-hidden cursor-pointer" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                </div>
                <div className="flex-1 bg-gray-100 ml-4 rounded-lg flex flex-row">
                    <TextareaAutosize
                        maxRows={3}
                        className="w-full outline-none bg-gray-100 p-4 rounded-lg"
                        placeholder="Viết bình luận"
                        onChange={e => setValue(e.target.value)}
                        value={value}
                    />
                </div>
                <div className="pl-3 cursor-pointer" onClick={() => handleCommentPost()}>
                    <IoSend className="text-gray-500" />
                </div>
            </div>

        </div >
    )
}

export default Post
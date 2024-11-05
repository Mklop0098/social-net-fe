import { useUser } from "../Context/userContext"
import { Divider } from "@mui/material"
import { useModal } from "../Context/modalContext"
import { IoMdClose } from "react-icons/io";
import { FaEarthAsia } from "react-icons/fa6";
import { PostListType, UserType, ReactType, CommentType } from "../../type";
import { useEffect, useState, useRef } from "react";
import { getUser } from "../../api/userAPI/userAuth";
import { timeAgo } from "../../ultils";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useSocket } from "../Context/socketIOContext";
import { VscComment } from "react-icons/vsc";
import { PiShareFatLight } from "react-icons/pi";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { IoSend } from 'react-icons/io5'
import { PostImages } from "../ImageHandler/PostImages";
import { getPostById } from '../../api/userAPI/usePost'
import { ShowComment } from './ShowComment';
import Skeletons from '../../components/Skeleton'
import { convertToNested } from '../../ultils'
import { usePost } from '../Context/postContext'
import './style.css'

type CommentModalProps = {
    post: PostListType;
}


type PostCaculate = {
    comments: CommentType[];
    likes: ReactType[];
    shared: ReactType[];
}


export const CommentModal: React.FC<CommentModalProps> = (props) => {

    const { post } = props
    const [expand, setExpand] = useState(false)
    const { currentUser } = useUser()
    const { hideModal } = useModal()
    const { socket } = useSocket()
    const [currentPost, setCurrentPost] = useState<PostCaculate>({} as PostCaculate)
    const [value, setValue] = useState("")
    const [reply, setReply] = useState("")
    const [postData, setPostData] = useState<PostListType>({} as PostListType)
    const [owner, setOwner] = useState<UserType>({} as UserType)
    const [loading, setLoading] = useState(true)
    const { handleLikePost, handleComment } = usePost()

    const ref = useRef<HTMLDivElement>(null)


    const handleClick = () => {
        hideModal()
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


    if (loading) {
        return (
            <div className="xs:w-full xs:max-w-[680px] max-h-[90%] h-fit flex flex-col justify-between m-auto top-0 left-0 bottom-0 right-0 absolute bg-white rounded-lg">
                <Skeletons />
            </div>
        )
    }

    return (
        <div className="xs:w-full xs:max-w-[680px] max-h-[90%] h-fit flex flex-col justify-between m-auto top-0 left-0 bottom-0 right-0 absolute bg-white rounded-lg">
            <div className=" flex flex-col" >
                <div className="flex flex-row relative items-center justify-center h-[4rem] mx-4">
                    <div className="font-bold text-xl">Bài viết của {owner.firstName + " " + owner.lastName}</div>
                    <div
                        className="absolute right-0 w-10 h-10 flex items-center justify-center hover:bg-gray-200 bg-gray-100 rounded-full"
                        onClick={handleClick}
                    >
                        <IoMdClose size={20} />
                    </div>
                </div>
                <Divider />
            </div>
            <div className="w-full max-h-[700px] overflow-y-auto flex flex-col justify-start">
                <div className="bg-white relative px-4">
                    <div className="py-3 flex flex-row items-center rounded-lg cursor-pointer">
                        <div className="w-10 h-10 bg-blue-200 rounded-full mr-4 overflow-hidden" style={{ backgroundImage: `url(${owner.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                        </div>
                        <div className="flex flex-col items-start">
                            <div className="font-semibold pb-1">{owner.firstName + " " + owner.lastName} </div>
                            <div className="flex flex-row items-center">
                                <FaEarthAsia />
                                <span className="text-sm ml-2">{timeAgo(post.createAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={` px-4 ${!expand && 'max-h-[120px]'}  overflow-hidden mb-4`} ref={ref}>
                        <div>
                            {post.posts}
                        </div>
                    </div>
                    <span className={`${!checkContentHeight() && 'hidden'} mx-4 cursor-pointer font-medium`} onClick={() => setExpand(!expand)}>{expand ? 'ẩn bớt' : '... xem thêm'}</span>
                    <div className="pt-4">
                        <PostImages srcs={post} />
                    </div>
                </div>
                <div className="flex flex-col p-4 pt-2">
                    <div className="flex flex-row justify-between pb-2 px-2">
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
                    <div className={`grid grid-cols-${currentUser._id !== post.owner ? 3 : 2} gap-4 `}>
                        <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer" onClick={handleLike}>
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
                            <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer">
                                <PiShareFatLight size={24} />
                                <p className="font-semibold pl-2">Chia sẻ</p>
                            </div>
                        }
                    </div>
                    <Divider />

                    <div className="flex flex-col pb-2 my-4">
                        {
                            postData.comments && convertToNested(JSON.parse(JSON.stringify(postData.comments))).map((com, key) => (
                                <ShowComment comment={com} post={postData} key={key} parents={[com._id]} onChange={setReply} onSubmit={handleReply} />
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-row p-4 items-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                <div className="w-12 h-12 bg-blue-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

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
                <div className="pl-3" onClick={() => handleCommentPost()}>
                    <IoSend className="text-gray-500" />
                </div>
            </div>
        </div>
    )
}

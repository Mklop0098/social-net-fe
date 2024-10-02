import { useUser } from "../components/Context/userContext"
import { Divider } from "@mui/material"
import { useModal } from "../components/Context/modalContext"
import { IoMdClose } from "react-icons/io";
import { FaEarthAsia } from "react-icons/fa6";
import { PostListType, UserType, ReactType } from "../type";
import { useEffect, useState } from "react";
import { getAllUser } from "../api/userAPI/userAuth";
import { timeAgo } from "../ultils";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useSocket } from "./Context/socketIOContext";
import { likePost, removeLikePost, commentPost } from '../api/userAPI/usePost'
import { createNotify } from "../api/userAPI/userNotify"
import { VscComment } from "react-icons/vsc";
import { PiShareFatLight } from "react-icons/pi";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { IoSend } from 'react-icons/io5'
import { Carousel } from '../components/Carousel'

type CommentModalProps = {
    post: PostListType
}

type PostCaculate = {
    comments: {
        userId: string;
        comment: string;
        createAt: Date;
    }[];
    likes: ReactType[];
    shared: ReactType[];
}

export const CommentModal: React.FC<CommentModalProps> = (props) => {

    const { post } = props
    const { currentUser } = useUser()
    const { hideModal } = useModal()
    const [users, setUsers] = useState<UserType[]>([])
    const { socket } = useSocket()
    const [currentPost, setCurrentPost] = useState<PostCaculate>({} as PostCaculate)
    const [value, setValue] = useState("")

    const handleClick = () => {
        hideModal()
    }

    useEffect(() => {
        setCurrentPost({ comments: post.comments, likes: post.likes, shared: post.shared })
    }, [])

    const getCurrentFriend = (userId: string) => {
        const test = users.find(user => user._id === userId)
        if (test) {
            return test?.firstName + ' ' + test?.lastName
        }
        return ''
    }

    const getUserData = (userId: string) => {
        const test = users.find(user => user._id === userId)

        console.log(test)
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

    const handleLikePost = async () => {
        const liked = currentPost.likes.find(user => user.userId === currentUser._id)
        if (liked) {
            await removeLikePost(currentUser._id, post._id)
            setCurrentPost(currentPost => {
                const likes = currentPost.likes.filter(like => like.userId !== currentUser._id)
                currentPost.likes = likes
                const newPost = JSON.parse(JSON.stringify(currentPost))
                return newPost
            })
        }
        else {
            if (currentUser._id !== post.owner) {
                await createNotify(post.owner, `${currentUser.firstName + " " + currentUser.lastName} đã thích một bài viết của bạn`, 'friendRequest', currentUser._id)
            }

            socket?.emit("like-post", {
                userId: currentUser._id,
                owner: post.owner,
                postId: post._id
            });
            await likePost(currentUser._id, post._id)
            setCurrentPost(currentPost => {
                currentPost.likes.push({ userId: currentUser._id })
                const newPost = JSON.parse(JSON.stringify(currentPost))
                console.log(newPost)
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

    const handleComment = async () => {
        if (value !== '') {
            if (currentUser._id !== post.owner) {
                await createNotify(post.owner, `${currentUser.firstName + " " + currentUser.lastName} đã bình luận một bài viết của bạn`, 'comment', currentUser._id)
            }
            socket?.emit("comment-post", {
                userId: currentUser._id,
                owner: post.owner,
                postId: post._id
            });
            await commentPost(currentUser._id, post._id, value)
            const time = new Date()
            setCurrentPost(currentPost => {
                currentPost.comments.splice(0, 0, { userId: currentUser._id, comment: value, createAt: time })
                const newPost = JSON.parse(JSON.stringify(currentPost))
                return newPost
            })
            setValue("")
        }
    }

    return (
        <div className="xs:w-full xs:max-w-[680px] max-h-[90%] h-fit flex flex-col justify-between m-auto top-0 left-0 bottom-0 right-0 absolute bg-white rounded-lg">
            <div className=" flex flex-col" >
                <div className="flex flex-row relative items-center justify-center h-[4rem] mx-4">
                    <div className="font-bold text-xl">Bài viết của {post.owner !== currentUser._id ? getCurrentFriend(post.owner) : currentUser.firstName + " " + currentUser.lastName}</div>
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
                        <div className="w-10 h-10 bg-blue-200 rounded-full mr-4 overflow-hidden" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                        </div>
                        <div className="flex flex-col items-start">
                            <div className="font-semibold pb-1">{post.owner !== currentUser._id ? getCurrentFriend(post.owner) : currentUser.firstName + " " + currentUser.lastName} </div>
                            <div className="flex flex-row items-center">
                                <FaEarthAsia />
                                <span className="text-sm ml-2">{timeAgo(post.createAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="px-4 mb-4">
                        {
                            post.posts
                        }
                    </div>
                    <Carousel srcs={post.imgaes} slidePerView={1} />
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
                        <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer" onClick={handleLikePost}>
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
                            post.comments.map((com, key) => (
                                <div className="flex flex-row items-start mb-4" key={key}>
                                    <div className="w-8 h-8 bg-blue-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${com.userId !== currentUser._id ? getUserData(com.userId).avatar : currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                                    </div>
                                    <div className="ml-4">
                                        <div className="bg-gray-100 rounded-xl flex w-fit flex-col py-1 px-3 text-md">
                                            <div className="flex flex-row items-center">
                                                <div
                                                    className="font-semibold text-sm">
                                                    {getCurrentFriend(com.userId) !== '' ? getCurrentFriend(com.userId) : currentUser.firstName + " " + currentUser.lastName}
                                                </div>
                                                {
                                                    com.userId === post.owner && <div className="pl-4 text-sm text-blue-500">Tác giả</div>
                                                }
                                            </div>
                                            <p>{com.comment}</p>
                                        </div>
                                        <p className="text-sm mt-1 ml-2.5 text-gray-500">{timeAgo(com.createAt)}</p>
                                    </div>


                                </div>
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
                <div className="pl-3" onClick={handleComment}>
                    <IoSend className="text-gray-500" />
                </div>
            </div>
        </div>
    )
}

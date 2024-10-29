import { IoMdClose } from "react-icons/io";
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { VscComment } from "react-icons/vsc";
import { PiShareFatLight } from "react-icons/pi";
import { useUser } from '../../components/Context/userContext'
import { ModalType, PostListType, ReactType } from "../../type";
import { timeAgo } from "../../ultils";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllUser } from "../../api/userAPI/userAuth";
import { likePost, removeLikePost, commentPost } from '../../api/userAPI/usePost'
import { useSocket } from "../../components/Context/socketIOContext";
import { addRequestList } from "../../api/userAPI/useFriend";
import { createNotify } from "../../api/userAPI/userNotify"
import { useModal } from "../../components/Context/modalContext";
import { ShareModal } from '../../components/Modals/ShareModal'
import { UserType, ToastType } from "../../type";
import { FaEarthAsia } from "react-icons/fa6";
import { useFriend } from '../../components/Context/friendContext'
import { BsDot } from "react-icons/bs";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { IoSend } from 'react-icons/io5'

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

    const { post, setToast } = props
    const { socket } = useSocket()
    const { currentUser } = useUser()
    const [users, setUsers] = useState<UserType[]>([])
    const [currentPost, setCurrentPost] = useState<PostCaculate>({} as PostCaculate)
    const { showModal } = useModal()
    const { friendList } = useFriend()
    const [value, setValue] = useState("")


    useEffect(() => {
        setCurrentPost({ comments: post.comments, likes: post.likes, shared: post.shared })
    }, [post])

    const getCurrentFriend = (userId: string) => {
        const test = users.find(user => user._id === userId)
        if (test) {
            return test?.firstName + ' ' + test?.lastName
        }
        return ''
    }

    const getCurrentUser = (userId: string) => {
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
            if (socket) {
                socket.emit("like-post", {
                    userId: currentUser._id,
                    owner: post.owner,
                    postId: post._id
                });
            }
            await likePost(currentUser._id, post._id)
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

    const getUserData = (userId: string) => {
        const test = users.find(user => user._id === userId)

        if (test) {
            return test
        }

        return {} as UserType
    }

    // const handleProfile = (id: string) => {
    //     if (id === currentUser._id) {
    //         navigate(`/${id}`)
    //     }
    //     else navigate(`/profile/${id}`)
    // }

    return (
        <div className="flex flex-col justify-center w-full">
            <div className="flex flex-row justify-between items-center p-4">
                <div className="flex flex-row items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${post.owner !== currentUser._id ? getCurrentUser(post.owner).avatar : currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                    </div>
                    <div className="pl-3">
                        <div className='font-semibold flex flex-row w-full justify-between'>
                            <div>
                                {
                                    post.owner === currentUser._id ? currentUser.firstName + ' ' + currentUser.lastName : getCurrentFriend(post.owner)
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
            </div>
            <div>
                <div className="px-4 mb-4">
                    {
                        post.posts
                    }
                </div>
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
                    <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer" onClick={handleLikePost}>
                        {
                            likeInclude() ? <AiFillLike size={24} className="text-blue-500" /> :
                                <AiOutlineLike size={24} />
                        }
                        <p className={`${likeInclude() && 'text-blue-500'} font-semibold pl-2`}>Thích</p>
                    </div>
                    <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer" onClick={handleComment}>

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
                <div className="flex flex-col pb-2 my-4 overflow-y-auto max-h-[600px]">
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
                <div className="flex flex-row pb-4 items-center shadow-md absolute bottom-0">
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

        </div >
    )
}

export default Post
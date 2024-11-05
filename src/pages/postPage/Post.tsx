import { IoMdClose } from "react-icons/io";
import { AiFillLike, AiOutlineLike } from 'react-icons/ai'
import { VscComment } from "react-icons/vsc";
import { PiShareFatLight } from "react-icons/pi";
import { useUser } from '../../components/Context/userContext'
import { ModalType, PostListType } from "../../type";
import { timeAgo } from "../../ultils";
import { Divider } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { getUser } from "../../api/userAPI/userAuth";
import { useSocket } from "../../components/Context/socketIOContext";
import { addRequestList } from "../../api/userAPI/useFriend";
import { createNotify } from "../../api/userAPI/userNotify"
import { useModal } from "../../components/Context/modalContext";
import { CommentModal } from "../../components/Modals/CommentModal";
import { ShareModal } from '../../components/Modals/ShareModal'
import { UserType, ToastType } from "../../type";
import { FaEarthAsia } from "react-icons/fa6";
import { useFriend } from '../../components/Context/friendContext'
import { BsDot } from "react-icons/bs";
import { useNavigate } from 'react-router-dom'
import { PostImages } from "../../components/ImageHandler/PostImages";
import './style.css'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { usePost } from '../../components/Context/postContext'


type PostProps = {
    post: PostListType
    setToast: (toast: ToastType) => void
}

const Post: React.FC<PostProps> = (props) => {

    const [expand, setExpand] = useState(false)
    const { post, setToast } = props
    const { socket } = useSocket()
    const { currentUser } = useUser()
    const [owner, setOwner] = useState<UserType>({} as UserType)
    const [loading, setLoading] = useState(true)
    const { showModal } = useModal()
    const { friendList } = useFriend()
    const { handleLikePost } = usePost()
    const navigate = useNavigate()

    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (currentUser && socket) {
            socket.emit("add-user", currentUser._id)
        }
    }, [currentUser])


    useEffect(() => {
        const getUserById = async () => {
            const res = await getUser(post.owner)
            if (res.data.status) {
                setOwner(res.data.userData[0])
                setLoading(false)
            }
        }
        getUserById()
    }, [])

    const likeInclude = () => {
        if (post.likes?.find(user => user.userId === currentUser._id)) {
            return true
        }

        return false
    }

    const handleComment = () => {
        const test: ModalType = {
            toggle: true,
            root: 'modal-root',
            width: 36,
            height: 90,
            body: <CommentModal post={post} />,
        }
        showModal(test);
    };

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

    const handleProfile = (id: string) => {
        if (id === currentUser._id) {
            navigate(`/${id}`)
        }
        else navigate(`/profile/${id}`)
    }

    const checkContentHeight = () => {
        if (contentRef.current && contentRef.current.clientHeight > 100) {
            return true
        }
        return false
    }

    return (
        <div className="flex flex-col justify-center w-full">
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
                        <div className="flex flex-row items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${owner.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                            </div>
                            <div className="pl-3">
                                <div className='font-semibold flex flex-row w-full justify-between'>
                                    <div onClick={() => handleProfile(post.owner)}>
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
                }
                <div className="p-2 rounded-full hover:bg-gray-200">
                    <IoMdClose size={20} />
                </div>
            </div>
            <div>
                <div className={` px-4 ${!expand && 'max-h-[120px]'}  overflow-hidden mb-4`} ref={contentRef}>
                    <div>
                        {post.posts}
                    </div>
                </div>
                <span className={`${!checkContentHeight() && 'hidden'} mx-4 cursor-pointer font-medium`} onClick={() => setExpand(!expand)}>{expand ? 'ẩn bớt' : '... xem thêm'}</span>
                <div className="pt-4">
                    <PostImages srcs={post} />
                </div>
            </div>
            <div className="flex flex-col p-4 pb-2">
                <div className="flex flex-row justify-between pb-4">
                    <div className="flex flex-row items-center">
                        <div className="p-1 bg-blue-500 rounded-full">
                            <AiFillLike className="text-white" size={12} />
                        </div>
                        <p className="pl-2 text-gray-500">{post.likes?.length}</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <div className="flex flex-row items-center text-gray-500">
                            <p className="pr-1">{post.comments?.length}</p>
                            <p className="text-sm ">bình luận</p>
                        </div>
                        <div className="flex flex-row items-center text-gray-500 pl-4">
                            <p className="pr-1">{post.shared?.length}</p>
                            <p className="text-sm ">lượt chia sẻ</p>
                        </div>
                    </div>
                </div>
                <Divider />
                <div className={`grid grid-cols-${currentUser._id !== post.owner ? 3 : 2} gap-4 pt-2`}>
                    <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer" onClick={() => handleLikePost(post)}>
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
            </div>

        </div >
    )
}

export default Post
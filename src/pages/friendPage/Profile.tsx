import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserType, ToastType, PostListType } from '../../type'
import { useMsg } from '../../components/Context/msgContext'
import Snackbar from "@mui/material/Snackbar";
import { getUser } from '../../api/userAPI/userAuth'
import Skeleton from '../../components/Skeleton'
import { FaUserCheck, FaUserPlus, FaFacebookMessenger } from "react-icons/fa";
import { getAllUserPost } from '../../api/userAPI/usePost'
import Post from '../postPage/Post'
import { timeAgo } from '../../ultils'
import { FaEarthAsia } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { addRequestList } from '../../api/userAPI/useFriend'
import { useFriend } from '../../components/Context/friendContext'
import { createNotify } from '../../api/userAPI/userNotify';
import { useUser } from '../../components/Context/userContext'
import { getFriendDataList } from '../../api/userAPI/useFriend'

export const FriendDetailPage = () => {

    const match = useParams<{ id: string }>();
    const [userInfo, setUserInfo] = useState<UserType>({} as UserType)
    const { addChatList } = useMsg()
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const [post, setPost] = useState<PostListType[]>([])
    const [loading, setLoading] = useState(true)
    const [friends, setFriends] = useState<UserType[]>([])
    const { friendList } = useFriend()
    const { currentUser } = useUser()

    useEffect(() => {
        const getCurrentUser = async () => {
            if (match.id) {
                const test = await getUser(match.id)
                if (test.data.status) {
                    setUserInfo(test.data.userData[0])
                }
                const post = await getAllUserPost(match.id)
                if (post.data.status) {
                    setPost(post.data.post)
                }
            }
            setLoading(false)
        }
        const getCurrentPost = async () => {
            if (match.id) {
                const post = await getAllUserPost(match.id)
                if (post.data.status) {
                    setPost(post.data.post)
                }
                else {
                    setPost([])
                }
            }
            setLoading(false)
        }

        const getFriendListData = async () => {
            if (match.id) {
                const friends = await getFriendDataList(match.id)
                if (friends.data.status) {
                    setFriends(friends.data.data)
                }
            }

        }
        getFriendListData()
        getCurrentUser()
        getCurrentPost()
    }, [match.id])

    if (loading) {
        return <div className='h-[93vh] m-auto'>
            <Skeleton />
        </div>
    }

    const getShareTime = (post: PostListType) => {
        let tmp = new Date()
        post.shared.map(share => {
            if (share.userId === userInfo._id) {
                tmp = share.createAt
            }
        })
        return tmp
    }

    const getComment = (post: PostListType) => {
        let tmp = ''
        post.shared.map(share => {
            if (share.userId === userInfo._id) {
                tmp = share.comment
            }
        })
        return tmp
    }

    const checkFriend = () => {
        const isFriend = friendList.find(friend => friend.friendId === userInfo._id)
        return !!isFriend
    }

    const handleSendRequest = async (friendId: string) => {
        const res = await createNotify(friendId, `${currentUser.firstName + " " + currentUser.lastName} đã gửi đến bạn một lời mời kết bạn`, 'friendRequest', currentUser._id)
        await addRequestList(friendId, currentUser._id)
        setToast({ open: true, msg: res.data.msg })
    }

    return (
        <div className='h-[93vh] flex flex-col relative'>
            <div className='w-full'>
                <div className="h-[93vh] overflow-y-auto flex flex-col ">
                    <div className='shadow-md'>
                        <div className="2xl:w-2/3 xl:w-[80%] xs:w-full mx-auto flex flex-col">
                            <div className="w-full h-[460px] xs:h-[40vw] xl:h-[30vw] bg-gray-300 rounded-lg relative " style={{ backgroundImage: `url(${userInfo.backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                            </div>
                            <div className="w-full xs:pb-4 lg-pb-0">
                                <div className="mx-9 flex flex-row xs:flex-col lg:flex-row items-center">
                                    <div className="w-[180px] h-[180px] relative">
                                        <div className="bg-gray-400 w-full h-full rounded-full border border-4 border-white absolute -top-9 left-0 overflow-hidden" style={{ backgroundImage: `url(${userInfo.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                                        </div>
                                    </div>
                                    <div className="lg:pl-6 xs:pl-0 flex flex-col xs:items-center lg:items-start">
                                        <span className="text-2xl font-semibold mb-2">{userInfo.firstName + " " + userInfo.lastName}</span>
                                        <div className='flex flex-row'>
                                            {
                                                checkFriend() ?
                                                    <div className='flex flex-row items-center bg-gray-200 px-4 py-1 rounded-lg'>
                                                        <FaUserCheck size={20} />
                                                        <span className='pl-2 font-semibold'>Bạn bè</span>
                                                    </div> :
                                                    <div className='flex flex-row items-center bg-gray-200 px-4 py-1 rounded-lg' onClick={() => handleSendRequest(userInfo._id)}>
                                                        <FaUserPlus size={20} />
                                                        <span className='pl-2 font-semibold'>Thêm bạn bè</span>
                                                    </div>
                                            }

                                            <button className='flex flex-row items-center bg-[--primary-color] text-white px-4 py-1 rounded-lg ml-2' onClick={() => addChatList(userInfo._id)}>
                                                <FaFacebookMessenger size={20} />
                                                <span className='pl-2 font-semibold'>Nhắn tin</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-1 bg-gray-100'>
                        <div className='2xl:w-[60%] m-auto'>
                            <div className="w-full">
                                <div className="py-4 grid grid-cols-7 xs:grid-cols-1 xl:grid-cols-7 lg:gap-4">
                                    <div className="shadow-sm rounded-lg  py-4 col-span-3 sticky top-0">
                                        <div className='bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-5 rounded-md'>
                                            <div className='text-xl font-semibold mb-4'>Ảnh</div>
                                            <div className='grid grid-cols-3 gap-4'>
                                                {
                                                    post.map((po) => {
                                                        if (po.imgaes.length > 0) {
                                                            return (
                                                                <>
                                                                    {
                                                                        po.imgaes.map((img, key) => (
                                                                            <div style={{ backgroundImage: `url(${img})`, backgroundPosition: 'center', backgroundSize: 'cover' }} key={key} className='h-[130px]'>
                                                                            </div>
                                                                        ))
                                                                    }
                                                                </>
                                                            )
                                                        }
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className='bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-5 rounded-md mt-4'>
                                            <div className='text-xl font-semibold mb-4'>Bạn bè</div>
                                            <div className='grid grid-cols-3 gap-4'>
                                                {
                                                    friends.map((friend, key) => (
                                                        <div className="flex flex-row items-center w-full" key={key}>
                                                            <div className="flex flex-col items-center w-full">
                                                                <div className="w-full h-[130px] rounded-lg bg-gray-200 overflow-hidden" style={{ backgroundImage: `url(${friend.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                                                <div className='text-sm mt-1'>{friend.firstName + ' ' + friend.lastName}</div>
                                                            </div>

                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shadow-sm rounded-lg col-span-4">
                                        {
                                            post.length > 0 ? post.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()).map((po, key) => (
                                                po.owner === userInfo._id
                                                    ? <div className="flex flex-col items-center justify-center bg-white rounded-lg mt-4" key={key}>
                                                        <Post post={po} key={key} setToast={setToast} />
                                                    </div>
                                                    : <div className="flex flex-col bg-white rounded-lg mt-4" key={key}>
                                                        <div className="flex flex-col">
                                                            <div className="flex flex-row justify-between items-center p-4">
                                                                <div className="flex flex-row items-center">
                                                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${userInfo.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                                                    <div className="pl-3">
                                                                        <div className='font-semibold'>
                                                                            {
                                                                                userInfo.firstName + ' ' + userInfo.lastName
                                                                            }
                                                                        </div>
                                                                        <div className="flex flex-row items-center">
                                                                            <div className="text-gray-500 text-sm pr-1">
                                                                                {timeAgo(getShareTime(po)) + ' ago'}
                                                                            </div>
                                                                            <FaEarthAsia size={14} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="p-2 rounded-full hover:bg-gray-200">
                                                                    <IoMdClose size={20} />
                                                                </div>
                                                            </div>
                                                            <div className="p-4 pt-0">{getComment(po)}</div>
                                                            <div className="m-4 p-4 mt-0 pt-0 border ">
                                                                <Post post={po} key={key} setToast={setToast} />
                                                            </div>
                                                        </div>
                                                    </div>
                                            )) :
                                                <div className='"flex flex-col items-center justify-center bg-white rounded-lg mt-4"'>
                                                    <div className='my-4 p-6'>Không có bài viết</div>
                                                </div>
                                        }
                                    </div>
                                    <Snackbar
                                        open={toast.open}
                                        onClose={() => setToast({ open: false, msg: '' })}
                                        autoHideDuration={6000}
                                        message={toast.msg}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Snackbar
                open={toast.open}
                onClose={() => setToast({ open: false, msg: '' })}
                autoHideDuration={6000}
                message={toast.msg}
            />
        </div>
    )
}

export default FriendDetailPage

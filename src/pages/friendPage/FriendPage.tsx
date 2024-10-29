import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { UserType, ToastType, PostListType } from '../../type'
import { useMsg } from '../../components/Context/msgContext'
import Snackbar from "@mui/material/Snackbar";
import { getUser } from '../../api/userAPI/userAuth'
import Skeleton from '../../components/Skeleton'
import { FaUserCheck, FaFacebookMessenger } from "react-icons/fa";
import { getAllUserPost } from '../../api/userAPI/usePost'
import Post from '../postPage/Post'
import { timeAgo } from '../../ultils'
import { FaEarthAsia } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import { getFriendDataList } from '../../api/userAPI/useFriend'


export const FriendPage = () => {

    const match = useParams<{ id: string }>();
    const [userInfo, setUserInfo] = useState<UserType>({} as UserType)
    const { addChatList } = useMsg()
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const [post, setPost] = useState<PostListType[]>([])
    const [loading, setLoading] = useState(true)
    const [friend, setFriend] = useState<UserType[]>([])

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

        const getFriendList = async () => {
            if (match.id) {
                const friend = await getFriendDataList(match.id)
                if (friend.data.status) {
                    setFriend(friend.data.data)
                }
                else {
                    setFriend([])
                }
            }
            setLoading(false)
        }

        getFriendList()
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

    return (
        <div className='h-[93vh] flex flex-col'>
            <div className='w-full'>
                <div className="h-[93vh] overflow-y-auto flex flex-col">
                    <div className='shadow-md'>
                        <div className="2xl:w-[80%] xl:w-[80%] xs:w-full mx-auto flex flex-col">
                            <div className="w-full h-[460px] xs:h-[40vw] xl:h-[30vw] bg-gray-300 rounded-lg relative" style={{ backgroundImage: `url(${userInfo.backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                            </div>
                            <div className="w-full xs:pb-4 lg-pb-0">
                                <div className="mx-9 flex flex-row xs:flex-col lg:flex-row items-center">
                                    <div className="w-[180px] h-[180px] relative">
                                        <div className="bg-gray-400 w-full h-full rounded-full border border-4 border-white absolute -top-9 left-0 overflow-hidden" style={{ backgroundImage: `url(${userInfo.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                                        </div>
                                    </div>
                                    <div className="lg:pl-6 xs:pl-0 flex flex-col xs:items-center lg:items-start">
                                        <Link to={`/profile/${userInfo._id}`} className='mb-2'><span className="text-2xl font-semibold mb-2">{userInfo.firstName + " " + userInfo.lastName}</span></Link>
                                        <div className='flex flex-row'>
                                            <div className='flex flex-row items-center bg-gray-200 px-4 py-1 rounded-lg'>
                                                <FaUserCheck size={20} />
                                                <span className='pl-2 font-semibold'>Bạn bè</span>
                                            </div>
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
                    <div className='mt-1 bg-gray-100 '>
                        <div className='2xl:w-[70%] relative m-auto'>
                            <div className="w-full">
                                <div className="py-4 grid grid-cols-7 xs:grid-cols-1 xl:grid-cols-7 lg:gap-4 ">
                                    <div className="shadow-sm rounded-lg  py-4 col-span-3">
                                        <div className='bg-white shadow-md p-5 rounded-md'>
                                            <div className='text-xl font-semibold mb-4'>Ảnh</div>
                                            <div className='grid grid-cols-3 gap-2'>
                                                {
                                                    post.map((po) => {
                                                        if (po.imgaes.length > 0) {
                                                            return (
                                                                <>
                                                                    {
                                                                        po.imgaes.map((img, key) => (
                                                                            <div style={{ backgroundImage: `url(${img})`, backgroundPosition: 'center', backgroundSize: 'cover' }} key={key} className='h-[120px]'>
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
                                        <div className='bg-white shadow-md p-5 rounded-md mt-4'>
                                            <div className='text-xl font-semibold mb-4'>Bạn bè</div>
                                            <div className='grid grid-cols-3 gap-4'>
                                                {
                                                    friend.map((friend, key) => (
                                                        <div className="flex flex-row items-center w-full" key={key}>
                                                            <div className="flex flex-col items-center w-full">
                                                                <div className="w-full h-[120px] rounded-lg bg-gray-200 overflow-hidden" style={{ backgroundImage: `url(${friend.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
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

export default FriendPage

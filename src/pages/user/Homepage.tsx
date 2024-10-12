import { IoSearchOutline } from "react-icons/io5"
import { useMsg } from "../../components/Context/msgContext"
import { useUser } from "../../components/Context/userContext"
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { UserType, ModalType, PostListType, ToastType } from "../../type"
import { Divider } from "@mui/material"
import { FaImages } from "react-icons/fa6"
import { useModal } from "../../components/Context/modalContext"
import { createPost, getAllPost } from '../../api/userAPI/usePost'
import { HomeModal } from "../../components/Modals/HomeModal"
import Post from "../../components/Post"
import Skeletons from '../../components/Skeleton'
import Snackbar from "@mui/material/Snackbar";
import { HiUserGroup } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom"
import { LoadingModal } from "../../components/Modals/LoadingModal"
import {getFriendDataList} from '../../api/userAPI/useFriend'


function Homepage() {

    const navigate = useNavigate()
    const { addChatList } = useMsg()
    const { currentUser } = useUser()
    const { showModal, hideModal } = useModal()
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const [value, setValue] = useState("")
    const [flag, setFlag] = useState<boolean>(false)
    const [postList, setPostList] = useState<PostListType[]>([])
    const newFeedRef = useRef<HTMLDivElement>(null)
    const [postLoader, setPostLoader] = useState(false)
    const [friends, setFriends] = useState<UserType[]>([])


    useEffect(() => {
        const currentUserId = JSON.parse(localStorage.getItem('chat-app-current-user') as string);
        if (!currentUserId) {
            hideModal()
            navigate('/login')
        }
    }, [])

    const handleClick = () => {
        const test: ModalType = {
            toggle: true,
            root: 'modal-root',
            width: 30,
            height: 50,
            body: <HomeModal setFlag={setFlag} onSubmit={handlePost} onChange={setValue} defaultValue={value} />,
            onClick: () => setFlag(false)
        }
        showModal(test);
        setFlag(true)
    };

    const handlePost = async (value: string, images: string[]) => {
        if (value !== '') {
            const res = await createPost(currentUser._id, value, images)
            if (res.data.status) {
                setPostList(postList => {
                    postList.push(res.data.data)
                    const newPost: PostListType[] = JSON.parse(JSON.stringify(postList))
                    return newPost
                })
            }
            setValue("")
            setToast({ open: true, msg: res.data.msg })
        }
    }

    useEffect(() => {
        
        const gettPost = async () => {
            const res = await getAllPost()
            if (res.data.status) {
                setPostList(res.data.post)
            }
        }

        const getFriendListData = async () => {
            const friends = await getFriendDataList(currentUser._id)
            if (friends.data.status) {
                setFriends(friends.data.data)
            }
            
        } 
        getFriendListData()
        gettPost()
    }, [currentUser._id])


    const handleScroll = () => {
        if (newFeedRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = newFeedRef.current
            const isNearBottom = scrollTop + clientHeight >= scrollHeight;
            if (isNearBottom) {
                setPostLoader(true)

            }
        }
        const timeoutId = setTimeout(() => {
            if (postLoader) {
                setPostLoader(false)
            }
        }, 2000);
        return () => clearTimeout(timeoutId);

    }

    useLayoutEffect(() => {
        if (!currentUser._id) {
            const handleClick = () => {
                const test: ModalType = {
                    toggle: true,
                    root: 'modal-root',
                    width: 30,
                    height: 50,
                    body: <LoadingModal />
                }
                showModal(test);
            };
            handleClick()
        }
        else {
            hideModal()
        }
    }, [currentUser._id])



    return (
        <div >
            <div className='flex-1 '>
                <div className="grid xl:grid-cols-5 xs:grid-cols-1 lg:grid-cols-4">
                    <div className="bg-red-100 h-full xs:hidden xl:block">
                        <div className="h-[93vh] bg-gray-100 overflow-y-auto flex flex-col font-semibold py-5">
                            <div className="py-3 px-4 hover:bg-gray-200 grid grid-cols-9 items-center rounded-lg cursor-pointer">
                                <div className=" col-span-1 w-7 h-7 bg-blue-200 rounded-full overflow-hidden " style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                </div>
                                <div className="col-span-7">{currentUser.firstName + " " + currentUser.lastName} </div>
                            </div>
                            <Link to={'/friends'}>
                                <div className="py-3 px-4 hover:bg-gray-200 grid grid-cols-9 items-center rounded-lg cursor-pointer">
                                    <HiUserGroup size={26} className="text-[--primary-color] col-span-1" />
                                    <div className="col-span-7">Tìm bạn bè</div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gray-100 col-span-3 ">
                        <div className="h-[93vh] overflow-y-auto flex flex-col" ref={newFeedRef} onScroll={handleScroll}>
                            <div className="flex flex-col items-center justify-center md:w-[500px] lg:w-[680px] xs:w-full xs:max-w-[500px] lg:max-w-[680px] mx-auto bg-white rounded-lg my-4">
                                <div className="w-full px-4 py-2">
                                    <div className="flex flex-row items-center pb-4 pt-2 w-full">
                                        <div className="w-14 h-14 bg-gray-100 rounded-full" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                        <div
                                            className="text-gray-500 bg-gray-100 ml-4 px-4 py-2 cursor-pointer flex-1 rounded-full outline-none"
                                            onClick={handleClick}
                                        >
                                            <div className="truncate max-w-[550px]">{(value !== '' && !flag) ? value : currentUser.lastName + " ơi, bạn đang nghĩ gì thế"}</div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className={`hover:bg-gray-200 mt-2 w-fit px-4 rounded-lg py-2 flex flex-row items-center`}>
                                        <FaImages className="text-green-400" size={20} />
                                        <span className="ml-2 text-gray-600">Thêm ảnh</span>
                                    </div>
                                </div>
                            </div>
                            {
                                postList.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()).map((post, key) => (
                                    <div className="xs:w-full md:w-[500px] lg:w-[680px] xs:max-w-[500px] lg:max-w-[680px] mx-auto bg-white rounded-lg mb-4" key={key} >
                                        <Post post={post} setToast={setToast} />
                                    </div>
                                ))
                            }
                            {
                                postList.length < 1 && <div>
                                    <div className="xs:w-full md:w-[500px] lg:w-[680px] xs:max-w-[500px] lg:max-w-[680px] mx-auto bg-white rounded-lg mb-4" >
                                        <div className="p-4 flex flex-col items-center">
                                            <span className="text-xl">Hãy kết bạn để xem nhiều tin hơn nhé</span>
                                            <Link to={'/friends'} className="mt-4">
                                                <div className="bg-[--primary-color] text-white px-10 py-2 rounded-lg">
                                                    Tìm bạn bè
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                postLoader && <Skeletons />
                            }


                        </div>
                    </div>
                    <div className="h-full bg-gray-100">
                        <div className="max-h-[93vh] overflow-y-auto flex flex-col p-3">
                            <div className="flex flex-row items-center justify-between p-2">
                                <span className="text-lg font-semibold">
                                    Người liên hệ
                                </span>
                                <IoSearchOutline size={20} />
                            </div>
                            {
                                friends.map((user, key) => (
                                    <div className="p-2 hover:bg-gray-100 flex flex-row items-center rounded-lg cursor-pointer" key={key} onClick={() => addChatList(user._id)}>
                                        <div className="w-10 h-10 bg-blue-200 rounded-full mr-4"
                                            style={{ backgroundImage: `url(${user.avatar}`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                                        ></div>
                                        <div>{user.firstName + " " + user.lastName} </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div >
            <Snackbar
                open={toast.open}
                onClose={() => setToast({ open: false, msg: '' })}
                autoHideDuration={6000}
                message={toast.msg}
            />
        </div >
    )
}

export default Homepage

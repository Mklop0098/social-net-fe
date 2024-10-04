import { useState, PropsWithChildren, useEffect } from "react"
import { ToastType, UserType, FriendArrayType } from "../../type"
import { useNavigate } from 'react-router-dom'
import { Divider, Snackbar } from "@mui/material"
import { Link } from 'react-router-dom'
import { IoArrowBack, IoSearchOutline } from "react-icons/io5";
import Header from '../Header'

import { useUser } from "../Context/userContext"
import { getAllUser } from "../../api/userAPI/userAuth"
import { useFriend } from "../Context/friendContext"
import { useMsg } from '../Context/msgContext'
import ChatBox from '../ChatBox'
import MiniChatBox from '../MiniChatBox'

export const FriendPageLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const { activeChatList, minimizeChatBoxList } = useMsg()
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const navigate = useNavigate()
    // const { showModal } = useModal()
    const [users, setUsers] = useState<UserType[]>([])

    const { currentUser } = useUser()
    const { friendList } = useFriend()


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

    const getFriendList = () => {
        const findUser = (list: FriendArrayType[], id: string) => {
            return list.find(friend => friend.friendId === id)
        }
        const test = users.filter(user => findUser(friendList, user._id))
        return test
    }

    useEffect(() => {
        if (!localStorage.getItem('chat-app-current-user')) {
            navigate("/login");
        }
    }, [])

    // const handleClick = () => {
    //     const test: ModalType = {
    //         toggle: true,
    //         root: 'modal-root',
    //         width: 30,
    //         height: 50,
    //         body: <RequestModal />
    //     }
    //     showModal(test);
    // };

    return (
        <div className='h-[93vh] flex flex-col relative bg-white'>
            <div className='sticky top-0 w-full'>
                <Header />
            </div>
            <div>
                <div className="grid md:grid-cols-5 xs:grid-cols-1 gap-1">
                    <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                        <div className="sticky top-20 shadow-l-md xs:hidden md:block flex flex-col mb-4 bg-white">
                            <div className="text-2xl font-bold py-2 px-4 flex flex-row items-center">
                                <Link to={'/friends'}>
                                    <IoArrowBack />
                                </Link>
                                <div className="ml-2">Tất cả bạn bè</div>
                            </div>
                            <div className="mx-4 mb-4 border rounded-full bg-gray-100 flex flex-row items-center xs:justify-center overflow-hidden">
                                <div className="w-[40px] h-[40px] flex justify-center items-center ">
                                    <IoSearchOutline size={20} />
                                </div>
                                <input
                                    className="xs:hidden lg:block py-2 ml-1 bg-gray-100 outline-none w-80 text-md  h-[40px]"
                                    type="text"
                                    placeholder="Bạn đang tìm kiếm gì?"
                                />
                            </div>

                            <Divider />
                            <div className="px-2 rounded-lg max-h-[80vh] overflow-auto">
                                {
                                    getFriendList().map((user, key) => (
                                        <Link to={`/friends/list/${user._id}`} >
                                            <div className="px-2 py-3 hover:bg-gray-100 flex flex-row items-center rounded-lg cursor-pointer" key={key}>
                                                <div className="w-12 h-12 bg-blue-200 rounded-full mr-4"
                                                    style={{ backgroundImage: `url(${user.avatar}`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                                                ></div>
                                                <div>{user.firstName + " " + user.lastName} </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>


                    </div>
                    <div className="col-span-4 max-h-[93vh] flex flex-col relative">
                        {children}
                        <div className='m-w-[1050px] h-[420px] z-10 bottom-0 right-10 absolute flex flex-row'>
                            <div className='flex flex-row h-full'>
                                {
                                    activeChatList.slice(0, 3).map((user, key) => (
                                        <ChatBox key={key} user={user} />
                                    ))
                                }
                            </div>
                            <div className='w-20 h-full flex flex-col items-center justify-end pb-8'>
                                {
                                    minimizeChatBoxList.slice(0, 3).map((user, key) => (
                                        <MiniChatBox key={key} user={user} />
                                    ))
                                }
                                {
                                    minimizeChatBoxList.length > 3 && (
                                        <div className="w-14 h-14 bg-gray-200 mt-4 rounded-full flex items-center justify-center">
                                            {'+' + minimizeChatBoxList.slice(3).length}
                                        </div>
                                    )
                                }
                                <div className="w-14 h-14 bg-gray-200 mt-4 rounded-full">

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
            </div>
        </div>

    )
}   
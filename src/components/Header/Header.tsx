import { useEffect, useRef, useState } from "react";
import { FaFacebookMessenger, FaBell } from "react-icons/fa";
import { CustomMenu } from "../CustomMenu/CustomMenu";
import { Divider } from "@mui/material";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import { logoutRoute } from "../../api/ultils";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Context/userContext";
import { getUser, getAllUser } from "../../api/userAPI/userAuth";
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineUsers } from "react-icons/hi2";
import { useNotify } from "../Context/notifyContext";
import { getAllNotifies, readNotifies } from "../../api/userAPI/userNotify";
import { NotifyType, UserType } from "../../type";
import { haveUnreadNotify, timeAgo } from "../../ultils";
import { useMsg } from "../Context/msgContext";
import { useSocket } from "../Context/socketIOContext";
import { GetReceiveMessage } from '../../api/userAPI/useMessage'
import { IoSearchOutline } from "react-icons/io5";
import { normalizeText } from 'normalize-text';
import { useFriend } from '../Context/friendContext'
import './style.css'

type HeaderProps = {
    defaultStatus?: string
}

type MessReceiveType = {
    from: string,
    to: string,
    readed: boolean,
    message: string,
    createAt: Date
}

type NewChatType = { from: string, to: string, msg: string }

const Header: React.FC<HeaderProps> = ({ defaultStatus = '' }) => {
    const messRef = useRef(null);
    const infoRef = useRef(null);
    const notifyRef = useRef(null);
    const searchRef = useRef(null)

    const [showMess, setShowMess] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

    const navigate = useNavigate()
    const [status, setStatus] = useState(defaultStatus)

    const { currentUser, updateCurrentUser } = useUser()
    const { notifies, setNotifiesList } = useNotify()
    const { newMessage, activeChatList, addChatList, setNewMessage } = useMsg()
    const [messageReceive, setMessageReceive] = useState<MessReceiveType[]>([])
    const [newChat, setNewChat] = useState<NewChatType>({} as NewChatType)
    const [newNotify, setNewNotify] = useState<boolean>(false)
    const [value, setValue] = useState('')
    const [filterData, setFilterData] = useState<UserType[]>([])

    const { resetFriendContext } = useFriend()

    const { socket } = useSocket()

    const [users, setUsers] = useState<UserType[]>([])

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

    const getCurrentFriend = (userId: string) => {
        const test = users.find(user => user._id === userId)
        if (test) {
            return test
        }
        return {} as UserType
    }

    const getMessageReceive = (messList: MessReceiveType[]): MessReceiveType[] => {
        let tmp: MessReceiveType[] = []
        messList.map((mess) => {
            const exist1 = tmp.find(item => item.from === mess.from && item.to === mess.to)
            const exist2 = tmp.find(item => item.from === mess.to && item.to === mess.from)
            const event1 = new Date(mess.createAt);

            if (!exist1 && !exist2) {
                tmp.push(mess)
            }
            else if (exist1) {
                const event = new Date(exist1.createAt);
                if (event1 > event) {
                    const change = tmp.filter(item => item.createAt !== exist1.createAt)
                    change.push(mess)
                    tmp = change
                }
            }
            else if (exist2) {
                const event = new Date(exist2.createAt);
                if (event1 > event) {
                    const change = tmp.filter(item => item.createAt !== exist2.createAt)
                    change.push(mess)
                    tmp = change
                }
            }
        })

        return tmp
    }

    useEffect(() => {
        const currentUserId = JSON.parse(localStorage.getItem('chat-app-current-user') as string);
        if (currentUserId) {
            const getCurrentUser = async (id: string) => {
                const userData = await getUser(id)
                if (userData.data.status) {

                    updateCurrentUser(userData.data.userData[0])
                }
                const userNotify = await getAllNotifies(id)
                if (userNotify.data.status) {
                    const notifies = userNotify.data.notify[0].notify
                    setNotifiesList(notifies as NotifyType[])
                }
            }
            getCurrentUser(currentUserId._id)
        }

        if (socket) {


            socket.on("msg-receive", (data: NewChatType) => {
                setNewMessage(true)
                setNewChat(data)
                if (currentUser._id) {
                    const getReceive = async () => {
                        const res = await GetReceiveMessage(currentUser._id)
                        const messList: MessReceiveType[] = res.data.projectedMessages

                        setMessageReceive(getMessageReceive(messList))
                    }
                    getReceive()
                }
            });
            socket.on("post-liked", () => {
                setNewNotify(true)

                if (currentUser) {
                    const getCurrentNotify = async (id: string) => {
                        const userNotify = await getAllNotifies(id)
                        if (userNotify.data.status) {
                            const notifies = userNotify.data.notify[0].notify
                            setNotifiesList(notifies as NotifyType[])
                        }
                    }
                    getCurrentNotify(currentUser._id)
                }
            });

            socket.on("post-commented", () => {
                setNewNotify(true)

                if (currentUser) {
                    const getCurrentNotify = async (id: string) => {
                        const userNotify = await getAllNotifies(id)
                        if (userNotify.data.status) {
                            const notifies = userNotify.data.notify[0].notify
                            setNotifiesList(notifies as NotifyType[])
                        }
                    }
                    getCurrentNotify(currentUser._id)
                }
            });
        }

    }, []);

    useEffect(() => {
        if (newChat.from && !activeChatList.find(user => user.userId === newChat.from)) {
            addChatList(newChat.from)
        }
    }, [newChat])


    useEffect(() => {
        if (value !== '') {
            setOpenSearch(true)
        }
        else {
            setOpenSearch(false)
        }
        const handler = setTimeout(() => {
            if (value !== '') {
                setFilterData(
                    users.filter((d) => normalizeText(d.firstName + ' ' + d.lastName).toLowerCase().includes(normalizeText(value).toLowerCase()))
                );
            }
            else {
                setFilterData([]);
            }
        }, 500)
        return () => {
            clearTimeout(handler)
        }
    }, [value])



    const handleClick = async () => {
        const id = JSON.parse(localStorage.getItem('chat-app-current-user') as string)._id;
        const data = await axios.get(`${logoutRoute}/${id}`);
        if (data.status === 200) {
            localStorage.clear();
            resetFriendContext()
            navigate("/login");
        }
    }

    const handleClickNotify = async () => {
        const res = await readNotifies(currentUser._id)
        if (res.data.status) {
            const notifies = res.data.notify[0].notify
            setNotifiesList(notifies as NotifyType[])
        }
        setShowNotify(true)
        setNewNotify(false)
    }

    useEffect(() => {
        if (currentUser._id) {
            const getReceive = async () => {
                const res = await GetReceiveMessage(currentUser._id)
                const messList: MessReceiveType[] = res.data.projectedMessages
                setMessageReceive(getMessageReceive(messList))
                const returnList = messList.find(mess => mess.readed === false)
                if (returnList) {
                    setNewMessage(true)
                }
            }
            getReceive()
        }
    }, [currentUser, newMessage])



    const handleShowMess = () => {
        setShowMess(true)
        setNewMessage(false)
    }

    const handleNavigate = (id: string) => {
        setValue('')
        setFilterData([])
        navigate(`/profile/${id}`)
    }

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target !== searchRef.current) {
                setOpenSearch(false)
            }
        }
        document.addEventListener('click', e => handleClick(e))
    }, [])

    return (
        <div className="header-wrapper md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4 shadow-sm bg-white 2xs:h-[8rem] md:h-[4rem]">
            <div className="flex flex-row items-center">
                <Link to={"/"}>
                    <div className="w-12 h-12 bg-[--primary-color] rounded-full mr-4"></div>
                </Link>
                <div className="2xs:flex-1 md:max-w-[300px] border rounded-full bg-gray-100 flex flex-row items-center xs:justify-center relative z-50">
                    <div className="w-[40px] h-[40px] flex justify-center items-center ">
                        <IoSearchOutline size={20} />
                    </div>
                    <input
                        className="lg:block flex-1 py-3 ml-1 bg-gray-100 outline-none text-md mr-3 h-[40px]"
                        type="text"
                        placeholder="Bạn đang tìm kiếm gì?"
                        onChange={e => setValue(e.target.value)}
                        value={value}
                        onFocus={() => setOpenSearch(true)}
                        ref={searchRef}
                    />
                    {openSearch &&
                        <div className="w-full h-fit absolute top-[100%] bg-white shadow-md p-2 rounded-md z-50">
                            {
                                value !== '' ? <div className="py-3 px-4 hover:bg-gray-200 grid grid-cols-9 items-center rounded-lg cursor-pointer" onClick={() => {
                                    navigate(`/search/${value}`)
                                    setFilterData([])
                                    setValue('')
                                }}>
                                    <div className=" col-span-1 w-7 h-7 rounded-full flex items-center justify-center">
                                        <IoSearchOutline size={20} />
                                    </div>
                                    <div className="col-span-7">{value} </div>
                                </div> :
                                    <div className="py-3 px-4 grid grid-cols-9 items-center rounded-lg">
                                        <div className=" col-span-1 w-7 h-7 rounded-full flex items-center justify-center">
                                            <IoSearchOutline size={20} />
                                        </div>
                                        <div className="col-span-7">Nhập từ khóa để tìm kiếm </div>
                                    </div>

                            }
                            {
                                filterData.map((data, key) => (
                                    <div className="py-3 px-4 hover:bg-gray-200 grid grid-cols-9 items-center rounded-lg cursor-pointer" key={key} onClick={() => handleNavigate(data._id)}>
                                        <div className=" col-span-1 w-7 h-7 bg-blue-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${data.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
                                        </div>
                                        <div className="col-span-7">{data.firstName + " " + data.lastName} </div>
                                    </div>
                                ))
                            }
                        </div>}
                </div>
            </div>
            <div className="flex flex-row justify-center items-center h-full 2xs:hidden lg:flex">
                <Link to={'/'} className="h-[94%] mt-auto">
                    <div
                        className={`${status === 'newFeed' ? 'border-blue-500/100' : 'border-indigo-500/0'} 
                        rounded-lg rounded-b-none h-full border-b-4 px-14 h-full flex items-center hover:bg-gray-100 cursor-pointer`}
                        onClick={() => setStatus('newFeed')}
                    >
                        <IoHomeOutline size={26} className={`${status === 'newFeed' && 'text-blue-500/100'}`} />
                    </div>
                </Link>
                <Link to={'/friends'} className="h-[94%] mt-auto" onClick={() => setStatus('friends')}>
                    <div
                        className={`${status === 'friends' ? 'border-blue-500/100' : 'border-indigo-500/0'} 
                        rounded-lg rounded-b-none h-full border-b-4 px-14 h-full flex items-center hover:bg-gray-100 cursor-pointer`}

                    >
                        <HiOutlineUsers size={26} className={`${status === 'friends' && 'text-blue-500/100'}`} />
                    </div>
                </Link>
            </div>
            <div className="flex flex-row 2xs:justify-between md:justify-end items-center">
                <div className="2xs:flex flex flex-row justify-start lg:hidden">
                    <Link to={'/'} className="h-[94%] mt-auto">
                        <div
                            className="p-2.5 mr-2 bg-gray-200 rounded-full cursor-pointer relative"
                            onClick={() => setStatus('newFeed')}
                        >
                            <IoHomeOutline size={20} />
                        </div>
                    </Link>
                    <Link to={'/friends'} className="h-[94%] mt-auto" onClick={() => setStatus('friends')}>
                        <div
                            className="p-2.5 mx-2 bg-gray-200 rounded-full cursor-pointer relative"
                            onClick={() => setStatus('friends')}
                        >
                            <HiOutlineUsers size={20} />
                        </div>
                    </Link>
                </div>
                <div className="flex flex-row justify-end items-center">
                    <div
                        ref={messRef}
                        className="p-2.5 mx-2 bg-gray-200 rounded-full cursor-pointer relative"
                        onClick={handleShowMess}
                    >
                        <FaFacebookMessenger size={20} />
                        {
                            newMessage && <div className="w-3 h-3 bg-red-500 absolute top-0 right-0 rounded-full"></div>
                        }
                    </div>
                    <div
                        className="p-2.5 mx-2 bg-gray-200 rounded-full cursor-pointer relative"
                        ref={notifyRef}
                        onClick={handleClickNotify}
                    >
                        <FaBell size={20} />
                        {
                            (haveUnreadNotify(notifies) || newNotify) && <div className="w-3 h-3 bg-red-500 absolute top-0 right-0 rounded-full"></div>
                        }
                    </div>
                    <div
                        className="ml-2 w-11 h-11 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
                        ref={infoRef}
                        onClick={() => setShowInfo(true)}
                        style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                    >
                    </div>
                </div>
                <CustomMenu
                    anchorEl={messRef.current}
                    open={showMess}
                    className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                    onClose={() => {
                        setShowMess(false)
                    }}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    <div className="flex flex-col px-2">
                        <div className="text-xl px-2 font-bold pt-4 pb-2">Doan Chat</div>
                        {
                            messageReceive.length > 0 ? messageReceive.map((mess, key) => (
                                <div
                                    key={key}
                                    className='hover:bg-gray-100 w-full p-3 flex flex-row items-center cursor-pointer'
                                    onClick={() => {
                                        addChatList(mess.from !== currentUser._id ? mess.from : mess.to)
                                        setShowMess(false)
                                    }}
                                >
                                    <div className='w-14 h-14 rounded-full bg-gray-300 p-3 mr-3' style={{ backgroundImage: `url(${getCurrentFriend(mess.from !== currentUser._id ? mess.from : mess.to).avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                    <div className='flex flex-col justify-between flex-1'>
                                        <div className='font-semibold'>{getCurrentFriend(mess.from !== currentUser._id ? mess.from : mess.to).firstName + ' ' + getCurrentFriend(mess.from !== currentUser._id ? mess.from : mess.to).lastName}</div>
                                        <div className='text-sm text-gray-500 flex flex-row justify-between'>
                                            <div className="max-w-[120px] truncate">{mess.from === currentUser._id ? `Bạn ${mess.message}` : mess.message}</div>
                                            <span className="w-fit">{timeAgo(mess.createAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : <div className='hover:bg-gray-100 w-full p-3 flex flex-row items-center justify-center cursor-pointer py-12'>
                                <span className='text-md text-gray-500'>Không có tin nhan moi</span>
                            </div>
                        }
                    </div>
                </CustomMenu>
                <CustomMenu
                    anchorEl={infoRef.current}
                    open={showInfo}
                    className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                    onClose={() => setShowInfo(false)}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    <div className="flex flex-col justify-between items-start p-3">
                        <div className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] w-full flex flex-col justify-center">
                            <div className="flex flex-row items-center p-4">
                                <div className="bg-gray-500 rounded-full w-12 h-12 mr-4 overflow-hidden" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                                </div>
                                <div className="text-lg font-semibold">{currentUser.firstName + ' ' + currentUser.lastName}</div>
                            </div>
                            <Divider />
                            <Link to={`/${currentUser._id}`}>
                                <div className="p-4 text-[--primary-color] cursor-pointer">Xem trang cá nhân</div>
                            </Link>
                        </div>
                        <div className="flex flex-col items-start mt-3 w-full">
                            <div className="flex flex-row items-center p-3 w-full hover:bg-gray-200 rounded-lg cursor-pointer" onClick={handleClick}>
                                <div className="p-2 bg-gray-300 rounded-full mr-4">
                                    <IoIosLogOut size={24} color="black" />
                                </div>
                                <span className="font-semibold">Đăng xuất</span>
                            </div>
                        </div>
                    </div>
                </CustomMenu>
                <CustomMenu
                    anchorEl={notifyRef.current}
                    open={showNotify}
                    className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                    onClose={() => setShowNotify(false)}
                    MenuListProps={{
                        "aria-labelledby": "basic-button",
                    }}
                >
                    <div className="flex flex-col justify-between items-start flex flex-col max-h-[80vh]">
                        <span className='text-xl font-bold  p-3'>Thông báo</span>
                        {
                            notifies.length > 0 ? notifies.reverse().map((notify, key) => (
                                <Link to={'/friends'} onClick={() => setStatus('friends')} key={key}>
                                    <div className='hover:bg-gray-100 w-full p-3 flex flex-row items-center cursor-pointer' >
                                        <div className='w-14 h-14 rounded-full bg-gray-300 overflow-hidden mr-3' style={{ backgroundImage: `url(${getCurrentFriend(notify.from).avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                                        </div>
                                        <div className='flex flex-col justify-between flex-1'>
                                            <div className='font-semibold'>{notify.notifyMsg}</div>
                                            <div className='text-sm text-gray-500'>{timeAgo(notify.createAt) + ' ago'}</div>
                                        </div>
                                    </div>
                                </Link>
                            )) :
                                <div className='hover:bg-gray-100 w-full p-3 flex flex-row items-center justify-center cursor-pointer py-12'>
                                    <span className='text-md text-gray-500'>Không có thông báo</span>
                                </div>
                        }

                    </div>
                </CustomMenu>
            </div >
        </div >
    );
}

export default Header;
import { useState, PropsWithChildren, useEffect } from "react"
import { ToastType, UserType } from "../../type"
import { useNavigate } from 'react-router-dom'
import { Divider, Snackbar } from "@mui/material"
import { Link } from 'react-router-dom'
import { IoArrowBack, IoSearchOutline } from "react-icons/io5";
import Header from '../Header/Header'
import { ChatMonitor } from '../ChatMonitor'
import { useUser } from "../Context/userContext"
import { getFriendDataList } from '../../api/userAPI/useFriend'
import { normalizeText } from 'normalize-text';



export const FriendPageLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const navigate = useNavigate()
    const [friends, setFriends] = useState<UserType[]>([])
    const [filterData, setFilterData] = useState<UserType[]>([])
    const { currentUser } = useUser()
    const [value, setValue] = useState('')


    useEffect(() => {
        if (currentUser._id) {
            const getFriendListData = async () => {
                const friends = await getFriendDataList(currentUser._id)
                if (friends.data.status) {
                    setFriends(friends.data.data)
                }

            }
            getFriendListData()
        }
    }, [currentUser])

    useEffect(() => {
        const handler = setTimeout(() => {
            if (value !== '') {
                setFilterData(
                    friends.filter((d) => normalizeText(d.firstName + ' ' + d.lastName).toLowerCase().includes(normalizeText(value).toLowerCase()))
                );
            }
            else {
                setFilterData(friends);
            }
        }, 500)
        return () => {
            clearTimeout(handler)
        }
    }, [value, friends])

    useEffect(() => {
        if (!localStorage.getItem('chat-app-current-user')) {
            navigate("/login");
        }
    }, [])

    return (
        <div className='h-[100vh] flex flex-col relative'>
            <div className='sticky top-0 w-full'>
                <Header defaultStatus='newFeed' />
            </div>
            <div className='w-full'>
                <div className="h-[93vh] overflow-y-hidden flex flex-col">
                    <div className="grid md:grid-cols-5 xs:grid-cols-1 gap-1">
                        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                            <div className="shadow-l-md xs:hidden md:block flex flex-col mt-4">
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
                                        onChange={e => setValue(e.target.value)}
                                    />
                                </div>
                                <Divider />
                                <div className="px-2 rounded-lg max-h-[80vh] overflow-auto">
                                    {
                                        filterData.map((user, key) => (
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
                        <div className="h-[93vh] overflow-auto w-full col-span-4">
                            {
                                children
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
            <ChatMonitor />

        </div>
    )
}   
import { useEffect, useState } from "react"
import { useUser } from "../../components/Context/userContext"
import { getAllUser } from "../../api/userAPI/userAuth"
import { FriendArrayType, ToastType, UserType } from "../../type"
import FriendBox from "../../components/FriendBox"
import { useFriend } from "../../components/Context/friendContext"
import { createNotify } from "../../api/userAPI/userNotify"
import { addFriendList, addRequestList } from "../../api/userAPI/useFriend"
import { Snackbar } from "@mui/material"
import { FaUserPlus, FaUserClock } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi2";
import { Link } from 'react-router-dom'
import { getRequestFriendDataList } from '../../api/userAPI/useFriend'

function HomeFriendsPage() {

    const { currentUser } = useUser()
    const { friendList, requestList } = useFriend()
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const [users, setUsers] = useState<UserType[]>([])
    const [requests, setRequests] = useState<UserType[]>([])

    useEffect(() => {
        if (currentUser._id) {
            const getAllUserInfo = async () => {
                const res = await getAllUser(currentUser._id)
                if (res.data.status) {
                    setUsers(res.data.users)
                }
            }
            getAllUserInfo()
            const getFriendListData = async () => {
                const friends = await getRequestFriendDataList(currentUser._id)
                if (friends.data.status) {
                    setRequests(friends.data.data)
                }

            }
            getFriendListData()
        }
    }, [currentUser])

    const getUserList = () => {

        const findUser = (list: FriendArrayType[], id: string) => {
            return list.find(friend => friend.friendId === id)
        }
        const test = users.filter(user => !findUser(friendList, user._id) && !findUser(requestList, user._id))
        return test
    }

    const handleSendRequest = async (userId: string, friendId: string) => {
        console.log(userId)
        const res = await createNotify(friendId, `${currentUser.firstName + " " + currentUser.lastName} đã gửi đến bạn một lời mời kết bạn`, 'friendRequest', currentUser._id)
        await addRequestList(friendId, currentUser._id)
        setToast({ open: true, msg: res.data.msg })
    }

    const handleAddFriend = async (userId: string, friendId: string) => {
        const res = await addFriendList(userId, friendId)
        if (res.data.status) {
            setRequests(requests.filter(req => req._id !== friendId))
            setToast({ open: true, msg: "Thêm bạn bè thành công" })

        }

    }

    return (
        <div className="md:grid md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-7 gap-1 bg-white h-[93vh]">
            <div className="col-span-2 lg:col-span-1 xl:col-span-2 2xl:col-span-1 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <div className="shadow-l-md md:block flex flex-col bg-white">
                    <div className="text-2xl font-bold py-2 px-4">Bạn bè</div>
                    <Link to={'/friends'}>
                        <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                            <div className="flex items-center col-span-1 ">
                                <div className="bg-[--primary-color] p-1.5 rounded-full">
                                    <HiUsers size={20} className="text-white p-0.5" />
                                </div>
                            </div>
                            <div className="col-span-7 flex items-center text-md font-semibold ml-4">Trang chủ</div>
                        </div>
                    </Link>
                    <Link to={'/friends/requests'}>
                        <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                            <div className="flex items-center col-span-1 ">
                                <div className="bg-gray-300 p-1.5 rounded-full">
                                    <FaUserPlus size={20} className="text-black p-0.5" />
                                </div>
                            </div>
                            <div className="col-span-7 flex items-center text-md ml-4 font-semibold">Lời mời kết bạn</div>
                        </div>
                    </Link>
                    <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                        <div className="flex items-center col-span-1 ">
                            <div className="bg-gray-300 p-1.5 rounded-full">
                                <FaUserPlus size={20} className="text-black p-0.5" />
                            </div>
                        </div>
                        <div className="col-span-7 flex items-center text-md ml-4 font-semibold">Gợi ý</div>
                    </div>
                    <Link to={"/friends/list"}>
                        <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                            <div className="flex items-center col-span-1 ">
                                <div className="bg-gray-300 p-1.5 rounded-full">
                                    <FaUserClock size={20} className="text-black p-0.5" />
                                </div>
                            </div>
                            <div className="col-span-7 flex items-center text-md ml-4 font-semibold">Tất cả bạn bè</div>
                        </div>
                    </Link>

                </div>
            </div>
            <div className="col-span-3 xl:col-span-5 2xl:col-span-6 md:overflow-y-auto max-h-[93vh] bg-gray-100 flex flex-col pb-4">
                {requests.length > 0 && <div className="w-full h-full pt-8 px-8">
                    <span className="text-xl font-semibold">Lời mời kết bạn</span>
                    <div className="grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 xs:grid-cols-2 md:grid-cols-2 gap-4 mt-6">
                        {
                            requests.map((user, key) => (
                                <FriendBox key={key} user={user} state={'Xác nhận'} upFunction={handleAddFriend} dowmFunction={() => { }} />
                            ))
                        }
                    </div>
                </div>}
                {getUserList().length > 0 && <div className="w-full h-full pt-8 px-8">
                    <span className="text-xl font-semibold">Những người bạn có thể biết</span>
                    <div className="grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 xs:grid-cols-2 md:grid-cols-2 gap-4 mt-6">
                        {
                            getUserList().map((user, key) => (
                                <FriendBox key={key} user={user} upFunction={handleSendRequest} dowmFunction={() => { }} />
                            ))
                        }
                    </div>
                </div>}
                {
                    (requests.length < 1 && getUserList().length < 1) && <div className="col-span-4 min-h-[93vh] bg-gray-100 flex flex-col">
                        {
                            <div className="flex items-center justify-center h-[90vh] text-2xl text-gray-500 font-semibold m-auto text-center px-12">
                                <p>Lời mời và gợi ý kết bạn sẽ hiển thị tại đây.</p>
                            </div>
                        }
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
    )
}

export default HomeFriendsPage

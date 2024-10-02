import { useEffect, useState } from "react"
import { useUser } from "../../components/Context/userContext"
import { getAllUser } from "../../api/userAPI/userAuth"
import { FriendArrayType, ToastType, UserType } from "../../type"
import FriendBox from "../../components/FriendBox"
import { useFriend } from "../../components/Context/friendContext"
import { createNotify } from "../../api/userAPI/userNotify"
import { addFriendList, addRequestList } from "../../api/userAPI/useFriend"
import { Snackbar } from "@mui/material"

function HomeFriendsPage() {

    const { currentUser } = useUser()
    const { friendList, requestList } = useFriend()
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const [users, setUsers] = useState<UserType[]>([])
    const [requests, setRequests] = useState<FriendArrayType[]>([])

    useEffect(() => {
        setRequests(requestList)
    }, [requestList])

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
        console.log('abc')
        if (res.data.status) {
            setRequests(requests.filter(req => req.friendId !== friendId))
            setToast({ open: true, msg: "Thêm bạn bè thành công" })

        }

    }

    const getRequestList = () => {
        const findUser = (list: FriendArrayType[], id: string) => {
            return list.find(friend => friend.friendId === id)
        }
        const test = users.filter(user => findUser(requestList, user._id))
        return test
    }


    return (
        <div className="grid md:grid-cols-5 xs:grid-cols-1 gap-1">
            <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                <div className="sticky top-20 shadow-l-md xs:hidden md:block">
                    1
                </div>
            </div>
            <div className="col-span-4 min-h-[100vh] bg-gray-100 flex flex-col">
                {requests.length > 0 && <div className="w-full h-full pt-8 px-8">
                    <span className="text-xl font-semibold">Lời mời kết bạn</span>
                    <div className="grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 xs:grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                        {
                            getRequestList().map((user, key) => (
                                <FriendBox key={key} user={user} state={'Xác nhận'} upFunction={handleAddFriend} dowmFunction={() => { }} />
                            ))
                        }
                    </div>
                </div>}
                {getUserList().length > 0 && <div className="w-full h-full pt-8 px-8">
                    <span className="text-xl font-semibold">Những người bạn có thể biết</span>
                    <div className="grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 xs:grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                        {
                            getUserList().map((user, key) => (
                                <FriendBox key={key} user={user} upFunction={handleSendRequest} dowmFunction={() => { }} />
                            ))
                        }
                    </div>
                </div>}
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

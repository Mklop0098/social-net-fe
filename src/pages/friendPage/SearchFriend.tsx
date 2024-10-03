import { useEffect, useState } from "react"
import { useUser } from "../../components/Context/userContext"
import { getAllUser } from "../../api/userAPI/userAuth"
import { FriendArrayType, ToastType, UserType } from "../../type"
import FriendBox from "../../components/FriendBox"
import { useFriend } from "../../components/Context/friendContext"
import { addFriendList } from "../../api/userAPI/useFriend"
import { Snackbar } from "@mui/material"
function SearchFriend() {

    const { currentUser } = useUser()
    const { requestList } = useFriend()
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
        <div>
            <div className="col-span-4 min-h-[100vh] bg-gray-100 flex flex-col">
                {
                    requests.length > 0 ? <div className="w-full h-full pt-8 px-8">
                        <span className="text-xl font-semibold">Lời mời kết bạn</span>
                        <div className="grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 xs:grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                            {
                                getRequestList().map((user, key) => (
                                    <FriendBox key={key} user={user} state={'Xác nhận'} upFunction={handleAddFriend} dowmFunction={() => { }} />
                                ))
                            }

                        </div>
                    </div> :
                        <div className="flex items-center justify-center h-[90vh] text-2xl text-gray-500 font-semibold">Lời mời và gợi ý kết bạn sẽ hiển thị tại đây.</div>

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

export default SearchFriend

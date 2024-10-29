import { useEffect, useState } from "react"
import { useUser } from "../../components/Context/userContext"
import { ToastType, UserType } from "../../type"
import FriendBox from "../../components/FriendBox"
import { addFriendList } from "../../api/userAPI/useFriend"
import { Snackbar } from "@mui/material"
import { getRequestFriendDataList } from '../../api/userAPI/useFriend'

function SearchFriend() {

    const { currentUser } = useUser()
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const [requests, setRequests] = useState<UserType[]>([])

    useEffect(() => {
        if (currentUser._id) {
            const getFriendListData = async () => {
                const friends = await getRequestFriendDataList(currentUser._id)
                if (friends.data.status) {
                    setRequests(friends.data.data)
                }

            }
            getFriendListData()
        }
    }, [currentUser])

    const handleAddFriend = async (userId: string, friendId: string) => {
        const res = await addFriendList(userId, friendId)
        if (res.data.status) {
            setRequests(requests.filter(req => req._id !== friendId))
            setToast({ open: true, msg: "Thêm bạn bè thành công" })

        }

    }

    return (
        <div>
            <div className="col-span-4 min-h-[93vh] bg-gray-100 flex flex-col">
                {
                    requests.length > 0 ? <div className="w-full h-full pt-8 px-8">
                        <span className="text-xl font-semibold">Lời mời kết bạn</span>
                        <div className="grid lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 xs:grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                            {
                                requests.map((user, key) => (
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

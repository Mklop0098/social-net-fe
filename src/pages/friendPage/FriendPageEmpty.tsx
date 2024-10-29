
import { getFriendDataList } from '../../api/userAPI/useFriend'
import { useEffect } from 'react'
import { useUser } from '../../components/Context/userContext'

function FriendPageEmpty() {

    const { currentUser } = useUser()

    useEffect(() => {

        if (currentUser._id) {
            const getDt = async () => {
                await getFriendDataList(currentUser._id)
            }

            getDt()
        }

    }, [currentUser])

    return (
        <div>
            <div className="col-span-4 min-h-[93vh] bg-gray-100 flex flex-col">
                {
                    <div className="flex items-center justify-center h-[90vh] text-2xl text-gray-500 font-semibold">Chọn tên của người mà bạn muốn xem trước trang cá nhân.</div>
                }
            </div>
        </div>
    )
}

export default FriendPageEmpty

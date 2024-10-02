import { CiSearch } from "react-icons/ci"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { useFriend } from "../../components/Context/friendContext"
import { useState, useEffect } from 'react'
import { UserType, FriendArrayType } from '../../type'
import { useUser } from '../../components/Context/userContext'
import { getAllUser } from '../../api/userAPI/userAuth'

function UserFriendsPage() {

    const { friendList } = useFriend()
    const { currentUser } = useUser()

    const [users, setUsers] = useState<UserType[]>([])
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


    return (
        <div className="w-full">
            <div className="py-4">
                <div className="my-4 bg-white shadow-sm rounded-lg px-4 py-6">
                    <div className="flex flex-row items-center justify-between">
                        <span className="text-xl font-semibold">Bạn bè</span>
                        <div className="flex flex-row items-center">
                            <div className="bg-gray-200 p-2 rounded-full flex flex-row items-center">
                                <CiSearch size={24} />
                                <input className="ml-1 outline-none bg-gray-200" type="text" placeholder="Tìm kiếm" />
                            </div>
                            <span className="mx-8 text-blue-500 font-semibold xs:hidden md:block">Lời mời kết bạn</span>
                            <span className="text-blue-500 font-semibold xs:hidden md:block">Tìm bạn bè</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 xs:grid-cols-1 lg:grid-cols-2 gap-2 pt-8">
                        {
                            getFriendList().map((friend, key) => (
                                <div className="border p-4 flex flex-row items-center w-full" key={key}>
                                    <div className="flex flex-row items-center w-full">
                                        <div className="w-20 h-20 rounded-lg bg-gray-200 mr-4 overflow-hidden" style={{ backgroundImage: `url(${friend.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                        <div>{friend.firstName + ' ' + friend.lastName}</div>
                                    </div>
                                    <div>
                                        <HiOutlineDotsHorizontal size={24} />
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserFriendsPage

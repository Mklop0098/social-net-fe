import { CiSearch } from "react-icons/ci"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { useState, useEffect } from 'react'
import { UserType } from '../../type'
import { useUser } from '../../components/Context/userContext'
import {getFriendDataList} from '../../api/userAPI/useFriend'

function UserFriendsPage() {

    const { currentUser } = useUser()
    const [friends, setFriends] = useState<UserType[]>([])
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
                            friends.map((friend, key) => (
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

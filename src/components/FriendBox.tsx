import { UserType } from "../type"
import { useUser } from "./Context/userContext"
import { useState } from 'react'

type FriendBoxType = {
    user: UserType
    state?: "Thêm bạn bè" | "Đã gửi" | "Xác nhận"
    upFunction: (userId: string, friendId: string) => void
    dowmFunction: (userId: string) => void
}

const FriendBox: React.FC<FriendBoxType> = (props) => {

    const { user, state = "Thêm bạn bè", upFunction, dowmFunction } = props
    const { currentUser } = useUser()
    const [currentState, setCurrentState] = useState(state)
    const handleClick = () => {
        if (currentState === 'Thêm bạn bè') {
            setCurrentState("Đã gửi")
        }
        upFunction(currentUser._id, user._id)
    }


    return (
        <div className="h-[22rem] rounded-lg flex flex-col overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <div className="bg-gray-300 h-[55%]"
                style={{ backgroundImage: `url(${user.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
            >

            </div>
            <div className="flex flex-1 flex-col px-3 pb-3 justify-between">
                <div className="flex flex-col pt-1">
                    <span className="text-lg font-semibold">{user.firstName + ' ' + user.lastName}</span>
                    <span className="opacity-0">1</span>
                </div>
                <div className="flex flex-col ">
                    <button
                        className="bg-blue-100 p-1 mb-2 text-[--primary-color] rounded-lg flex justify-center font-semibold"
                        disabled={currentState === "Đã gửi"}
                        onClick={handleClick}
                    >
                        <span>{currentState}</span>
                    </button>
                    <div className="bg-gray-200 p-1 flex justify-center font-semibold rounded-lg cursor-pointer" onClick={() => dowmFunction(user._id)}>Gỡ</div>
                </div>
            </div>
        </div>
    )
}

export default FriendBox

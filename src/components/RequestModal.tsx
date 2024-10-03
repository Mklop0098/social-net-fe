import { useUser } from "../components/Context/userContext"
import { Divider } from "@mui/material"
import { useModal } from "../components/Context/modalContext"
import { IoMdClose } from "react-icons/io";



export const RequestModal = () => {

    const { currentUser } = useUser()
    const { hideModal } = useModal()

    const handleClick = () => {
        hideModal()
    }

    return (
        <div className="flex flex-col justify-between px-4 pb-4 xs:w-[full] h-fit xs:max-w-[500px]  m-auto top-0 left-0 bottom-0 right-0  absolute bg-white rounded-lg">
            <div className=" flex flex-row relative items-center justify-center h-[4rem] p-4">
                <div className="font-bold text-xl">Lời mời đã gửi</div>
                <div
                    className="absolute right-0 w-10 h-10 flex items-center justify-center hover:bg-gray-200 bg-gray-100 rounded-full"
                    onClick={handleClick}
                >
                    <IoMdClose size={20} />
                </div>
            </div>
            <Divider />
            <div className="py-2 text-lg font-semibold">
                Đã gửi 1 lời mời
            </div>
            <div className="flex flex-col xs:max-h-[600px] overflow-auto">
                <div className="py-3 flex flex-row items-center justify-between rounded-lg cursor-pointer hover:bg-gray-100">
                    <div className="flex flex-rơw items-center pl-3">
                        <div className="w-10 h-10 bg-blue-200 rounded-full mr-2 overflow-hidden">
                            <img src={currentUser.avatar} alt="pic" />
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="font-semibold pb-1">{currentUser.firstName + " " + currentUser.lastName} </div>
                        </div>
                    </div>
                    <button className="mr-4 bg-gray-200 px-10 py-2 rounded-lg font-semibold">Hủy lời mời</button>
                </div>

                <div className="py-3 flex flex-row items-center justify-between rounded-lg cursor-pointer hover:bg-gray-100">
                    <div className="flex flex-rơw items-center pl-3">
                        <div className="w-10 h-10 bg-blue-200 rounded-full mr-2 overflow-hidden">
                            <img src={currentUser.avatar} alt="pic" />
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="font-semibold pb-1">{currentUser.firstName + " " + currentUser.lastName} </div>
                        </div>
                    </div>
                    <button className="mr-4 bg-gray-200 px-10 py-2 rounded-lg font-semibold">Hủy lời mời</button>
                </div>
            </div>
        </div>
    )
}
import { useUser } from "../components/Context/userContext"
import { Divider } from "@mui/material"
import { useModal } from "../components/Context/modalContext"
import { IoMdClose } from "react-icons/io";
import { FaEarthAsia } from "react-icons/fa6";
import { useState } from 'react'
import { sharePost } from '../api/userAPI/usePost'
import { PostListType } from '../type'
import { ToastType } from "../type";


type ShareModalProps = {
    post: PostListType,
    setToast: (toast: ToastType) => void

}


export const ShareModal: React.FC<ShareModalProps> = (props) => {

    const { post, setToast } = props
    const { currentUser } = useUser()
    const { hideModal } = useModal()
    const [value, setValue] = useState<string>("")

    const handleClick = () => {
        hideModal()
    }

    const handleSubmit = async () => {
        setToast({ open: true, msg: "Đã chia sẻ bài viết" })
        const res = await sharePost(currentUser._id, post._id, value)
        console.log(res)
    }

    return (
        <div className="flex flex-col justify-between px-4 pb-4 xs:w-full xs:max-w-[500px] h-fit m-auto top-0 left-0 bottom-0 right-0 absolute bg-white rounded-lg">
            <div className=" flex flex-row relative items-center justify-center h-[4rem] p-4">
                <div className="font-bold text-xl">Chia sẻ</div>
                <div
                    className="absolute right-0 w-10 h-10 flex items-center justify-center hover:bg-gray-200 bg-gray-100 rounded-full"
                    onClick={handleClick}
                >
                    <IoMdClose size={20} />
                </div>
            </div>
            <Divider />
            <div className="bg-white flex-1 relative">
                <div className="py-3 flex flex-row items-center rounded-lg cursor-pointer">
                    <div className="w-10 h-10 bg-blue-200 rounded-full mr-4"></div>
                    <div className="flex flex-col items-start">
                        <div className="font-semibold pb-1">{currentUser.firstName + " " + currentUser.lastName} </div>
                        <div className="flex flex-row">
                            <div className="flex flex-row items-center bg-gray-200 px-3 py-0.5 rounded-md mr-2">
                                <span className="text-sm font-semibold">Bảng feed</span>
                            </div>
                            <div className="flex flex-row items-center bg-gray-200 px-3 py-0.5 rounded-md">
                                <FaEarthAsia />
                                <span className="text-sm ml-2 font-semibold">Mọi người</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="">
                    <textarea
                        className="block resize-none mb-4 w-full outline-none h-[100px] overflow-y-auto"
                        onChange={e => {
                            setValue(e.target.value)
                        }}
                        placeholder={currentUser.lastName + " ơi, bạn đang nghĩ gì thế"}
                        value={value}
                    />

                </div>
            </div>
            <div className="flex flex-row relative items-center justify-end h-[2.5rem]">
                <button
                    className="w-fit px-8 bg-[#0068ff] h-full text-white text-lg font-semibold rounded-lg"
                    onClick={() => {
                        // onSubmit(valueRef.current)
                        handleSubmit()
                        hideModal()
                    }}
                >
                    Chia sẻ ngay
                </button>
            </div>

        </div>
    )
}
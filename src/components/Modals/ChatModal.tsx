import { Divider } from "@mui/material"
import { IoMdClose } from "react-icons/io";
import { useModal } from '../Context/modalContext'
import { useState, useEffect } from 'react'
import { UserType } from "../../type"
import { getAllUser } from '../../api/userAPI/userAuth'
import { useUser } from '../../components/Context/userContext'
import { normalizeText } from 'normalize-text';
import LoadingAnimation from "../LoadingAnimation";
import { useMsg } from "../Context/msgContext";

export const ChatModal = () => {

    const { hideModal } = useModal()
    const [users, setUsers] = useState<UserType[]>([])
    const { currentUser } = useUser()
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    const [filterData, setFilterData] = useState<UserType[]>([])
    const { addChatList } = useMsg()


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

    useEffect(() => {
        const handler = setTimeout(() => {
            if (value !== '') {
                setLoading(true)
                setFilterData(
                    users.filter((d) => normalizeText(d.firstName + ' ' + d.lastName).toLowerCase().includes(normalizeText(value).toLowerCase()))
                );
            }
            else {
                setLoading(true)
                setFilterData([]);
            }
        }, 500)
        return () => {
            setLoading(false)
            clearTimeout(handler)
        }
    }, [value])


    return (
        <div className="flex flex-col justify-between px-4 pb-4 w-[330px]  h-[410px] m-auto top-0 left-0 bottom-0 right-0 absolute bg-white rounded-lg z-100">
            <div className=" flex flex-col  justify-center items-start h-fit py-4">
                <div className="font-semibold flex flex-row items-center justify-between w-full">
                    Tin nhắn mới
                    <button
                        className="right-0 w-10 h-10 flex items-center justify-center hover:bg-gray-200 bg-gray-100 rounded-full"
                        onClick={hideModal}
                    >
                        <IoMdClose size={20} />
                    </button>

                </div>
                <div className="flex flex-row mt-2 w-full pr-4">
                    <div className="mr-4 font-semibold ">Đến</div>
                    <input type="text" className="outline-none flex-1" onChange={e => setValue(e.target.value)} />
                </div>
            </div>
            <Divider />
            <div className="bg-white flex-1 relative">
                <div className="py-3 flex flex-col justify-start rounded-lg cursor-pointer overflow-auto h-[290px]">
                    {
                        !loading ? <div className="pl-2.5">
                            <LoadingAnimation />
                        </div> :
                            filterData.map((d, k) => (
                                <div className="flex flex-row items-center mb-3" key={k} onClick={() => {
                                    addChatList(d._id)
                                    hideModal()
                                }}>
                                    <div className="w-10 h-10 bg-blue-200 rounded-full mr-2 overflow-hidden">
                                        <img src={d.avatar} alt="pic" />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <div className="font-semibold pb-1">{d.firstName + " " + d.lastName} </div>
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
        </div>
    )
}
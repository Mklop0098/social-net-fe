import { PropsWithChildren, useState, useEffect } from "react"
import { ToastType } from "../../type"
import Header from '../Header/Header'
import { Divider, Snackbar } from "@mui/material"
import { BsMenuButtonWideFill, BsPostcardFill } from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import { Link } from 'react-router-dom'
import { ChatMonitor } from "../ChatMonitor";
import { useNavigate } from 'react-router-dom'

const SearchLayout: React.FC<PropsWithChildren> = ({ children }) => {

    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem('chat-app-current-user')) {
            navigate("/login");
        }
    }, [])

    return (
        <div className='h-[100vh] flex flex-col relative'>
            <div className='sticky top-0 w-full'>
                <Header defaultStatus='newFeed' />
            </div>
            <div className='w-full'>
                <div className="h-[93vh] overflow-y-hidden flex flex-col">
                    <div className="grid md:grid-cols-5 xs:grid-cols-1 gap-1">
                        <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                            <div className="shadow-l-md xs:hidden md:block flex flex-col">
                                <div className="text-2xl font-bold py-4 px-4">Kết quả tìm kiếm</div>
                                <Divider />
                                <Link to={''}>
                                    <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer mt-2">
                                        <div className="flex -items-center col-span-1 ">
                                            <div className="bg-[--primary-color] p-1.5 rounded-full">
                                                <BsMenuButtonWideFill size={20} className="text-white p-0.5" />
                                            </div>
                                        </div>
                                        <div className="col-span-7 flex items-center text-md font-semibold pl-4 pl-4">Tất cả</div>
                                    </div>
                                </Link>
                                <Link to={''}>
                                    <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                                        <div className="flex -items-center col-span-1 ">
                                            <div className="bg-gray-200 p-1.5 rounded-full">
                                                <BsPostcardFill size={20} className="text-black p-0.5" />
                                            </div>
                                        </div>
                                        <div className="col-span-7 flex items-center text-md font-semibold pl-4">Bài viết</div>
                                    </div>
                                </Link>
                                <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                                    <div className="flex -items-center col-span-1 ">
                                        <div className="bg-gray-200 p-1.5 rounded-full">
                                            <HiUsers size={20} className="text-black p-0.5" />
                                        </div>
                                    </div>
                                    <div className="col-span-7 flex items-center text-md font-semibold pl-4">Mọi người</div>
                                </div>

                            </div>
                        </div>
                        <div className="h-[93vh] overflow-auto w-full col-span-4">
                            {
                                children
                            }
                        </div>

                        <Snackbar
                            open={toast.open}
                            onClose={() => setToast({ open: false, msg: '' })}
                            autoHideDuration={6000}
                            message={toast.msg}
                        />
                    </div>
                </div>
            </div>
            <ChatMonitor />

        </div>

    )
}

export default SearchLayout

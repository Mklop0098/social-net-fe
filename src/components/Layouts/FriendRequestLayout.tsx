import { useState, PropsWithChildren, useEffect } from "react"
import { ToastType, ModalType } from "../../type"
import { useNavigate } from 'react-router-dom'
import { Snackbar } from "@mui/material"
import { Link } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import Header from '../Header'
import { useModal } from '../Context/modalContext'
import { RequestModal } from "../Modals/RequestModal"
import { ChatMonitor } from "../ChatMonitor"


export const FriendRequestLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const navigate = useNavigate()
    const { showModal } = useModal()

    useEffect(() => {
        if (!localStorage.getItem('chat-app-current-user')) {
            navigate("/login");
        }
    }, [])

    const handleClick = () => {
        const test: ModalType = {
            toggle: true,
            root: 'modal-root',
            width: 30,
            height: 50,
            body: <RequestModal />
        }
        showModal(test);
    };

    return (
        <div className='h-[100vh] flex flex-col relative'>
            <div className='sticky top-0 w-full'>
                <Header />
            </div>
            <div>
                <div className="grid md:grid-cols-5 xs:grid-cols-1 gap-1">
                    <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                        <div className="sticky top-20 shadow-l-md xs:hidden md:block flex flex-col">
                            <div className="text-2xl font-bold py-2 px-4 flex flex-row items-center">
                                <Link to={'/friends'}>
                                    <IoArrowBack />
                                </Link>
                                <div className="ml-2">Lời mời kết bạn</div>
                            </div>
                            <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                                <div className="col-span-7 flex items-center text-lg font-semibold">Lời mời kết bạn</div>
                            </div>
                            <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer" onClick={handleClick}>
                                <div className="col-span-7 flex items-center text-lg font-semibold">Lời mời đã gửi</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4 min-h-[100vh] bg-gray-100 flex flex-col">
                        {children}
                        <ChatMonitor />
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

    )
}
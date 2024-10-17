import { useUser } from "../../components/Context/userContext"
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom'

export const Status = () => {

    const { currentUser } = useUser()

    return (
        <Link to={'/story/create'}>
            <div className="w-40 h-60 bg-white rounded-xl grid grid-rows-4 overflow-hidden shadow-md"
            >
                <div
                    className="row-span-3"
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                >

                </div>
                <div className="flex items-center justify-center font-semibold relative">
                    <div className="w-10 h-10 bg-[--primary-color] rounded-full text-white flex items-center justify-center border border-4 border-white absolute -top-4">
                        <FaPlus size={22} className="" />
                    </div>
                    <span>Tạo tin</span>
                </div>
            </div>
        </Link >
    )
}
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/userAPI/userAuth";
import { LoginInputType, ToastType } from "../../type";
import Snackbar from "@mui/material/Snackbar";

export default function Login() {

    const [input, setInput] = useState<LoginInputType>({} as LoginInputType)
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const navigate = useNavigate()


    useEffect(() => {
        if (localStorage.getItem('chat-app-current-user')) {
            navigate("/");
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const res = await login(input)
        const { msg, status, user } = res.data
        if (status) {
            localStorage.setItem(
                'chat-app-current-user',
                JSON.stringify(user)
            );

            navigate('/')
        }
        else {
            setToast({ open: true, msg: msg })
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md rounded-lg">
                <div className="flex px-5 pt-8 flex-col items-start bg-white">
                    <span className="text-2xl font-semibold">Sign In</span>
                    <span className="text-sm pt-2">Log in to your account to continue.</span>
                </div>
                <div className="bg-white w-full divide-y divide-gray-200">
                    <form className="px-5 py-7" onSubmit={handleSubmit}>
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">E-mail</label>
                        <input type="email" className={`outline-none border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full`} onChange={e => setInput({ ...input, 'email': e.target.value })} />
                        <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
                        <input type="password" className={`outline-none border rounded-lg px-3 py-2 mt-1 text-sm w-full`} onChange={e => setInput({ ...input, 'password': e.target.value })} />
                        <button
                            type="submit"
                            className="mt-2 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                        >
                            <span className="inline-block mr-2">Login</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </form>
                    <div className="py-5">
                        <div className="grid grid-cols-2 gap-1">
                            <div className="text-center sm:text-left whitespace-nowrap">
                                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 inline-block align-text-top">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="inline-block ml-1">Forgot Password</span>
                                </button>
                            </div>
                            <div className="text-center sm:text-right whitespace-nowrap">
                                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-4 h-4 inline-block align-text-bottom	"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                    <Link to={'/register'}><span className="inline-block ml-1">Register</span></Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-5">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="text-center sm:text-left whitespace-nowrap ">
                            <button
                                className="flex flex-row items-center transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-200 focus:outline-none focus:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ring-inset">
                                <FaArrowLeft />
                                <Link className="inline-block ml-1" to={'/'}>Back to Home</Link>
                            </button>
                        </div>
                    </div>
                </div>
                <Snackbar
                    open={toast.open}
                    onClose={() => setToast({ open: false, msg: '' })}
                    autoHideDuration={6000}
                    message={toast.msg}
                />
            </div>
        </div>
    );
}

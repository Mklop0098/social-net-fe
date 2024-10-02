import { useModal } from "../../components/Context/modalContext";
import { Divider } from "@mui/material";
import { FaImages } from "react-icons/fa6";
import { ModalType, PostListType, ToastType } from "../../type";
import { HomeModal } from '../../components/HomeModal'
import { useEffect, useState } from "react";
import { createPost, getAllUserPost } from '../../api/userAPI/usePost'
import { useUser } from "../../components/Context/userContext";
import Post from "../../components/Post";
import { FaEarthAsia } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { timeAgo } from "../../ultils";
import Snackbar from "@mui/material/Snackbar";

const UserArticlePage = () => {

    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });
    const [value, setValue] = useState("")
    const [flag, setFlag] = useState<boolean>(false)
    const { currentUser } = useUser()
    const [postList, setPostList] = useState<PostListType[]>([])


    const { showModal } = useModal();

    const handleClick = () => {
        const test: ModalType = {
            toggle: true,
            root: 'modal-root',
            width: 30,
            height: 50,
            body: <HomeModal setFlag={setFlag} onSubmit={handlePost} onChange={setValue} defaultValue={value} />,
            onClick: () => setFlag(false)
        }
        showModal(test);
        setFlag(true)
    };

    const handlePost = async (value: string, images: string[]) => {
        if (value !== '') {
            const res = await createPost(currentUser._id, value, images)
            if (res.data.status) {
                setPostList(postList => {
                    postList.push(res.data.data)
                    const newPost: PostListType[] = JSON.parse(JSON.stringify(postList))
                    return newPost
                })
            }
            setValue("")
            setToast({ open: true, msg: res.data.msg })
        }
    }

    useEffect(() => {
        console.log('adad')

        const getAllPost = async () => {
            const res = await getAllUserPost(currentUser._id)
            if (res.data.status) {
                console.log(res.data.data)
                setPostList(res.data.post)
            }
        }
        getAllPost()
    }, [])

    const getShareTime = (post: PostListType) => {
        let tmp = new Date()
        post.shared.map(share => {
            if (share.userId === currentUser._id) {
                console.log(post.shared, currentUser._id, timeAgo(share.createAt))
                tmp = share.createAt
            }
        })
        console.log(tmp)
        return tmp
    }

    const getComment = (post: PostListType) => {
        let tmp = ''
        post.shared.map(share => {
            if (share.userId === currentUser._id) {
                console.log(post.shared, currentUser._id, timeAgo(share.createAt))
                tmp = share.comment
            }
        })
        return tmp
    }


    return (
        <div className="w-full">
            <div className="py-4 grid grid-cols-7 xs:grid-cols-1 xl:grid-cols-7 lg:gap-4">
                <div className="my-4 bg-white shadow-sm rounded-lg px-4 py-6 col-span-3">
                    hello
                </div>
                <div className="my-4 shadow-sm rounded-lg col-span-4">
                    <div className="flex flex-col items-center justify-center bg-white rounded-lg">
                        <div className="w-full px-4">
                            <div className="flex flex-row items-center pb-4 pt-2 w-full">
                                <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                                </div>
                                <div
                                    className="text-gray-500 bg-gray-100 ml-4 px-4 py-2 cursor-pointer flex-1 rounded-full outline-none"
                                    onClick={handleClick}
                                >
                                    <div className="truncate max-w-[550px]">{(value !== '' && !flag) ? value : currentUser.lastName + " ơi, bạn đang nghĩ gì thế"}</div>
                                </div>
                            </div>
                            <Divider />
                            <div className={`hover:bg-gray-200 mt-2 w-fit px-4 rounded-lg py-2 flex flex-row items-center`}>
                                <FaImages className="text-green-400" size={20} />
                                <span className="ml-2 text-gray-600">Thêm ảnh</span>
                            </div>
                        </div>
                    </div>
                    {
                        postList.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()).map((post, key) => (
                            post.owner === currentUser._id
                                ? <div className="flex flex-col items-center justify-center bg-white rounded-lg mt-4" key={key}>
                                    <Post post={post} key={key} setToast={setToast} />
                                </div>
                                : <div className="flex flex-col bg-white rounded-lg mt-4" key={key}>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-between items-center p-4">
                                            <div className="flex flex-row items-center">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                                <div className="pl-3">
                                                    <div className='font-semibold'>
                                                        {
                                                            currentUser.firstName + ' ' + currentUser.lastName
                                                        }
                                                    </div>
                                                    <div className="flex flex-row items-center">
                                                        <div className="text-gray-500 text-sm pr-1">
                                                            {timeAgo(getShareTime(post)) + ' ago'}
                                                        </div>
                                                        <FaEarthAsia size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-full hover:bg-gray-200">
                                                <IoMdClose size={20} />
                                            </div>
                                        </div>
                                        <div className="p-4 pt-0">{getComment(post)}</div>
                                        <div className="m-4 p-4 mt-0 pt-0 border ">
                                            <Post post={post} key={key} setToast={setToast} />
                                        </div>
                                    </div>
                                </div>
                        ))
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
    )
}

export default UserArticlePage

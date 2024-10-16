import { useEffect, useState } from "react"
import { useUser } from "../../components/Context/userContext"
import { getAllUser } from "../../api/userAPI/userAuth"
import { PostListType, UserType, ToastType } from "../../type"
import { Link, useParams } from 'react-router-dom'
import { normalizeText } from 'normalize-text';
import { getAllPost } from "../../api/userAPI/usePost"
import Snackbar from "@mui/material/Snackbar";
import Post from "../postPage/Post"

function SearchPage() {

    const match = useParams<{ value: string }>()
    const { currentUser } = useUser()
    const [users, setUsers] = useState<UserType[]>([])
    const [postList, setPostList] = useState<PostListType[]>([])
    const [toast, setToast] = useState<ToastType>({ open: false, msg: '' });

    useEffect(() => {
        if (currentUser._id && match.value) {
            const getAllUserInfo = async () => {
                const res = await getAllUser(currentUser._id)
                if (res.data.status) {
                    const data: UserType[] = res.data.users
                    setUsers(data.filter((d) => normalizeText(d.firstName + ' ' + d.lastName).toLowerCase().includes(normalizeText(match.value || "").toLowerCase())))
                }
            }
            getAllUserInfo()
        }

        if (match.value) {
            const getPost = async () => {
                const res = await getAllPost()
                if (res.data.status) {
                    const data: PostListType[] = res.data.post
                    setPostList(data.filter((d) => normalizeText(d.posts).toLowerCase().includes(normalizeText(match.value || '').toLowerCase())))
                }
            }
            getPost()
        }
    }, [currentUser, match.value])

    console.log(users.length)

    return (
        <div className="col-span-4 min-h-[93vh] bg-gray-100 flex flex-col">
            <div className="max-w-[700px] w-[700px] mx-auto m-8">
                <div className="bg-white w-full p-4 shadow-sm rounded-lg">
                    <div className="font-semibold text-xl mb-4">Mọi người</div>
                    <div>
                        {
                            users.length > 0 ? users.map((user, key) => (
                                <Link to={`/profile/${user._id}`}>
                                    <div className="p-4 flex flex-row items-center w-full hover:bg-gray-100 cursor-pointer" key={key}>
                                        <div className="flex flex-row items-center w-full">
                                            <div className="w-20 h-20 rounded-lg bg-gray-200 mr-4 overflow-hidden" style={{ backgroundImage: `url(${user.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                                            <div>{user.firstName + ' ' + user.lastName}</div>
                                        </div>
                                    </div>
                                </Link>
                            )) : <div>Không có kết quả phù hợp</div>
                        }
                    </div>
                </div>
                <div className="bg-white w-full p-4 shadow-sm rounded-lg mt-4">
                    <div className="font-semibold text-xl mb-4">Bài viết</div>
                    <div>
                        {
                            postList.length > 0 ? postList.map((post, key) => (
                                <div className="border p-4" key={key}>
                                    <Post post={post} setToast={setToast} />
                                </div>
                            )) : <div>Không có kết quả phù hợp</div>

                        }
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

    )
}

export default SearchPage

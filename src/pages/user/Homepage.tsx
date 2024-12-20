import { useUser } from "../../components/Context/userContext";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ModalType, ToastType } from "../../type";
import { Divider } from "@mui/material";
import { FaImages } from "react-icons/fa6";
import { useModal } from "../../components/Context/modalContext";
import { HomeModal } from "../../components/Modals/HomeModal";
import Post from "../postPage/Post";
import Skeletons from "../../components/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import { Link, useNavigate } from "react-router-dom";
import { LoadingModal } from "../../components/Modals/LoadingModal";
import { Status } from "../Status/Status";
import { usePost } from '../../components/Context/postContext'

function Homepage() {
    const navigate = useNavigate();
    const { currentUser } = useUser();
    const { showModal, hideModal } = useModal();
    const [toast, setToast] = useState<ToastType>({ open: false, msg: "" });
    const [value, setValue] = useState("");
    const [flag, setFlag] = useState<boolean>(false);
    const newFeedRef = useRef<HTMLDivElement>(null);
    const [postLoader, setPostLoader] = useState(false);

    const { posts, createNewPost } = usePost()

    console.log(posts, 'a')

    useEffect(() => {
        const currentUserId = JSON.parse(
            localStorage.getItem("chat-app-current-user") as string
        );
        if (!currentUserId) {
            hideModal();
            navigate("/login");
        }
    }, []);

    const handleClick = () => {
        const test: ModalType = {
            toggle: true,
            root: "modal-root",
            width: 30,
            height: 50,
            body: (
                <HomeModal
                    setFlag={setFlag}
                    onSubmit={handlePost}
                    onChange={setValue}
                    defaultValue={value}
                />
            ),
            onClick: () => setFlag(false),
        };
        showModal(test);
        setFlag(true);
    };

    const handlePost = async (value: string, images: string[]) => {
        const res = await createNewPost(value, images)
        setValue("");
        setToast({ open: true, msg: res.msg });
    };

    const handleScroll = () => {
        if (newFeedRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = newFeedRef.current;
            const isNearBottom = scrollTop + clientHeight >= scrollHeight;
            if (isNearBottom) {
                setPostLoader(true);
            }
        }
        const timeoutId = setTimeout(() => {
            if (postLoader) {
                setPostLoader(false);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    };

    useLayoutEffect(() => {
        if (!currentUser._id) {
            const handleClick = () => {
                const test: ModalType = {
                    toggle: true,
                    root: "modal-root",
                    width: 30,
                    height: 50,
                    body: <LoadingModal />,
                };
                showModal(test);
            };
            handleClick();
        } else {
            hideModal();
        }
    }, [currentUser._id]);

    return (
        <div
            className="h-[93vh] overflow-y-auto flex flex-col"
            ref={newFeedRef}
            onScroll={handleScroll}
        >
            <div className="md:w-[500px] lg:w-[680px] xs:w-full xs:max-w-[500px] lg:max-w-[680px] mx-auto rounded-lg mt-4 mb-1">
                <Status />
            </div>
            <div className="flex flex-col items-center justify-center md:w-[500px] lg:w-[680px] xs:w-full 2xs:max-w-full lg:max-w-[680px] mx-auto bg-white rounded-lg my-4">
                <div className="w-full px-4 py-2">
                    <div className="flex flex-row items-center pb-4 pt-2 w-full">
                        <div
                            className="w-14 h-14 bg-gray-100 rounded-full"
                            style={{
                                backgroundImage: `url(${currentUser.avatar})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                            }}
                        ></div>
                        <div
                            className="text-gray-500 bg-gray-100 ml-4 px-4 py-2 cursor-pointer flex-1 rounded-full outline-none"
                            onClick={handleClick}
                        >
                            <div className="truncate max-w-[550px]">
                                {value !== "" && !flag
                                    ? value
                                    : currentUser.lastName + " ơi, bạn đang nghĩ gì thế"}
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div
                        className={`hover:bg-gray-200 mt-2 w-fit px-4 rounded-lg py-2 flex flex-row items-center`}
                    >
                        <FaImages className="text-green-400" size={20} />
                        <span className="ml-2 text-gray-600">Thêm ảnh</span>
                    </div>
                </div>
            </div>
            {posts
                .sort(
                    (a, b) =>
                        new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
                )
                .map((post, key) => (
                    <div
                        className="2xs:w-full md:w-[500px] lg:w-[680px] xs:max-w-[500px] lg:max-w-[680px] mx-auto bg-white rounded-lg mb-4"
                        key={key}
                    >
                        <Post post={post} setToast={setToast} />
                    </div>
                ))}
            {posts.length < 1 && (
                <div>
                    <div className="xs:w-full md:w-[500px] lg:w-[680px] xs:max-w-[500px] lg:max-w-[680px] mx-auto bg-white rounded-lg mb-4">
                        <div className="p-4 flex flex-col items-center">
                            <span className="text-xl">
                                Hãy kết bạn để xem nhiều tin hơn nhé
                            </span>
                            <Link to={"/friends"} className="mt-4">
                                <div className="bg-[--primary-color] text-white px-10 py-2 rounded-lg">
                                    Tìm bạn bè
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {postLoader && <Skeletons />}
            <Snackbar
                open={toast.open}
                onClose={() => setToast({ open: false, msg: "" })}
                autoHideDuration={6000}
                message={toast.msg}
            />
        </div>
    );
}

export default Homepage;

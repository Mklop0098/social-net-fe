import React, { PropsWithChildren, useEffect, useState } from "react";
import Header from "../Header/Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Divider } from "@mui/material";
import { FaCamera } from "react-icons/fa6";
import { UserType, ModalType, ToastType } from "../../type";
import { getUser } from "../../api/userAPI/userAuth";
import { useModal } from "../Context/modalContext";
import { ChangeImage } from "../ImageHandler/ChangeImage";
import Snackbar from "@mui/material/Snackbar";
import { useUser } from "../Context/userContext";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { getFriendDataList } from "../../api/userAPI/useFriend";

export const UserPageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const match = useParams<{ id: string; state: string }>();
  const [userInfo, setUserInfo] = useState<UserType>({} as UserType);
  const [status, setStatus] = useState("");
  const { showModal } = useModal();
  const [toast, setToast] = useState<ToastType>({ open: false, msg: "" });
  const [friends, setFriends] = useState<UserType[]>([]);
  useEffect(() => {
    if (currentUser._id) {
      const getFriendListData = async () => {
        const friends = await getFriendDataList(currentUser._id);
        if (friends.data.status) {
          setFriends(friends.data.data);
        }
      };
      getFriendListData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!localStorage.getItem("chat-app-current-user")) {
      navigate("/login");
    } else if (!match.id) {
      navigate("/");
    } else {
      const getCurrentUser = async (id: string) => {
        const userData = await getUser(id);
        if (userData.data.status) {
          setUserInfo(userData.data.userData[0]);
        }
      };
      getCurrentUser(match.id);
    }
  }, []);

  const handleClick = () => {
    const test: ModalType = {
      toggle: true,
      root: "modal-root",
      width: 30,
      height: 50,
      body: (
        <ChangeImage
          onChange={setToast}
          setUserInfo={setUserInfo}
          userInfo={userInfo}
          state="background"
        />
      ),
    };
    showModal(test);
  };

  const handleClickAvatar = () => {
    const test: ModalType = {
      toggle: true,
      root: "modal-root",
      width: 30,
      height: 50,
      body: (
        <ChangeImage
          onChange={setToast}
          setUserInfo={setUserInfo}
          userInfo={userInfo}
          state="avatar"
        />
      ),
    };
    showModal(test);
  };

  return (
    <div className="h-[100vh] flex flex-col relative">
      <div className="sticky top-0 w-full z-50">
        <Header />
      </div>
      <div className="w-full">
        <div className="h-[93vh] overflow-y-auto flex flex-col">
          <div className="shadow-md">
            <div className="2xl:w-2/3 xl:w-[80%] xs:w-full mx-auto flex flex-col">
              <div
                className="w-full h-[460px] xs:h-[40vw] xl:h-[30vw] bg-gray-300 rounded-lg relative"
                style={{
                  backgroundImage: `url(${userInfo.backgroundImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <div
                  onClick={handleClick}
                  className="z-100 flex flex-row absolute bottom-3 xs:right-4 right-10 items-center py-2 px-3 bg-white rounded-md cursor-pointer hover:bg-gray-100"
                >
                  <FaCamera />
                  <span className="ml-3 xs:hidden lg:block">
                    Chỉnh sửa ảnh bìa
                  </span>
                </div>
              </div>
              <div className="w-full xs:pb-4 lg-pb-0">
                <div className="mx-9 flex flex-row xs:flex-col lg:flex-row items-center">
                  <div
                    className="w-[180px] h-[180px] relative"
                    onClick={handleClickAvatar}
                  >
                    <div
                      className="bg-gray-400 w-full h-full rounded-full border border-4 border-white absolute -top-9 left-0 overflow-hidden"
                      style={{
                        backgroundImage: `url(${userInfo.avatar})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div className="flex items-center justify-center absolute bottom-14 right-2  border border-2 border-blue-200 items-center py-2 w-8 h-8 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-200">
                      <FaCamera />
                    </div>
                  </div>
                  {userInfo._id ? (
                    <div className="lg:pl-6 xs:pl-0 flex flex-col xs:items-center lg:items-start">
                      <span className="text-2xl font-semibold mb-2">
                        {userInfo.firstName + " " + userInfo.lastName}
                      </span>
                      <span className="text-gray-500 font-semibold mb-2">
                        {friends.length} người bạn
                      </span>
                      <div className="flex flex-row">
                        {friends.map((user, key) => (
                          <div
                            key={key}
                            className="flex mr-1 items-center justify-center w-8 h-8 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-200 border border-2 border-white"
                            style={{
                              backgroundImage: `url(${user.avatar})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Stack>
                      <div className="lg:pl-6 xs:pl-0 flex flex-col xs:items-center lg:items-start">
                        <Skeleton variant="text" width={200} height={50} />
                        <Skeleton variant="text" width={100} height={20} />
                        <div className="flex flex-row">
                          <div className="flex mr-1 items-center justify-center w-8 h-8 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-200 border border-2 border-white"></div>
                        </div>
                      </div>
                    </Stack>
                  )}
                </div>
              </div>
              <Divider />
              <div className="flex flex-row">
                <div
                  className={`${status === "artical"
                    ? "border-blue-500/100"
                    : "border-blue-500/0"
                    } border-b-4 w-[88px] h-[66px] cursor-pointer flex flex-row items-center`}
                  onClick={() => setStatus("artical")}
                >
                  <Link to={`/${match.id}`} className="w-[80px] h-[56px]">
                    <div className="flex items-center justify-center w-full h-full mx-1 hover:bg-gray-100 rounded-lg">
                      Bài viết
                    </div>
                  </Link>
                </div>
                <div
                  className={`${status === "friends"
                    ? "border-blue-500/100"
                    : "border-blue-500/0"
                    } border-b-4 w-[88px] h-[66px] cursor-pointer flex flex-row items-center`}
                  onClick={() => setStatus("friends")}
                >
                  <Link
                    to={`/${match.id}/friends`}
                    className="w-[80px] h-[56px]"
                  >
                    <div className="flex items-center justify-center w-full h-full mx-1 hover:bg-gray-100 rounded-lg">
                      Bạn bè
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {userInfo._id && (
            <div className="mt-1 bg-gray-100">
              <div className=" xs:w-full md:max-w-[660px] mx-auto xl:max-w-[80%] 2xl:w-3/5">
                {children}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <ChatMonitor /> */}
      <Snackbar
        open={toast.open}
        onClose={() => setToast({ open: false, msg: "" })}
        autoHideDuration={6000}
        message={toast.msg}
      />
    </div>
  );
};

export default UserPageLayout;

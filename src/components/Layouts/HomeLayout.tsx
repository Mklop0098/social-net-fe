import React, { PropsWithChildren } from "react";
import Header from "../Header/Header";
import { ChatMonitor } from "../Chat/ChatMonitor";
import { IoSearchOutline } from "react-icons/io5";
import { useMsg } from "../../components/Context/msgContext";
import { useUser } from "../../components/Context/userContext";
import { useState, useEffect, useLayoutEffect } from "react";
import { UserType, ModalType, ToastType } from "../../type";
import { useModal } from "../../components/Context/modalContext";
import Snackbar from "@mui/material/Snackbar";
import { HiUserGroup } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { LoadingModal } from "../../components/Modals/LoadingModal";
import { getFriendDataList } from "../../api/userAPI/useFriend";
import { useFriend } from '../Context/friendContext'

export const HomeLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("chat-app-current-user")) {
      navigate("/login");
    }
  }, []);

  const { addChatList } = useMsg();
  const { currentUser } = useUser();
  const { showModal, hideModal } = useModal();
  const [toast, setToast] = useState<ToastType>({ open: false, msg: "" });
  const [friends, setFriends] = useState<UserType[]>([]);
  const { onlineFriends } = useFriend()


  useEffect(() => {
    const currentUserId = JSON.parse(
      localStorage.getItem("chat-app-current-user") as string
    );
    if (!currentUserId) {
      hideModal();
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const getFriendListData = async () => {
      const friends = await getFriendDataList(currentUser._id);
      if (friends.data.status) {
        setFriends(friends.data.data);
      }
    };
    getFriendListData();
  }, [currentUser._id]);

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
    <div className="h-[100vh] flex flex-col relative">
      <div className="sticky top-0 w-full z-50">
        <Header defaultStatus="newFeed" />
      </div>
      <div className="w-full">
        <div className="h-[93vh] overflow-y-hidden flex flex-col ">
          <div className="flex-1 ">
            <div className="relative">
              <div className="h-full w-[20%] 2xs:hidden xl:block absolute">
                <div className="h-[93vh] overflow-y-auto flex flex-col font-semibold py-5">
                  <Link to={`${currentUser._id}`}>
                    <div className="py-3 px-4 hover:bg-gray-200 grid grid-cols-9 items-center rounded-lg cursor-pointer">
                      <div
                        className=" col-span-1 w-7 h-7 bg-blue-200 rounded-full overflow-hidden "
                        style={{
                          backgroundImage: `url(${currentUser.avatar})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      ></div>
                      <div className="col-span-7">
                        {currentUser.firstName + " " + currentUser.lastName}{" "}
                      </div>
                    </div>
                  </Link>
                  <Link to={"/friends"}>
                    <div className="py-3 px-4 hover:bg-gray-200 grid grid-cols-9 items-center rounded-lg cursor-pointer">
                      <HiUserGroup
                        size={26}
                        className="text-[--primary-color] col-span-1"
                      />
                      <div className="col-span-7">Tìm bạn bè</div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bg-gray-100 col-span-3 ">{children}</div>
              <div className="h-full w-[20%] absolute right-1 top-0 2xs:hidden xl:block">
                <div className="max-h-[93vh] overflow-y-auto flex flex-col p-3">
                  <div className="flex flex-row items-center justify-between p-2">
                    <span className="text-lg font-semibold">Người liên hệ</span>
                    <IoSearchOutline size={20} />
                  </div>
                  {
                    friends.length < 1 && <div className="p-4">Chưa có bạn bè</div>
                  }
                  {friends.map((user, key) => (
                    <div
                      className="p-2 hover:bg-gray-100 flex flex-row items-center rounded-lg cursor-pointer"
                      key={key}
                      onClick={() => addChatList(user._id)}
                    >
                      <div
                        className="w-10 h-10 bg-blue-200 rounded-full mr-4 relative border"
                        style={{
                          backgroundImage: `url(${user.avatar}`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }}
                      >
                        {
                          onlineFriends.includes(user._id) &&
                          <div className={`bg-green-500 w-3 h-3  rounded-full bottom-0 absolute right-0`}></div>
                        }
                      </div>
                      <div>{user.firstName + " " + user.lastName} </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Snackbar
            open={toast.open}
            onClose={() => setToast({ open: false, msg: "" })}
            autoHideDuration={6000}
            message={toast.msg}
          />
        </div>
      </div>
      <ChatMonitor />
    </div>
  );
};

export default HomeLayout;

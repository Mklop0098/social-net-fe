import { useState, PropsWithChildren, useEffect } from "react";
import { ToastType, ModalType } from "../../type";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import Header from "../Header/Header";
import { useModal } from "../Context/modalContext";
import { RequestModal } from "../Modals/RequestModal";
import { ChatMonitor } from "../Chat/ChatMonitor";

export const FriendRequestLayout: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastType>({ open: false, msg: "" });
  const navigate = useNavigate();
  const { showModal } = useModal();

  useEffect(() => {
    if (!localStorage.getItem("chat-app-current-user")) {
      navigate("/login");
    }
  }, []);

  const handleClick = () => {
    const test: ModalType = {
      toggle: true,
      root: "modal-root",
      width: 30,
      height: 50,
      body: <RequestModal />,
    };
    showModal(test);
  };

  return (
    <div className="h-[100vh] flex flex-col relative">
      <div className="sticky top-0 w-full">
        <Header defaultStatus="newFeed" />
      </div>
      <div className="w-full">
        <div className="h-[93vh] overflow-y-hidden flex flex-col">
          <div className="md:grid md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-10 gap-1">
            <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)] md:col-span-2 2xl:col-span-2">
              <div className="shadow-l-md md:block flex flex-col">
                <div className="text-2xl font-bold py-2 px-4 flex flex-row items-center mt-4">
                  <Link to={"/friends"}>
                    <IoArrowBack />
                  </Link>
                  <div className="ml-2">Lời mời kết bạn</div>
                </div>
                <div className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                  <div className="col-span-7 flex items-center text-md font-semibold">
                    Lời mời kết bạn
                  </div>
                </div>
                <div
                  className="grid grid-cols-9 py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer"
                  onClick={handleClick}
                >
                  <div className="col-span-7 flex items-center text-md font-semibold">
                    Lời mời đã gửi
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[93vh] overflow-auto w-full md:col-span-3 lg:col-span-4 2xl:col-span-8">
              {children}
            </div>

            <Snackbar
              open={toast.open}
              onClose={() => setToast({ open: false, msg: "" })}
              autoHideDuration={6000}
              message={toast.msg}
            />
          </div>
        </div>
      </div>
      <ChatMonitor />
    </div>
  );
};

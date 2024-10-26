import ChatBox from "./ChatBox";
import MiniChatBox from "./MiniChatBox";
import { useMsg } from "../Context/msgContext";
import { useState } from "react";
import { ToastType, ModalType } from "../../type";
import { useModal } from "../Context/modalContext";
import Snackbar from "@mui/material/Snackbar";
import { ChatModal } from "../Modals/ChatModal";
import { PiNotePencil } from "react-icons/pi";

type ChatMonitorProps = {
  shortcut?: boolean;
};

export const ChatMonitor: React.FC<ChatMonitorProps> = ({
  shortcut = true,
}) => {
  const { activeChatList, minimizeChatBoxList } = useMsg();
  const [toast, setToast] = useState<ToastType>({ open: false, msg: "" });
  const { showModal } = useModal();

  const handleClick = () => {
    const test: ModalType = {
      toggle: true,
      root: "modal-root",
      width: 30,
      height: 50,
      body: <ChatModal />,
    };
    showModal(test);
  };

  return (
    <div className="m-w-[1050px] h-[420px] bottom-0 right-10 absolute flex flex-row ">
      <div className="flex flex-row h-full z-0">
        {activeChatList.slice(0, 3).map((user, key) => (
          <ChatBox key={key} user={user} />
        ))}
      </div>
      <div className="w-20 h-full flex flex-col items-center justify-end pb-8">
        {minimizeChatBoxList.slice(0, 3).map((user, key) => (
          <MiniChatBox key={key} user={user} />
        ))}
        {minimizeChatBoxList.length > 3 && (
          <div className="w-14 h-14 bg-gray-200 mt-4 rounded-full flex items-center justify-center">
            {"+" + minimizeChatBoxList.slice(3).length}
          </div>
        )}
        {shortcut && (
          <div
            className="p-4 bg-gray-200 mt-4 rounded-full flex items-cemter justify-center cursor-pointer"
            onClick={handleClick}
          >
            <PiNotePencil size={28} />
          </div>
        )}
      </div>
      <Snackbar
        open={toast.open}
        onClose={() => setToast({ open: false, msg: "" })}
        autoHideDuration={6000}
        message={toast.msg}
      />
    </div>
  );
};

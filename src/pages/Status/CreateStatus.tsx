import { useState, useEffect } from "react";
import { ToastType, ModalType } from "../../type";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import { PiTextAaBold } from "react-icons/pi";
import { IoSettingsSharp } from "react-icons/io5";
import SubHeader from "../../components/Header/SubHeader";
import { useModal } from "../../components/Context/modalContext";
import { RequestModal } from "../../components/Modals/RequestModal";
import { ChatMonitor } from "../../components/Chat/ChatMonitor";
import { useUser } from "../../components/Context/userContext";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { getAllImages } from "../../api/userAPI/useFirebase";
import { Input } from 'antd'
import { createStory } from '../../api/userAPI/useStory'
import "./style.css";

export const CreateStatus = () => {
  const [toast, setToast] = useState<ToastType>({ open: false, msg: "" });
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { currentUser } = useUser();
  const [ready, setReady] = useState(false);
  const [bgList, setBgList] = useState<string[]>([]);
  const [currentBg, setCurrentBg] = useState("");
  const [value, setValue] = useState("");
  const [link, setLink] = useState("")

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

  useEffect(() => {
    const getImg = async () => {
      const res = await getAllImages();
      if (res) {
        setBgList(res);
        setCurrentBg(res[0]);
      }
    };
    getImg();
  }, []);

  const handlePostStory = async () => {
    const res = await createStory(currentUser._id, value, currentBg, link)
    setToast({ open: true, msg: res.data.msg })
    if (res.status) {
      navigate('/')
    }
  }

  return (
    <div className="h-[100vh] flex flex-col relative">
      <div className="sticky top-0 w-full">
        <SubHeader />
      </div>
      <div className="w-full">
        <div className="h-[93vh] overflow-y-hidden flex flex-col">
          <div className="grid md:grid-cols-5 xs:grid-cols-1 gap-1">
            <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <div className="shadow-l-md xs:hidden md:block flex flex-col">
                <div className="w-full text-2xl font-bold py-2 px-4 flex flex-row items-center justify-between mt-4">
                  <div className="ml-2">Tin của bạn</div>
                  <div onClick={handleClick}>
                    <IoSettingsSharp />
                  </div>
                </div>
                <div className="py-2 hover:bg-gray-200 py-2 px-4 mx-2 rounded-lg cursor-pointer">
                  <div className="hover:bg-gray-200 flex items-center rounded-lg cursor-pointer">
                    <div
                      className="w-16 h-16 border border-gray-300 bg-blue-200 rounded-full overflow-hidden"
                      style={{
                        backgroundImage: `url(${currentUser.avatar})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    ></div>
                    <div className="ml-4">
                      {currentUser.firstName + " " + currentUser.lastName}{" "}
                    </div>
                  </div>
                </div>
                {ready && (
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <div className="textarea-label rounded-lg">
                        <p className="ml-[12px] text-sm mt-2">Văn bản</p>
                        <TextareaAutosize
                          className="textarea-style"
                          minRows={6}
                          maxRows={6}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </div>
                      <div className="border border-[#bdbdbd] flex flex-col rounded-lg mt-4 p-4">
                        <div>Phông nền</div>
                        <div className="grid grid-cols-8 mt-4">
                          {bgList.map((bg, key) => (
                            <div
                              onClick={() => setCurrentBg(bg)}
                              key={key}
                              className="w-8 h-8 rounded-full shadow-lg"
                              style={{
                                backgroundImage: `url(${bg})`,
                                backgroundPosition: "bottom",
                                backgroundSize: "cover",
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="border border-[#bdbdbd] flex flex-col rounded-lg mt-4 p-4">
                        <div>Điều hướng</div>
                        <div className="mt-4">
                          <Input className="w-full" onChange={e => setLink(e.target.value)} />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-evenly mt-12">
                      <button
                        className="bg-gray-200 py-2 px-12 rounded-md"
                        onClick={() => {
                          setReady(false);
                          setValue("");
                        }}
                      >
                        Bỏ
                      </button>
                      <button className="bg-[--primary-color] text-white py-2 px-12 rounded-md" onClick={handlePostStory}>
                        Chia sẻ lên tin
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="h-[93vh] overflow-auto w-full flex items-center justify-center col-span-4 bg-gray-200">
              {!ready ? (
                <div
                  className="w-[220px] h-[330px] m-auto bg-gradient-to-tr from-indigo-600 via-red-400 to-purple-600 rounded-xl flex items-center justify-center"
                  onClick={() => setReady(true)}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <PiTextAaBold />
                    </div>
                    <span className="font-semibold text-white mt-4">
                      Tạo tin dạng văn bản
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-[900px] h-[900px] bg-white flex flex-col shadow-lg p-6 rounded-lg">
                  <div>Xem trước</div>
                  <div className="flex-1 bg-black rounded-lg mt-3 flex items-center justify-center">
                    <div
                      className="h-[96%] w-[50%] bg-red-100 m-auto rounded-lg flex items-center justify-center"
                      style={{
                        backgroundImage: `url(${currentBg})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                      }}
                    >
                      {value !== "" ? (
                        <TextareaAutosize
                          value={value}
                          className="textarea-show"
                          maxRows={12}
                          minRows={1}
                        />
                      ) : (
                        <div className="text-white text-[24px] font-semibold">
                          BẮT ĐẦU NHẬP
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ChatMonitor shortcut={false} />
      <Snackbar
        open={toast.open}
        onClose={() => setToast({ open: false, msg: "" })}
        autoHideDuration={6000}
        message={toast.msg}
      />
    </div>
  );
};

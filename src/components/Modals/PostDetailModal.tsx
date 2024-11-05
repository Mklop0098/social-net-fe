import { PostListType, ToastType } from "../../type"
import Snackbar from "@mui/material/Snackbar";
import { Carousel } from "../Carousel/Carousel";
import { ChatMonitor } from "../Chat/ChatMonitor";
import { useEffect, useRef, useState } from "react";
import { FaFacebookMessenger, FaBell } from "react-icons/fa";
import { CustomMenu } from "../CustomMenu/CustomMenu";
import { Divider } from "@mui/material";
import { useUser } from "../Context/userContext";
import { getAllUser } from "../../api/userAPI/userAuth";
import { useNotify } from "../Context/notifyContext";
import { getAllNotifies, readNotifies } from "../../api/userAPI/userNotify";
import { NotifyType, UserType } from "../../type";
import { haveUnreadNotify, timeAgo } from "../../ultils";
import { useMsg } from "../Context/msgContext";
import { useSocket } from "../Context/socketIOContext";
import { GetReceiveMessage } from '../../api/userAPI/useMessage'
import { IoMdClose } from "react-icons/io";
import { useModal } from '../Context/modalContext'
import PostMini from '../../pages/postPage/PostMini'


type PostDetailProps = {
  post?: PostListType
}

type MessReceiveType = {
  from: string,
  to: string,
  readed: boolean,
  message: string,
  createAt: Date
}

type NewChatType = { from: string, to: string, msg: string }

export const PostDetail: React.FC<PostDetailProps> = (props) => {

  const { post = {} as PostListType } = props

  const messRef = useRef(null);
  const infoRef = useRef(null);
  const notifyRef = useRef(null);
  const [toast, setToast] = useState<ToastType>({ open: false, msg: "" });


  const [showMess, setShowMess] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [newNotify, setNewNotify] = useState<boolean>(false)
  const [messageReceive, setMessageReceive] = useState<MessReceiveType[]>([])
  const [newChat, setNewChat] = useState<NewChatType>({} as NewChatType)
  const [users, setUsers] = useState<UserType[]>([])

  const { currentUser } = useUser()
  const { notifies, setNotifiesList } = useNotify()
  const { newMessage, activeChatList, addChatList, setNewMessage } = useMsg()
  const { socket } = useSocket()
  const { hideModal } = useModal()

  useEffect(() => {

    if (currentUser && socket) {
      socket.emit("add-user", currentUser._id)
    }
    if (currentUser._id) {
      const getAllUserInfo = async () => {
        const res = await getAllUser(currentUser._id)
        if (res.data.status) {
          setUsers(res.data.users)
        }
      }
      getAllUserInfo()
    }

  }, [currentUser])

  const getCurrentFriend = (userId: string) => {
    const test = users.find(user => user._id === userId)
    if (test) {
      return test
    }
    return {} as UserType
  }

  const getMessageReceive = (messList: MessReceiveType[]): MessReceiveType[] => {
    let tmp: MessReceiveType[] = []
    messList.map((mess) => {
      const exist1 = tmp.find(item => item.from === mess.from && item.to === mess.to)
      const exist2 = tmp.find(item => item.from === mess.to && item.to === mess.from)
      const event1 = new Date(mess.createAt);

      if (!exist1 && !exist2) {
        tmp.push(mess)
      }
      else if (exist1) {
        const event = new Date(exist1.createAt);
        if (event1 > event) {
          const change = tmp.filter(item => item.createAt !== exist1.createAt)
          change.push(mess)
          tmp = change
        }
      }
      else if (exist2) {
        const event = new Date(exist2.createAt);
        if (event1 > event) {
          const change = tmp.filter(item => item.createAt !== exist2.createAt)
          change.push(mess)
          tmp = change
        }
      }
    })

    return tmp
  }

  useEffect(() => {
    if (socket) {
      socket.on("msg-receive", (data: NewChatType) => {
        setNewMessage(true)
        setNewChat(data)
        if (currentUser._id) {
          const getReceive = async () => {
            const res = await GetReceiveMessage(currentUser._id)
            const messList: MessReceiveType[] = res.data.projectedMessages

            setMessageReceive(getMessageReceive(messList))
          }
          getReceive()
        }
      });
      socket.on("post-liked", () => {
        setNewNotify(true)

        if (currentUser) {
          const getCurrentNotify = async (id: string) => {
            const userNotify = await getAllNotifies(id)
            if (userNotify.data.status) {
              const notifies = userNotify.data.notify[0].notify
              setNotifiesList(notifies as NotifyType[])
            }
          }
          getCurrentNotify(currentUser._id)
        }
      });

      socket.on("post-commented", () => {
        setNewNotify(true)

        if (currentUser) {
          const getCurrentNotify = async (id: string) => {
            const userNotify = await getAllNotifies(id)
            if (userNotify.data.status) {
              const notifies = userNotify.data.notify[0].notify
              setNotifiesList(notifies as NotifyType[])
            }
          }
          getCurrentNotify(currentUser._id)
        }
      });
    }

  }, []);

  useEffect(() => {
    if (newChat.from && !activeChatList.find(user => user.userId === newChat.from)) {
      addChatList(newChat.from)
    }
  }, [newChat])

  const handleClickNotify = async () => {
    const res = await readNotifies(currentUser._id)
    if (res.data.status) {
      const notifies = res.data.notify[0].notify
      setNotifiesList(notifies as NotifyType[])
    }
    setShowNotify(true)
    setNewNotify(false)
  }

  useEffect(() => {
    if (currentUser._id) {
      const getReceive = async () => {
        const res = await GetReceiveMessage(currentUser._id)
        const messList: MessReceiveType[] = res.data.projectedMessages
        setMessageReceive(getMessageReceive(messList))
        const returnList = messList.find(mess => mess.readed === false)
        if (returnList) {
          setNewMessage(true)
        }
      }
      getReceive()
    }
  }, [currentUser, newMessage])


  const handleShowMess = () => {
    setShowMess(true)
    setNewMessage(false)
  }


  return (
    <div className="top-0 left-0 bottom-0 right-0 absolute bg-white w-[100vw] h-[100vh]">
      <div className="grid grid-cols-5 ">
        <div className="absolute top-0 left-0 flex items-center justify-between w-full pl-10 pr-4 text-white z-50">
          <div className="flex items-center h-[60px]" onClick={hideModal}>
            <div className="w-10 h-10 bg-gray-500 flex items-center justify-center rounded-full cursor-pointer">
              <IoMdClose size={22} />
            </div>
            <div className="w-10 h-10 bg-[--primary-color] rounded-full ml-2  cursor-pointer"></div>
          </div>
          <div className="flex flex-row items-center">
            <div
              ref={messRef}
              className="p-2.5 mx-2 bg-gray-200 rounded-full cursor-pointer relative"
              onClick={handleShowMess}
            >
              <FaFacebookMessenger size={20} className="text-black" />
              {
                newMessage && <div className="w-3 h-3 bg-red-500 absolute top-0 right-0 rounded-full"></div>
              }
            </div>
            <div
              className="p-2.5 mx-2 bg-gray-200 rounded-full cursor-pointer relative"
              ref={notifyRef}
              onClick={handleClickNotify}
            >
              <FaBell size={20} className="text-black" />
              {
                (haveUnreadNotify(notifies) || newNotify) && <div className="w-3 h-3 bg-red-500 absolute top-0 right-0 rounded-full"></div>
              }
            </div>
            <div
              className="ml-2 w-11 h-11 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
              ref={infoRef}
              onClick={() => setShowInfo(true)}
              style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
            >

            </div>
          </div>
        </div>
        <div className="col-span-4 bg-black">
          <Carousel srcs={post.imgaes || []} slidePerView={1} />
        </div>
        <div className="flex flex-col relative">
          <div className="flex flex-row justify-end items-center pl-4 h-[60px] pr-4 shadow-md">

            <CustomMenu
              anchorEl={messRef.current}
              open={showMess}
              className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
              onClose={() => {
                setShowMess(false)
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <div className="flex flex-col px-2">
                <div className="text-xl px-2 font-bold pt-4 pb-2">Doan Chat</div>
                {
                  messageReceive.length > 0 ? messageReceive.map((mess, key) => (
                    <div
                      key={key}
                      className='hover:bg-gray-100 w-full p-3 flex flex-row items-center cursor-pointer'
                      onClick={() => {
                        addChatList(mess.from !== currentUser._id ? mess.from : mess.to)
                        setShowMess(false)
                      }}
                    >
                      <div className='w-14 h-14 rounded-full bg-gray-300 p-3 mr-3' style={{ backgroundImage: `url(${getCurrentFriend(mess.from !== currentUser._id ? mess.from : mess.to).avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}></div>
                      <div className='flex flex-col justify-between flex-1'>
                        <div className='font-semibold'>{getCurrentFriend(mess.from !== currentUser._id ? mess.from : mess.to).firstName + ' ' + getCurrentFriend(mess.from !== currentUser._id ? mess.from : mess.to).lastName}</div>
                        <div className='text-sm text-gray-500 flex flex-row justify-between'>
                          <div className="max-w-[120px] truncate">{mess.from === currentUser._id ? `Bạn ${mess.message}` : mess.message}</div>
                          <span className="w-fit">{timeAgo(mess.createAt)}</span>
                        </div>
                      </div>
                    </div>
                  )) : <div className='hover:bg-gray-100 w-full p-3 flex flex-row items-center justify-center cursor-pointer py-12'>
                    <span className='text-md text-gray-500'>Không có tin nhan moi</span>
                  </div>
                }
              </div>
            </CustomMenu>
            <CustomMenu
              anchorEl={infoRef.current}
              open={showInfo}
              className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
              onClose={() => setShowInfo(false)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <div className="flex flex-col justify-between items-start p-3">
                <div className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] w-full flex flex-col justify-center">
                  <div className="flex flex-row items-center p-4">
                    <div className="bg-gray-500 rounded-full w-12 h-12 mr-4 overflow-hidden" style={{ backgroundImage: `url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                    </div>
                    <div className="text-lg font-semibold">{currentUser.firstName + ' ' + currentUser.lastName}</div>
                  </div>
                  <Divider />
                  <a href={`/${currentUser._id}`}>
                    <div className="p-4 text-[--primary-color] cursor-pointer">Xem trang cá nhân</div>
                  </a>
                </div>
              </div>
            </CustomMenu>
            <CustomMenu
              anchorEl={notifyRef.current}
              open={showNotify}
              className="shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
              onClose={() => setShowNotify(false)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <div className="flex flex-col justify-between items-start flex flex-col max-h-[80vh]">
                <span className='text-xl font-bold  p-3'>Thông báo</span>
                {
                  notifies.length > 0 ? notifies.reverse().map((notify, key) => (
                    <a href={'/friends'} key={key}>
                      <div className='hover:bg-gray-100 w-full p-3 flex flex-row items-center cursor-pointer' >
                        <div className='w-14 h-14 rounded-full bg-gray-300 overflow-hidden mr-3' style={{ backgroundImage: `url(${getCurrentFriend(notify.from).avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                        </div>
                        <div className='flex flex-col justify-between flex-1'>
                          <div className='font-semibold'>{notify.notifyMsg}</div>
                          <div className='text-sm text-gray-500'>{timeAgo(notify.createAt) + ' ago'}</div>
                        </div>
                      </div>
                    </a>
                  )) :
                    <div className='hover:bg-gray-100 w-full p-3 flex flex-row items-center justify-center cursor-pointer py-12'>
                      <span className='text-md text-gray-500'>Không có thông báo</span>
                    </div>
                }

              </div>
            </CustomMenu>
          </div >
          <div className="max-h-[93vh] overflow-y-auto">
            <PostMini post={post} setToast={setToast} />
          </div>
        </div>
        <Snackbar
          open={toast.open}
          onClose={() => setToast({ open: false, msg: "" })}
          autoHideDuration={6000}
          message={toast.msg}
        />
      </div>
      <ChatMonitor shortcut={false} />
    </div>
  )
}

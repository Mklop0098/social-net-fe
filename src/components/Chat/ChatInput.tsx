import React, { useState, useEffect } from 'react'
import { AiFillLike } from 'react-icons/ai'
import { IoSend } from 'react-icons/io5'
import { MessageReturnType } from '../../type'
import { useUser } from '../Context/userContext'
import { useSocket } from '../Context/socketIOContext'
import { SendMessage } from '../../api/userAPI/useMessage'
import { SendImage } from '../ImageHandler/SendImage'
import { IoMdClose } from "react-icons/io";
import { ImageUploadType } from '../ImageHandler/UploadImage'
import { imageDb } from '../../components/FirebaseImg/Config'
import { ref, uploadBytes, StorageReference, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'
type ChatInputProps = {
  messages: MessageReturnType[]
  setMessages: (mess: MessageReturnType[]) => void
  friendId: string
}

const ChatInput: React.FC<ChatInputProps> = (props) => {

  const { messages, setMessages, friendId } = props
  const [uploadImages, setUploadImages] = useState<ImageUploadType[]>([])
  const [msg, setMsg] = useState<string>('')
  const { currentUser } = useUser()

  const { socket } = useSocket()

  const getUrls = (arr: ImageUploadType[]) => arr.map(item => item.url);

  const handleSubmit = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.preventDefault()
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, imgs: getUrls(uploadImages) });
    setMessages(msgs);
    setMsg('')
    setUploadImages([])
    if (uploadImages.length > 0) {
      const uploadPromises = uploadImages.map(async (image) => {
        const storageRef: StorageReference = ref(imageDb, `files/${v4()}`)
        await uploadBytes(storageRef, image.file);
        return getDownloadURL(storageRef);
      });

      try {
        const linksReturn: string[] = await Promise.all(uploadPromises);
        socket?.emit("send-msg", {
          to: friendId,
          from: currentUser._id,
          msg: { text: msg, imgs: linksReturn },
        });
        await SendMessage(currentUser._id, friendId, { text: msg, imgs: linksReturn })
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    }
    else if (msg.length > 0) {
      socket?.emit("send-msg", {
        to: friendId,
        from: currentUser._id,
        msg: { text: msg, imgs: [] },
      });
      await SendMessage(currentUser._id, friendId, { text: msg, imgs: [] })
    }
  }

  const handleLike = async () => {
    socket?.emit("send-msg", {
      to: friendId,
      from: currentUser._id,
      msg: { text: '#like', imgs: [] },
    });
    await SendMessage(currentUser._id, friendId, { text: '#like', imgs: [] })
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: '#like', imgs: [] });
    setMessages(msgs);
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value)
    socket?.emit("on-typing", {
      to: friendId,
      from: currentUser._id,
      state: e.target.value.length > 0
    });
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      socket?.emit("on-typing", {
        to: friendId,
        from: currentUser._id,
        state: ""
      });
    }, 1000)
    return () => clearTimeout(handler)
  }, [msg])

  const handleDelete = (image: ImageUploadType) => {
    if (!uploadImages.find(i => i.url === image.url)) {
      setUploadImages([...uploadImages, image])
    }
    else {
      setUploadImages(uploadImages.filter(i => i.url !== image.url))
    }
  }

  return (
    <div className=" h-[50px] flex flex-row items-center px-2 justify-between my-2">
      <div className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer ">
        <AiFillLike className='text-blue-500' size={24} onClick={handleLike} />
      </div>
      <div className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center cursor-pointer ">
        <SendImage setUploadImages={setUploadImages} uploadImages={uploadImages} />
      </div>
      <div className='relative'>
        {
          uploadImages.length > 0 &&
          <div className='absolute bottom-[100%] w-full bg-gray-100 overflow-x-auto flex flex-row px-2 rounded-md'>
            {
              uploadImages.map((i, key) => (
                <div key={key} className='py-4 relative'>
                  <div className="group border w-[40px] h-[40px] mx-1 bg-gray-300 overflow-hidden shadow-md rounded-lg"><img className="w-full" src={i.url} alt="pic" />
                    <div
                      onClick={() => handleDelete(i)}
                      className='opacity-0 group-hover:opacity-100 absolute w-[16px] h-[16px] bg-white top-4 left-8 flex items-center justify-center rounded-full shadow-md cursor-pointer'>
                      <IoMdClose size={14} />
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        }
        <input type="text" className="focus:outline-none bg-gray-100 py-1 px-4 rounded-full" onChange={handleChange} value={msg} />
      </div>
      <div className="flex items-center justify-center ">
        <IoSend size={20} className="text-blue-500 cursor-pointer" onClick={e => handleSubmit(e)} />
      </div>
    </div>
  )
}

export default ChatInput

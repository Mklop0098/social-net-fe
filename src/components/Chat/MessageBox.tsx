import React, { useEffect, useRef, useState } from "react";
import { MessageReturnType } from "../../type";
import { useUser } from "../Context/userContext";
import { TypingType } from "./ChatBox";
import LoadingAnimation from "../LoadingAnimation";
import { AiFillLike } from "react-icons/ai";
import { Modal } from 'antd';

type MessageBoxProps = {
  messages: MessageReturnType[];
  isTyping: TypingType;
  friendId: string;
};

const MessageBox: React.FC<MessageBoxProps> = (props) => {
  const { messages, isTyping, friendId } = props;
  const [currentImg, setCurrentImg] = useState('')

  const { currentUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const handleOpen = (current: string) => {
    setCurrentImg(current)
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.lastElementChild?.scrollIntoView();
    }
  }, [messages, isTyping]);

  const checkLink = (text: string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
      '((([a-zA-Z0-9$-_@.&+!*"(),]+)\\.)+([a-zA-Z]{2,})|' +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*" +
      "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" +
      "(\\#[-a-zA-Z0-9_]*)?$",
      "i"
    );
    return !!urlPattern.test(text);
  };


  return (
    <div className="flex-1 flex flex-col overflow-y-auto justify-end ">
      <div className="overflow-y-auto min-h-[100px]" ref={ref}>
        {messages.map((msg, key) => {
          return (
            <div
              className={`${msg.fromSelf ? "justify-end" : "justify-start"
                } w-full flex mt-2`}
              key={key}
            >
              <div
                key={key}
                className={`
                      ${checkLink(msg.message) && "truncate"}
                      max-w-[70%]
                  `}
              >
                {
                  msg.message === "#like" ? (
                    <div className="px-4 py-2">
                      <AiFillLike className="text-blue-500" size={30} />
                    </div>
                  ) : checkLink(msg.message) ? (
                    <>
                      <div
                        className={`
                            truncate
                            px-4 py-2 rounded-2xl  max-w-[70%] mx-4
                            bg-${msg.fromSelf
                            ? "blue-500"
                            : "gray-100"
                          }
                            text-${msg.fromSelf
                            ? "white"
                            : "black"
                          } underline`}
                      >
                        <a href={msg.message} target="_blank">
                          {msg.message}
                        </a>
                      </div>
                    </>
                  ) : (
                    <div
                      className={`
                          flex flex-col
                          ${msg.fromSelf ? "items-end mr-4" : "items-start mx-4"}
                      `}
                    >
                      {
                        msg.message && <div
                          className={`px-4 py-2 rounded-2xl w-fit mb-2
                            bg-${msg.fromSelf
                              ? "blue-500"
                              : "gray-100"
                            }
                            text-${msg.fromSelf
                              ? "white"
                              : "black"
                            } `}
                        >{msg.message}</div>}
                      {
                        (msg.imgs && msg.imgs.length > 0 && msg.imgs.length <= 2) &&
                        <div className={`grid grid-cols-${msg.imgs.length} gap-1`}>
                          {
                            msg.imgs.map((src, key) => (
                              <div key={key} className='w-full h-full bg-gray-100 cursor-pointer' onClick={() => handleOpen(src)}>
                                <img src={src} alt="" className='w-full h-full rounded-xl' />
                              </div>
                            ))
                          }
                        </div>
                      }
                      {
                        (msg.imgs && msg.imgs.length > 2) &&
                        <div className="grid grid-cols-3 gap-2">
                          {
                            msg.imgs.map((src, key) => (
                              <div key={key} className='w-[60px] h-[60px] bg-gray-100 cursor-pointer rounded-xl'
                                onClick={() => handleOpen(src)}
                                style={{
                                  backgroundImage: `url(${src})`,
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                }}
                              >
                              </div>
                            ))
                          }
                        </div>
                      }

                    </div>
                  )}
              </div>
            </div>
          );
        })}
        {currentUser._id === isTyping.to && friendId === isTyping.from && (
          <div
            className={`justify-start w-full flex mt-2 h-[40px] items-center`}
          >
            <div
              className={`px-5 h-full flex items-center bg-gray-100 text-black rounded-full w-fit max-w-[70%] mx-4 truncate`}
            >
              <LoadingAnimation />
            </div>
          </div>
        )}
      </div>
      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={1200}
        footer={null}
      >
        <div className="w-full h-[700px] bg-black flex items-center justify-center">
          <img src={currentImg} alt="" className="max-h-[90%]" />
        </div>
      </Modal>
    </div >
  );
};

export default MessageBox;


// :
// <div className="grid grid-rows-3 gap-1">
//   <div className='row-span-2 bg-gray-100  cursor-pointer'
//     style={{
//       backgroundImage: `url(${msg.imgs[0]})`,
//       backgroundPosition: "center",
//       backgroundSize: "cover",
//     }}>
//     {msg.imgs}
//   </div>
/* <div className={`gap-1 grid grid-cols-${msg.imgs.slice(1).length >= 3 ? 3 : 2}`}>
{
  new Array(msg.imgs.slice(1).length > 2 ? 3 : 2).fill(null).map((_, index) => (
    <div key={index} className='w-full h-full flex items-center justify-center  cursor-pointer'
      style={{
        backgroundImage: `${index === 2 ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${msg.imgs[index + 1]})` : `url(${msg.imgs[index + 1]})`} `,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      {
        index === 2 &&
        <div className='font-semibold text-3xl text-white'>+{msg.imgs.length - 4}</div>
      }
    </div>
  ))
}
</div> */
// </div >

// <div className="grid grid-cols-3">
//   {
//     msg.imgs.map((i, key) => (
//       <div className="max-h-[200px]" key={key}>
//         <img src={i} alt="pic" />
//       </div>
//     ))
//   }
// </div>

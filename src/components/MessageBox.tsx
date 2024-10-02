import React, { useEffect, useRef } from 'react'
import { MessageReturnType } from '../type'
import { useUser } from './Context/userContext'
import { TypingType } from './ChatBox'
import LoadingAnimation from './LoadingAnimation'

type MessageBoxProps = {
    messages: MessageReturnType[]
    isTyping: TypingType
    friendId: string
}

const MessageBox: React.FC<MessageBoxProps> = (props) => {

    const { messages, isTyping, friendId } = props

    const { currentUser } = useUser()

    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current) {
            ref.current.lastElementChild?.scrollIntoView()
        }
    }, [messages, isTyping])

    const checkLink = (text: string) => {
        const urlPattern = new RegExp(
            '^(https?:\\/\\/)?' +
            '((([a-zA-Z0-9$-_@.&+!*"(),]+)\\.)+([a-zA-Z]{2,})|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*' +
            '(\\?[;&a-zA-Z0-9%_.~+=-]*)?' +
            '(\\#[-a-zA-Z0-9_]*)?$', 'i'
        );
        return !!urlPattern.test(text);
    }

    return (
        <div className="flex-1 flex flex-col overflow-y-auto justify-end ">
            <div className='overflow-y-auto' ref={ref}>
                {
                    messages.map((msg, key) => {
                        return (
                            <div className={`${msg.fromSelf ? 'justify-end' : 'justify-start'} w-full flex mt-2`} key={key}>
                                <div
                                    key={key}
                                    className={`
                                        px-4 py-2 rounded-2xl w-fit max-w-[70%] mx-4 
                                        bg-${msg.fromSelf ? 'blue-500' : 'gray-100'} text-${msg.fromSelf ? 'white' : 'black'} 
                                        ${checkLink(msg.message) && 'truncate'}
                                    `}
                                >
                                    {
                                        checkLink(msg.message)
                                            ? <a target="_blank" className='underline' href={msg.message}>{msg.message}</a>
                                            : <span>{msg.message}</span>
                                    }
                                </div>

                            </div>
                        )
                    })
                }
                {
                    (currentUser._id === isTyping.to && friendId === isTyping.from) && <div className={`justify-start w-full flex mt-2 h-[40px] items-center`}>
                        <div className={`px-5 h-full flex items-center bg-gray-100 text-black rounded-full w-fit max-w-[70%] mx-4 truncate`}>
                            <LoadingAnimation />
                        </div>

                    </div>
                }
            </div>
        </div>
    )
}

export default MessageBox

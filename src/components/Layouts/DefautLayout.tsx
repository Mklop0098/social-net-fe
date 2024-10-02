import React, { PropsWithChildren, useEffect } from 'react'
import Header from '../Header'
import { useNavigate } from 'react-router-dom'
import { useMsg } from '../Context/msgContext'
import ChatBox from '../ChatBox'
import MiniChatBox from '../MiniChatBox'

export const DefautLayout: React.FC<PropsWithChildren> = ({ children }) => {

    const navigate = useNavigate()
    const { activeChatList, minimizeChatBoxList } = useMsg()

    useEffect(() => {
        if (!localStorage.getItem('chat-app-current-user')) {
            navigate("/login");
        }
    }, [])

    return (
        <div className='h-[100vh] flex flex-col relative'>
            <div className='sticky top-0 w-full'>
                <Header defaultStatus='newFeed' />
            </div>
            <div className='w-full'>
                <div className="h-[93vh] overflow-y-auto flex flex-col">
                    {
                        children
                    }
                </div>
            </div>
            <div className='m-w-[1050px] h-[420px] z-10 bottom-0 right-10 absolute flex flex-row'>
                <div className='flex flex-row h-full'>
                    {
                        activeChatList.slice(0, 3).map((user, key) => (
                            <ChatBox key={key} user={user} />
                        ))
                    }
                </div>
                <div className='w-20 h-full flex flex-col items-center justify-end pb-8'>
                    {
                        minimizeChatBoxList.slice(0, 3).map((user, key) => (
                            <MiniChatBox key={key} user={user} />
                        ))
                    }
                    {
                        minimizeChatBoxList.length > 3 && (
                            <div className="w-14 h-14 bg-gray-200 mt-4 rounded-full flex items-center justify-center">
                                {'+' + minimizeChatBoxList.slice(3).length}
                            </div>
                        )
                    }
                    <div className="w-14 h-14 bg-gray-200 mt-4 rounded-full">

                    </div>
                </div>
            </div>

        </div>
    )
}

export default DefautLayout

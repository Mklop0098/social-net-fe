import React, { PropsWithChildren, useEffect } from 'react'
import Header from '../Header'
import { useNavigate } from 'react-router-dom'
import { ChatMonitor } from '../ChatMonitor'

export const DefautLayout: React.FC<PropsWithChildren> = ({ children }) => {

    const navigate = useNavigate()

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
            <ChatMonitor />

        </div>
    )
}

export default DefautLayout

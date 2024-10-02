import React, { PropsWithChildren, useEffect } from 'react'
import Header from '../Header'
import { useNavigate } from 'react-router-dom'

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
                <Header />
            </div>
            <div>{children}</div>
        </div>
    )
}

export default DefautLayout

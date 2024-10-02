import React from 'react'
import { IconType } from '../../type'

export const FriendIcon: React.FC<IconType> = (props) => {

    const { fill, size, fillColor } = props

    return (
        <div>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill={fill ? fillColor : 'none'} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-${size}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.496 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-9 4.5a4 4 0 1 0
                     0 8 4 4 0 0 0 0-8zM5.5 15a5 5 0 0 0-5 5 3 3 0 0 0 3 3h8.006a3 3 0 0 0 3-3 5 5 0 0 0-5-5H5.5zm9-4.5c-.671 0-
                     1.158.46-1.333.966a5.948 5.948 0 0 1-.303.718 1.558 1.558 0 0 0 .525 1.99 7.026 7.026 0 0 1 2.663 3.34c.215.5
                     65.76.986 1.418.986h3.036a3 3 0 0 0 3-3 5 5 0 0 0-5-5H14.5z" />
                </svg>
            </div>
        </div>
    )
}

export default FriendIcon

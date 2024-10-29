import { useEffect, useState } from 'react'
import { StoryType, UserType } from '../../type'
import { getUser } from '../../api/userAPI/userAuth'

type StatusItemType = {
    story: StoryType
}

export const StatusItem: React.FC<StatusItemType> = (props) => {

    const { story } = props
    const [owner, setOwner] = useState<UserType>({} as UserType)

    useEffect(() => {
        const getUserData = async () => {
            const res = await getUser(story.owner)
            if (res.status) {
                setOwner(res.data.userData[0])
            }
        }
        getUserData()
    }, [story])

    return (
        <div className="h-60 bg-white rounded-xl overflow-hidden shadow-md relative"
        >
            <div
                className="w-full h-full"
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${story.background})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
            >
            </div>
            <div className="w-10 h-10 bg-[--primary-color] rounded-full text-white flex items-center justify-center border border-2 border-white absolute top-4 left-4"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${owner.avatar})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            >
            </div>
        </div>
    )
}
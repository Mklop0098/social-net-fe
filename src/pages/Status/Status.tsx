import { useUser } from "../../components/Context/userContext"
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import { StoryType } from "../../type";
import { useState, useEffect } from 'react'
import { getAllUserStory } from '../../api/userAPI/useStory'
import { StoryCarousel } from "../../components/Carousel/StoryCarousel";
import { StatusItem } from "./StatusItem";

export const Status = () => {

    const { currentUser } = useUser()
    const [stories, setStories] = useState<StoryType[]>([])

    useEffect(() => {
        const getStory = async () => {
            const res = await getAllUserStory(currentUser._id)
            console.log(res)
            if (res.data.status) {
                setStories(res.data.story)
            }
        }
        getStory()
    }, [currentUser._id])

    console.log(stories)

    return (
        <div className="flex">

            {
                stories.length > 4 ?
                    <StoryCarousel srcs={stories} slidePerView={5} /> :
                    <div className="grid grid-cols-5 gap-2 w-full">
                        <Link to={'/story/create'}>
                            <div className="h-60 bg-white rounded-xl grid grid-rows-4 overflow-hidden shadow-md"
                            >
                                <div
                                    className="row-span-3"
                                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                                >
                                </div>
                                <div className="flex items-center justify-center font-semibold relative">
                                    <div className="w-10 h-10 bg-[--primary-color] rounded-full text-white flex items-center justify-center border border-4 border-white absolute -top-4">
                                        <FaPlus size={22} className="" />
                                    </div>
                                    <span>Tạo tin</span>
                                </div>
                            </div>
                        </Link >
                        {stories.map((story, key) => (
                            <StatusItem story={story} key={key} />
                        ))}
                    </div>
            }
        </div>
    )
}
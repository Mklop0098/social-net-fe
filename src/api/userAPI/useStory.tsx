import axios from "axios"
import { createStoryRoute, getAllUserStoryRoute } from "../ultils"


export const createStory = async (owner: string, story: string, background: string, link?: string) => {
    const res = await axios.post(createStoryRoute, {
        owner, story, background, link
    })

    return res
}

export const getAllUserStory = async (userId: string) => {
    const res = await axios.post(getAllUserStoryRoute, {
        userId
    })
    return res
}

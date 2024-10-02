import axios from "axios"
import { getAllMessageRoute, sendMessageRoute, getReceiveMessageRoute } from "../ultils"



export const SendMessage = async (from: string, to: string, msg: string) => {
    const res = await axios.post(sendMessageRoute, {
        from, to, msg
    })

    return res
}

export const GetAllMessage = async (from: string, to: string) => {
    const res = await axios.post(getAllMessageRoute, {
        from, to
    })

    return res
}

export const GetReceiveMessage = async (to: string) => {
    const res = await axios.post(getReceiveMessageRoute, {
        to
    })

    return res
}
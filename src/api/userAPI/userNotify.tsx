

import axios from "axios"
import { createNotifyRoute, getAllNotifiesRoute, readNotifiesRoute } from "../ultils"

export const createNotify = async (userId: string, notify: string, type: string, from: string) => {
    console.log('a')
    const res = await axios.post(createNotifyRoute, {
        userId, notify, type, from
    })
    return res
}

export const getAllNotifies = async (userId: string) => {
    const res = await axios.get(`${getAllNotifiesRoute}/${userId}`)
    return res
}

export const readNotifies = async (userId: string) => {
    const res = await axios.post(readNotifiesRoute, { userId })
    return res
} 
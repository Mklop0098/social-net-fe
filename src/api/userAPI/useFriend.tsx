import axios from "axios"
import { addFriendListRoute, addRequestListRoute, createDataRoute, getFriendDataRoute, getFriendDataListRoute, getRequestFriendDataListRoute } from "../ultils"

export const createData = async (userId: string) => {
    const res = await axios.post(createDataRoute, {
        userId
    })

    return res
}

export const addRequestList = async (userId: string, friendId: string) => {
    console.log(userId)
    const res = await axios.post(addRequestListRoute, {
        userId, friendId
    })

    return res
}

export const addFriendList = async (userId: string, friendId: string) => {
    const res = await axios.post(addFriendListRoute, {
        userId, friendId
    })

    return res
}

export const getFriendDataList = async (userId: string) => {
    const res = await axios.post(getFriendDataListRoute, {
        userId
    })

    return res
    
}

export const getRequestFriendDataList = async (userId: string) => {
    console.log('p', userId)
    const res = await axios.post(getRequestFriendDataListRoute, {
        userId
    })

    return res
}

export const getFriendData = async (userId: string) => {
    const res = await axios.get(`${getFriendDataRoute}/${userId}`)
    return res
}
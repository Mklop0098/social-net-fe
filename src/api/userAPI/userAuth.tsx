import axios from "axios"
import { getAllUserRoute, getUserRoute, loginRoute, logoutRoute, registerRoute, setBgImageRoute, setAvatarRoute } from "../ultils"
import { LoginInputType, RegisterInputType } from "../../type"

export const register = async (input: RegisterInputType) => {
    const res = await axios.post(registerRoute, {
        input
    })
    return res
}

export const login = async (input: LoginInputType) => {
    const res = await axios.post(loginRoute, {
        input
    })

    return res
}

export const logout = async () => {
    const res = axios.get(logoutRoute)
    return res
}

export const getUser = async (id: string) => {
    const res = await axios.get(`${getUserRoute}/${id}`)
    return res
}

export const getAllUser = async (id: string) => {
    const res = await axios.get(`${getAllUserRoute}/${id}`)
    return res
}

export const setBgImage = async (userId: string, image: string) => {
    const res = await axios.post(setBgImageRoute, {
        userId, image
    })
    return res
}

export const setAvatar = async (userId: string, image: string) => {
    const res = await axios.post(setAvatarRoute, {
        userId, image
    })
    return res
} 
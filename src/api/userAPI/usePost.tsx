import axios from "axios"
import { createPostRoute, getAllPostsRoute, likePostRoute, removeLikePostRoute, getAllUserPostRoute, commentPostRoute, sharePostRoute } from "../ultils"


export const createPost = async (owner: string, post: string, images: string[]) => {
    console.log(owner, post, images)
    const res = await axios.post(createPostRoute, {
        owner, post, images
    })

    return res
}

export const getAllPost = async () => {
    const res = await axios.get(getAllPostsRoute)
    return res
}

export const getAllUserPost = async (userId: string) => {
    const res = await axios.post(getAllUserPostRoute, {
        userId
    })
    return res
}

export const likePost = async (userId: string, postId: string) => {

    console.log(userId, postId)
    const res = await axios.post(likePostRoute, {
        userId, postId
    })

    return res
}

export const commentPost = async (userId: string, postId: string, comment: string) => {

    const res = await axios.post(commentPostRoute, {
        userId, postId, comment
    })

    return res
}

export const removeLikePost = async (userId: string, postId: string) => {

    console.log(userId, postId)
    const res = await axios.post(removeLikePostRoute, {
        userId, postId
    })

    return res
}

export const sharePost = async (userId: string, postId: string, comment: string) => {

    const res = await axios.post(sharePostRoute, {
        userId, postId, comment
    })

    return res
}

export const upload = async (files: FormData) => {

    const res = await axios.post(`http://localhost:5000/api/post/upload`,
        files,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    )
    return res
}
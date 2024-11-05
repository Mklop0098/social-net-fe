/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import { PostListType } from "../../type";
import { useUser } from '../../components/Context/userContext'
import { createNotify } from '../../api/userAPI/userNotify'
import { getAllPost, createPost, removeLikePost, likePost, commentPost } from '../../api/userAPI/usePost'
import { useSocket } from '../Context/socketIOContext'

type PostHookReturn = {
    posts: PostListType[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createNewPost: (value: string, images: string[]) => Promise<any>
    handleLikePost: (post: PostListType) => Promise<any>
    handleComment: (post: PostListType, value: string, parents?: string[]) => Promise<any>
}


export const PostContext = createContext<PostHookReturn>({} as PostHookReturn);


export const usePost = (): PostHookReturn => {
    return useContext(PostContext);
};


export const PostContextProvider: React.FC<PropsWithChildren> = (props) => {

    const [posts, setPosts] = useState<PostListType[]>([])
    const { currentUser } = useUser()
    const { socket } = useSocket()

    const gettPost = async () => {
        const res = await getAllPost();
        if (res.data.status) {
            setPosts(res.data.post);
        }
    };

    useEffect(() => {
        gettPost();
    }, [currentUser._id]);

    const createNewPost = async (value: string, images: string[]) => {
        if (value !== "") {
            const res = await createPost(currentUser._id, value, images);
            if (res.data.status) {
                setPosts((posts) => {
                    posts.push(res.data.data);
                    const newPost: PostListType[] = JSON.parse(JSON.stringify(posts));
                    return newPost;
                });
            }
            return res.data;
        }
    }

    const handleLikePost = async (post: PostListType) => {
        const liked = post.likes.find(user => user.userId === currentUser._id)
        if (liked) {
            await removeLikePost(currentUser._id, post._id)
            gettPost()
        }
        else {
            if (currentUser._id !== post.owner) {
                await createNotify(post.owner, `${currentUser.firstName + " " + currentUser.lastName} đã thích một bài viết của bạn`, 'friendRequest', currentUser._id)
            }
            if (socket) {
                socket.emit("like-post", {
                    userId: currentUser._id,
                    owner: post.owner,
                    postId: post._id
                });
            }
            await likePost(currentUser._id, post._id)
            gettPost()
        }
    }

    const handleComment = async (post: PostListType, value: string, parents?: string[]) => {
        if (currentUser._id !== post.owner) {
            await createNotify(post.owner, `${currentUser.firstName + " " + currentUser.lastName} đã bình luận một bài viết của bạn`, 'comment', currentUser._id)
        }
        socket?.emit("comment-post", {
            userId: currentUser._id,
            owner: post.owner,
            postId: post._id
        });
        const res = await commentPost(currentUser._id, post._id, value, parents)
        if (res.data.status) {
            return res
        }
    }

    return (
        <PostContext.Provider value={{ posts, createNewPost, handleLikePost, handleComment }}>
            {props.children}
        </PostContext.Provider>
    );
}
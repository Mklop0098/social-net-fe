import { useUser } from "../components/Context/userContext"
import { Divider } from "@mui/material"
import { useModal } from "../components/Context/modalContext"
import { IoMdClose } from "react-icons/io";
import { useState } from 'react'
import { ImageUploadType, UploadImage } from '../components/UploadImage'
import { upload } from '../api/userAPI/usePost'
import { setBgImage, setAvatar } from '../api/userAPI/userAuth'
import { ToastType, UserType } from '../type'

type ChangeImageProps = {
    onChange: (toast: ToastType) => void
    setUserInfo: (user: UserType) => void
    userInfo: UserType
    state: "avatar" | "background"
}

export const ChangeImage: React.FC<ChangeImageProps> = ({ userInfo, state, onChange, setUserInfo }) => {

    const { currentUser } = useUser()
    const { hideModal } = useModal()
    const [selectImage, setSelectImage] = useState<ImageUploadType[]>([])
    const [uploadImages, setUploadImages] = useState<ImageUploadType[]>([])

    const handleClick = () => {
        hideModal()
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        uploadImages.forEach((images) => {
            formData.append(`images`, images.file);
        });
        const uploadImage = await upload(formData)
        if (state === "background") {
            const res = await setBgImage(currentUser._id, uploadImage.data.data[0])
            if (res.data.status) {
                onChange({ open: true, msg: res.data.msg })
                setUserInfo({ ...userInfo, 'backgroundImage': uploadImage.data.data[0] })
            }
        }
        else if (state === "avatar") {
            const res = await setAvatar(currentUser._id, uploadImage.data.data[0])
            if (res.data.status) {
                onChange({ open: true, msg: res.data.msg })
                setUserInfo({ ...userInfo, 'avatar': uploadImage.data.data[0] })
            }
        }
        hideModal()
    }

    return (
        <div className="flex flex-col justify-between px-4 pb-4 xs:w-[full] h-fit xs:max-w-[500px] m-auto top-0 left-0 bottom-0 right-0  absolute bg-white rounded-lg">
            <div className=" flex flex-row relative items-center justify-center h-[4rem] p-4">
                <div className="font-bold text-xl">Thêm ảnh đại diện</div>
                <div
                    className="absolute right-0 w-10 h-10 flex items-center justify-center hover:bg-gray-200 bg-gray-100 rounded-full"
                    onClick={handleClick}
                >
                    <IoMdClose size={20} />
                </div>
            </div>
            <Divider />
            <div className="bg-white flex-1 relative">

                <div className="flex flex-col">
                    <UploadImage multi={false} selectImage={selectImage} setUploadImages={setUploadImages} setSelectImage={setSelectImage} uploadImages={uploadImages} />
                </div>
            </div>
            <div className="flex flex-row relative items-center justify-center h-[2.5rem]">
                <button
                    className="w-full h-full bg-gray-100 text-lg font-semibold rounded-lg"
                    onClick={handleSubmit}
                >
                    Đăng
                </button>
            </div>
        </div>
    )
}
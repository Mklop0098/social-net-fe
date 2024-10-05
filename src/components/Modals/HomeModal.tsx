import { useUser } from "../../components/Context/userContext"
import { Divider } from "@mui/material"
import { FaImages } from "react-icons/fa6"
import { useModal } from "../../components/Context/modalContext"
import { IoMdClose } from "react-icons/io";
import { FaEarthAsia } from "react-icons/fa6";
import { useRef, useState } from 'react'
import { ImageUploadType, UploadImage } from '../../components/UploadImage'
import { imageDb } from '../../components/FirebaseImg/Config'
import { ref, uploadBytes, StorageReference, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

type HomeModalProps = {
    setFlag?: (flag: boolean) => void
    onSubmit: (value: string, images: string[]) => Promise<void>
    onChange: (value: string) => void
    defaultValue: string
}

export const HomeModal: React.FC<HomeModalProps> = (props) => {

    const { currentUser } = useUser()
    const { hideModal } = useModal()
    const { setFlag = () => { }, onSubmit, onChange, defaultValue } = props
    const [openUpload, setOpenUpload] = useState(false)
    const valueRef = useRef<string>(defaultValue)
    const [selectImage, setSelectImage] = useState<ImageUploadType[]>([])
    const [uploadImages, setUploadImages] = useState<ImageUploadType[]>([])


    const handleClick = () => {
        setFlag(false)
        hideModal()
    }

    const handleUpload = async () => {

        const uploadPromises = uploadImages.map(async (image) => {
            const storageRef: StorageReference = ref(imageDb, `files/${v4()}`)
            await uploadBytes(storageRef, image.file);
            return getDownloadURL(storageRef);
        });

        try {
            const linksReturn: string[] = await Promise.all(uploadPromises);
            console.log('All images uploaded successfully', linksReturn);
            onSubmit(valueRef.current, linksReturn)
            hideModal()
        } catch (error) {
            console.error('Error uploading images:', error);
        }

    }

    return (
        <div className="flex flex-col justify-between px-4 pb-4 xs:w-[full] h-fit xs:max-w-[500px] m-auto top-0 left-0 bottom-0 right-0  absolute bg-white rounded-lg">
            <div className=" flex flex-row relative items-center justify-center h-[4rem] p-4">
                <div className="font-bold text-xl">Tạo bài viết</div>
                <div
                    className="absolute right-0 w-10 h-10 flex items-center justify-center hover:bg-gray-200 bg-gray-100 rounded-full"
                    onClick={handleClick}
                >
                    <IoMdClose size={20} />
                </div>
            </div>
            <Divider />
            <div className="bg-white flex-1 relative">
                <div className="py-3 flex flex-row items-center rounded-lg cursor-pointer">
                    <div className="w-10 h-10 bg-blue-200 rounded-full mr-4 overflow-hidden">
                        <img src={currentUser.avatar} alt="pic" />
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="font-semibold pb-1">{currentUser.firstName + " " + currentUser.lastName} </div>
                        <div className="flex flex-row items-center bg-gray-300 px-3 py-0.5 rounded-md">
                            <FaEarthAsia />
                            <span className="text-sm ml-2 font-semibold">Mọi người</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <textarea
                        className="block resize-none mb-4 w-full outline-none h-[100px] max-h-[240px] overflow-y-auto"
                        onChange={e => {
                            valueRef.current = e.target.value
                            onChange(e.target.value)
                        }}
                        placeholder={currentUser.lastName + " ơi, bạn đang nghĩ gì thế"}
                        defaultValue={defaultValue}
                    />
                    {
                        openUpload === true && <UploadImage setUploadOpen={setOpenUpload} selectImage={selectImage} setUploadImages={setUploadImages} setSelectImage={setSelectImage} uploadImages={uploadImages} />
                    }

                </div>
                <div className="grid grid-cols-2 gap-4 border p-4 mb-4 rounded-lg fix-bottom-0" >
                    <div className="font-semibold">Thêm vào bài viết của bạn</div>
                    <div onClick={() => setOpenUpload(true)}>
                        <FaImages className="text-green-400" size={28} />
                    </div>
                </div>
            </div>
            <div className="flex flex-row relative items-center justify-center h-[2.5rem]">
                <button
                    className="w-full h-full bg-gray-100 text-lg font-semibold rounded-lg"
                    onClick={handleUpload}
                >
                    Đăng
                </button>
            </div>
        </div>
    )
}
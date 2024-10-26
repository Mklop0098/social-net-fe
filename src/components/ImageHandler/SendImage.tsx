import { AiFillPicture } from "react-icons/ai";
import { ImageUploadType } from '../ImageHandler/UploadImage'

type SendImageProps = {
    setUploadImages: (images: ImageUploadType[]) => void
    uploadImages: ImageUploadType[]
}

export const SendImage: React.FC<SendImageProps> = (props) => {

    const { setUploadImages, uploadImages } = props

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const file = event.target.files
        const upload: ImageUploadType[] = []
        for (let i = 0; i < file.length; i++) {
            upload.push({ url: URL.createObjectURL(file[i]), file: file[i] })
        }
        setUploadImages(uploadImages.concat(upload))
    };


    return (
        <div>
            <div className={`flex flex-row items-center`}>
                {
                    <div>
                        <label className="block text-blue-500" htmlFor="file_input">
                            <AiFillPicture size={20} />
                        </label>
                        <input onChange={handleImageUpload} multiple className="block hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" accept="image/*" />
                    </div>
                }
            </div>
        </div>
    )
}
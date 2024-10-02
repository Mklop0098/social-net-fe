import { FaTrash } from 'react-icons/fa'
import { Checkbox } from '@mui/material'

export type ImageUploadType = {
    url: string,
    file: File
}

type UploadImageProps = {
    setUploadOpen?: (open: boolean) => void
    selectImage: ImageUploadType[]
    uploadImages: ImageUploadType[]
    setSelectImage: (value: ImageUploadType[]) => void
    setUploadImages: (value: ImageUploadType[]) => void
    multi?: boolean
}

export const UploadImage: React.FC<UploadImageProps> = (props) => {

    const { setUploadOpen = () => { }, multi = true, selectImage, uploadImages, setSelectImage, setUploadImages } = props

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const file = event.target.files
        const upload: ImageUploadType[] = []
        for (let i = 0; i < file.length; i++) {
            upload.push({ url: URL.createObjectURL(file[i]), file: file[i] })
        }
        setUploadImages(uploadImages.concat(upload))
    };

    const handleCheck = (image: ImageUploadType) => {
        if (!selectImage.find(i => i.url === image.url)) {
            setSelectImage([...selectImage, image])
        }
        else {
            setSelectImage(selectImage.filter(i => i.url !== image.url))
        }
    }

    const handleDeleteImage = () => {
        const upload = new Set(uploadImages)
        const select = new Set(selectImage)
        selectImage.map(i => {
            if (upload.has(i)) {
                upload.delete(i)
                select.delete(i)
            }
        })
        setSelectImage(Array.from(select))
        setUploadImages(Array.from(upload))
    }

    const checkChecked = (src: string) => {
        return !!selectImage.find(i => i.url === src)
    }

    return (
        <div className="bg-white mb-6 pl-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
            <div className="grid grid-cols-3 gap-4 p-2 max-h-[200px] overflow-auto">
                {
                    uploadImages.length < 1 ?
                        <div className={`flex flex-row items-center`}>
                            {
                                <div className={`${(!multi && uploadImages.length > 0) && 'hidden'}`}>
                                    <label className="block mb-2 text-sm font-medium border w-fit px-2 py-1 mt-2 text-gray-900 dark:text-white border-blue-500" htmlFor="file_input">Upload</label>
                                    <input multiple={multi} onChange={handleImageUpload} className="block hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" accept="image/*" />
                                </div>
                            }
                        </div> :
                        uploadImages.map((i, key) => (
                            <div key={key}>
                                <div className="group border relative"><img className="max-h-[130px] w-full" src={i.url} alt="pic" />
                                    <Checkbox className={`group-hover:bg-white group-hover:opacity-100 p-0 m-0 ${!checkChecked(i.url) && "hidden"} opacity-0 rounded-none absolute bg-white`} checked={checkChecked(i.url)} onChange={() => handleCheck(i)} />
                                </div>
                            </div>
                        ))
                }
            </div>
            <div className={`${uploadImages.length < 1 && 'hidden'} flex flex-row items-center mt-3`}>
                <div className={`${(!multi && uploadImages.length > 0) && 'hidden'}`}>
                    <label className="block mb-2 text-sm font-medium border w-fit px-2 py-1 mt-2 text-gray-900 dark:text-white border-blue-500" htmlFor="file_input">Upload</label>
                    <input multiple={multi} onChange={handleImageUpload} className="block hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" accept="image/*" />
                </div>

                {
                    uploadImages.length > 0 && <button className='bg-blue-500 text-white px-4 py-1 rounded-md mx-3' onClick={() => {
                        setUploadOpen(false)
                        setUploadImages([])
                    }}>Hủy</button>
                }
                {
                    selectImage.length > 0 &&
                    <div className="flex flex-row justify-between p-2  items-center hover:bg-blue-200 rounded-full cursor-pointer">
                        <FaTrash className="text-[#3464eb]" onClick={handleDeleteImage} />
                    </div>
                }
            </div>
        </div>
    )
}
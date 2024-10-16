import { useModal } from '../components/Context/modalContext'
import { PostListType, ModalType } from '../type'
import { PostDetail } from './Modals/PostDetailModal'

type PostImagesProps = {
    srcs: PostListType
}


export const PostImages: React.FC<PostImagesProps> = (props) => {

    const { srcs } = props
    const { showModal } = useModal()

    const handleClick = () => {
        const test: ModalType = {
            toggle: true,
            root: "modal-root",
            width: 30,
            height: 50,
            body: (
                <PostDetail post={srcs} />
            ),
        };
        showModal(test);
    };

    return (
        <div className='bmax-h-[680px] h-fit'>
            {
                srcs.imgaes.length <= 2 ?
                    <div className={`grid grid-cols-${srcs.imgaes.length} gap-1`}>
                        {
                            srcs.imgaes.map((src, key) => (
                                <div key={key} className='w-full h-full bg-gray-100 cursor-pointer' onClick={handleClick}>
                                    <img src={src} alt="" className='w-full h-full' />
                                </div>
                            ))
                        }
                    </div> :
                    <div className="grid grid-rows-3 h-[680px] gap-1">
                        <div className='row-span-2 bg-gray-100  cursor-pointer'
                            onClick={handleClick}
                            style={{
                                backgroundImage: `url(${srcs.imgaes[0]})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                            }}>

                        </div>
                        <div className={`gap-1 grid grid-cols-${srcs.imgaes.slice(1).length >= 3 ? 3 : 2}`}>
                            {
                                new Array(srcs.imgaes.slice(1).length > 2 ? 3 : 2).fill(null).map((_, index) => (
                                    <div key={index} className='w-full h-full flex items-center justify-center  cursor-pointer'
                                        onClick={handleClick}
                                        style={{
                                            backgroundImage: `${index === 2 ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${srcs.imgaes[index + 1]})` : `url(${srcs.imgaes[index + 1]})`} `,
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                        }}
                                    >
                                        {
                                            index === 2 &&
                                            <div className='font-semibold text-3xl text-white'>+{srcs.imgaes.length - 4}</div>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div >
            }
        </div >
    )
}
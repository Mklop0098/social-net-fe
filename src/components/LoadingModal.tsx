import load from '../assets/loader.gif'

export const LoadingModal = () => {


    return (
        <div className="flex px-4 pb-4 w-full h-full top-0 left-0 bottom-0 right-0 absolute bg-white flex items-center justify-center">
            <div className='w-[10%]'><img src={load} alt="" /></div>
        </div>
    )
}
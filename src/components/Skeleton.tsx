import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


const Skeletons = () => {

    return (
        <Stack>
            <div className="md:w-[500px] 2xl:w-[680px] xs:max-w-[500px] lg:max-w-[680px] xs:w-full mx-auto bg-white rounded-lg mb-4">
                <div className="flex flex-col justify-center">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="flex flex-row items-center">
                            <Skeleton variant="circular" width={50} height={50} />
                            <div className="pl-3">
                                <Skeleton variant="text" width={100} />
                                <div className="flex flex-row items-center">
                                    <Skeleton variant="text" width={100} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-[100px]">

                    </div>
                    <div className="flex flex-col p-4 pb-2">
                        <div className={`grid grid-cols-3 gap-4 pt-2`}>
                            <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer">
                                <Skeleton variant="text" width={100} />
                            </div>
                            <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer">
                                <Skeleton variant="text" width={100} />
                            </div>
                            <div className="flex flex-row justify-center items-center hover:bg-gray-100 py-2 rounded-lg text-gray-500 cursor-pointer">
                                <Skeleton variant="text" width={100} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Stack>
    )
}

export default Skeletons
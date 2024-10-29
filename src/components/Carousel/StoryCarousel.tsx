"use client";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaPlus } from "react-icons/fa6";
import "swiper/css/scrollbar";

import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";
import { StoryType } from "../../type";
import { Link } from 'react-router-dom'
import { useUser } from "../Context/userContext";
import { getUser } from '../../api/userAPI/userAuth'
import { StatusItem } from "../../pages/Status/StatusItem";

type CarouselProps = {
    srcs: StoryType[];
    slidePerView: number;
};

export const StoryCarousel: React.FC<CarouselProps> = (props) => {
    const { srcs, slidePerView } = props;
    const { currentUser } = useUser()

    const getUserData = async (userId: string) => {
        const res = await getUser(userId)
        return res.data.userData[0]
    }

    console.log(getUserData(currentUser._id))
    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={0}
            slidesPerView={slidePerView}
            navigation
            style={{ "--swiper-navigation-size": "24px", "--swiper-navigation-sides-offset": "10px", height: '240px' } as React.CSSProperties}
        >

            <SwiperSlide>
                <Link to={'/story/create'}>
                    <div className="h-60 bg-white rounded-xl grid grid-rows-4 overflow-hidden shadow-md mx-1"
                    >
                        <div
                            className="row-span-3"
                            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${currentUser.avatar})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
                        >
                        </div>
                        <div className="flex items-center justify-center font-semibold relative">
                            <div className="w-10 h-10 bg-[--primary-color] rounded-full text-white flex items-center justify-center border border-4 border-white absolute -top-4">
                                <FaPlus size={22} className="" />
                            </div>
                            <span>Tạo tin</span>
                        </div>
                    </div>
                </Link >
            </SwiperSlide>
            {srcs.map((item, key) => (
                <SwiperSlide key={key}>
                    <div className="mx-1">
                        <StatusItem story={item} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

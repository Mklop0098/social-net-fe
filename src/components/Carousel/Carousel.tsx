"use client";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";

type CarouselProps = {
    srcs: string[];
    slidePerView: number;
};

export const Carousel: React.FC<CarouselProps> = (props) => {
    const { srcs, slidePerView } = props;

    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={0}
            slidesPerView={slidePerView}
            navigation
            style={{ "--swiper-navigation-size": "24px", "--swiper-navigation-sides-offset": "10px", zIndex: 0, position: 'relative' } as React.CSSProperties}
        >

            {srcs.map((item, key) => (
                <SwiperSlide key={key}>
                    <div className="w-full h-full">
                        <div
                            className="flex items-center justify-center h-full"
                        >
                            <img src={item} alt="" className="max-w-[100%] max-h-[100%]" />
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

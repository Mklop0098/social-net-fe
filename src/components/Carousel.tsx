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
            pagination={{ clickable: true }}
            navigation
            style={{ "--swiper-navigation-size": "24px", "--swiper-navigation-sides-offset": "10px", zIndex: 0 } as React.CSSProperties}
        >
            {srcs.map((item, key) => (
                <SwiperSlide key={key}>
                    <div className="w-full h-[600px]">
                        <div
                            style={{
                                backgroundImage: `url(${item})`,
                                width: '100%'
                            }}
                            className={`w-full h-full bg-center bg-cover`}
                        ></div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

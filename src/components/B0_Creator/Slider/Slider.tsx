import {Swiper, SwiperSlide} from "swiper/react";
import React, {FC} from "react";
import style from "./Slider.module.scss";
import SwiperClass from 'swiper/types/swiper-class';
import clsx from "clsx";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import {IconButton} from "@mui/material";
import "swiper/css";

interface ISlider {
    className: string
    slides: string[]
    onSlideChangeHandler: (index: number) => void
    buttonLabel: string
    btnClassName: string
    swiper: SwiperClass | null
    setSwiper: (swiper: SwiperClass) => void
}

export const Slider: FC<ISlider> = ({
                                        slides,
                                        onSlideChangeHandler,
                                        className,
                                        buttonLabel,
                                        btnClassName,
                                        swiper,
                                        setSwiper
                                    }) => {
    const onSlideChange = (swiper: SwiperClass) => {
        onSlideChangeHandler(swiper.realIndex)
    }

    return (
        <div className={clsx(style.sliderWrapper, className)}>
            <Swiper slidesPerView={1}
                    spaceBetween={0}
                    loop={true}
                    className={style.slider}
                    onSwiper={(swiper) => {
                        setSwiper(swiper);
                    }}
                    onSlideChange={onSlideChange}
            >
                {
                    slides.map((src, key) => (
                            <SwiperSlide key={key}
                                         className={style.slide}

                            >
                                <img src={src} alt=""/>
                            </SwiperSlide>
                        )
                    )
                }
            </Swiper>

            <IconButton className={clsx(style.btnLeft, btnClassName)}
                        color="primary"
                        onClick={() => swiper?.slidePrev()}
                        sx={{padding: 0}}
                        disableRipple={true}
            >
                <ArrowCircleLeftIcon fontSize="large"/>
                <p>{buttonLabel}</p>
            </IconButton>

            <IconButton className={clsx(style.btnRight, btnClassName)}
                        color="primary"
                        onClick={() => swiper?.slideNext()}
                        sx={{padding: 0}}
                        disableRipple={true}
            >
                <ArrowCircleRightIcon fontSize="large"/>
                <p>{buttonLabel}</p>
            </IconButton>
        </div>

    )
}

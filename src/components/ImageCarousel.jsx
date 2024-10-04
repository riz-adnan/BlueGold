import React, { useState, useEffect } from 'react'

export default function ImageCarousel({ carouselImages }) {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        console.log("The carousel gaetting is: ", carouselImages)
    })

    return (
        <main>
            <div id="default-carousel" className="relative w-full" data-carousel="slide">
                {/* <!-- Carousel wrapper --> */}
                <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                    {carouselImages.map((image, idx) => (
                        <div key={idx} className={`${idx !== currentImage ? 'hidden' : 'block'} duration-700 ease-in-out`} data-carousel-item>
                            <img src={image} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
                        </div>
                    ))}
                </div>
                {/* <!-- Slider indicators --> */}
                <div className="absolute z-[50] flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                    {carouselImages.map((_, idx) => (
                        <button key={idx} type="button" onClick={() => setCurrentImage(idx)} className="w-3 h-3 rounded-full" aria-current={idx === currentImage ? "true" : "false"} aria-label={`Slide ${idx + 1}`} data-carousel-slide-to={idx}></button>
                    ))}
                </div>
                {/* <!-- Slider controls --> */}
                <button onClick={() => setCurrentImage((currentImage+1)%carouselImages.length)} type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
                <button onClick={() => setCurrentImage((currentImage-1+carouselImages.length)%carouselImages.length)} type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>
        </main>
    )
}
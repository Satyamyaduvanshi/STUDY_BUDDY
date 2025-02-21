import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { tlnav } from "./upperBar";

const Hero = () => {
    const textRef = useRef(null);

    useEffect(() => {
        tlnav.from(textRef.current, {
            x: -200,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
        });
    }, []);

    return (
        <div className="relative h-dvh w-screen overflow-hidden">
            {/* Background Video */}
            <div className="relative h-dvh w-screen overflow-x-hidden bg-gray-600">
                <video 
                    src="/heroVideo.mp4"
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
                    muted
                    loop
                    autoPlay
                />
            </div>

            {/* Text Content */}
            <div className="absolute left-0 top-0 z-40 flex h-full w-full items-end sm:items-center justify-start px-4 sm:px-8">
                <div 
                    ref={textRef} 
                    className="text-left text-white pl-24 pb-12 sm:pb-0 sm:pl-20 sm:absolute sm:bottom-12 sm:left-12 lg:top-1/4"
                >
                    {/* Title */}
                    <h1 className="text-5xl sm:text-7xl lg:text-[9rem] font-extrabold tracking-wide leading-tight uppercase drop-shadow-xl">
                        Bu<span className="text-brown-500">dd</span>y
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-4 text-lg sm:text-2xl lg:text-3xl font-light font-bold text-red-500 drop-shadow-lg">
                        <b>Find your online <br className="hidden sm:block" /> study buddy and grow together.</b>
                    </p>

                    {/* Button */}
                    <Link to="/signup">
                        <div className="mt-6 sm:mt-8 flex justify-start">
                            <button className="relative group p-[3px] rounded-full transition duration-300 ease-in-out transform hover:scale-105 ">
                                {/* Full 7-Color Flowing Border */}
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r 
                                    from-red-500  via-green-500 
                                    via-blue-500 via-indigo-500 via-purple-500 to-red-500 
                                    animate-border-flow"></span>

                                {/* Button Text */}
                                <span className="relative block bg-black text-white font-semibold rounded-full px-6 py-2 transition-all">
                                    Learn More
                                </span>
                            </button>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Tailwind Animation */}
            <style>
                {`
                    @keyframes borderFlow {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    .animate-border-flow {
                        background-size: 400% auto;
                        animation: borderFlow 4s linear infinite;
                    }
                `}
            </style>
        </div>
    );
};

export default Hero;

import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { tlnav } from "./upperBar";
import { Link } from "react-router-dom";

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
            <div className="relative h-dvh w-screen overflow-x-hidden bg-green-300">
                <img
                    src="/main.png"
                    alt="main png"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
            </div>

            <div className="absolute left-0 top-0 z-40 flex h-full w-full">
                <div ref={textRef} className="mt-16 px-32 sm:px-48 lg:px-64 py-16 text-white">
                    <h1 className="text-7xl sm:text-9xl lg:text-[10rem] font-extrabold tracking-wide leading-tight drop-shadow-2xl bg-white-500 bg-clip-text">
                        Bud<span className="text-green-300">d</span>y
                    </h1>

                    <p className="mt-4 my-4 max-w-2xl text-2xl sm:text-3xl lg:text-4xl font-light text-gray-200 drop-shadow-lg">
                        <b>Find your online <br /> study buddy and grow together.</b>
                    </p>

                    <Link to="/signup">
                    <div className="mt-8">
                        <Button text="Join Us" variant="primary" classname="px-10 py-4 text-lg sm:text-xl lg:text-2xl font-semibold rounded-full bg-green-500 hover:bg-green-300 transition-all duration-300 shadow-lg " />
                    </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;

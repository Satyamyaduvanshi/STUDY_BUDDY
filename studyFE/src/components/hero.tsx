import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { tlnav } from "./upperBar";

const Hero = () => {
  const textRef = useRef(null);
  const titleRefs = useRef([]);
  const paragraphRef = useRef(null);

  useEffect(() => {
    tlnav
      .from(textRef.current, {
        x: -200,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      })
      .from(
        titleRefs.current,
        {
          y: 50,
          opacity: 0,
          stagger: 0.3,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.8"
      )
      .from(
        paragraphRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      );
  }, []);

  const renderTitle = (text: string, isPrimary: boolean) => {
    const words = text.split(" ");
    const firstWord = words[0];
    const secondWord = words[1];

    return (
      <div
        className="flex items-baseline gap-2 leading-none transition-transform duration-300 hover:scale-105"
      >
        <span className={`font-bold ${isPrimary ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"} text-white`}>
          {firstWord}
        </span>
        <span
          className={`pb-1 font-extrabold ${isPrimary ? "text-5xl md:text-6xl" : "text-4xl md:text-5xl"} bg-gradient-to-r from-green-300 via-green-500 to-green-800 bg-clip-text text-transparent animate-text-gradient`}
        >
          {secondWord}
        </span>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <div className="relative h-screen w-full bg-gray-600">
        <video
          src="/heroVideo.mp4"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          muted
          loop
          autoPlay
        />
      </div>

      {/* Text Content */}
      <div className="absolute inset-0 z-40 flex flex-col justify-end items-start px-6 sm:px-12 md:px-16 lg:px-24 pb-16">
        <div ref={textRef} className="max-w-3xl text-white space-y-3">
          {/* Titles */}
          {[
            { text: "Study Together", primary: true },
            { text: "Stay Sharp", primary: true },
            { text: "Smash Goals", primary: true },
          ].map((item, index) => (
            <h1
              key={index}
              //@ts-ignore
              ref={(el) => (titleRefs.current[index] = el)}
              className="drop-shadow-xl text-left"
            >
              {renderTitle(item.text, item.primary)}
            </h1>
          ))}

          {/* Paragraph */}
          <p
            ref={paragraphRef}
            className="hidden sm:block mt-2 mb-4 text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-black drop-shadow-lg text-left"
          >
            Hop into a room or make your own, sync up with a group timer, and chat while you all hustle.
            <div>
              No pressure—just focused vibes and cool people.
            </div>
          </p>

          {/* Button */}
          <Link to="/signup">
            <div className="mt-6 sm:mt-8 flex justify-start">
              <button className="relative group p-[2px] sm:p-[3px] rounded-full transition duration-300 ease-in-out transform hover:scale-105">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-300 via-green-500 to-green-800 animate-border-flow"></span>
                <span className="relative block bg-black text-white font-semibold rounded-full px-4 sm:px-6 py-2 sm:py-2.5 transition-all text-sm sm:text-base">
                  Get Started
                </span>
              </button>
            </div>
          </Link>
        </div>
      </div>

      {/* Tailwind Animations */}
      <style>
        {`
          @keyframes borderFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-border-flow {
            background-size: 400% auto;
            animation: borderFlow 6s linear infinite;
          }

          @keyframes textGradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-text-gradient {
            background-size: 400% auto;
            animation: textGradientFlow 4s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Hero;

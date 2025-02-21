import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const tlnav = gsap.timeline();

export function Bar() {
    useGSAP(() => {
        gsap.fromTo(
            "#nav",
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" }
        );
    }, []);

    return (
        <div id="nav" className="fixed top-0 left-0 w-full z-50 bg-transparent">
            <div className="flex justify-between items-center mx-auto py-3 px-6 sm:px-10 md:px-20 mt-4">
               
                <Link to="/" className="flex items-center">
                    <div className="text-white font-bold tracking-wide text-4xl sm:text-4xl md:text-6xl">
                        Study<span className="text-green-500 uppercase">Buddy</span>
                    </div>
                </Link>

                <div className="hidden sm:flex items-center gap-6">
                    <Link to="/signup">
                        <Button text="Signup" variant="secondary"></Button>
                    </Link>

                    <Link to="/login">
                        <Button text="Login" variant="primary"></Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

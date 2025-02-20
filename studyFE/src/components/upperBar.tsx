import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import gsap from "gsap";
import { useEffect } from "react";

export  const tlnav = gsap.timeline()

export function Bar() {
    useEffect(() => {

        tlnav.fromTo(
            "#nav",
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1,delay:0.5, ease: "power2.out" }
        );

        // tl.from(
        //     "#signup",{
        //         y: -100,
        //         opacity:0,
        //         duration:1

        //     }
        // );
        // tl.from(
        //     "#login",{ y: -100,
        //     opacity:0,
        //     duration:1
        //     }
        // );
    }, []);

    return (
        <div id="nav" className="fixed top-0 left-0 w-full flex justify-between items-center text-base px-14 my-3 z-50 mx-12 rounded-lg">
            <Link to="/" className="flex items-center">
                <div className="text-white text-6xl font-bold tracking-wide uppercase">
                    Study
                    <span className="text-green-500">Buddy</span>
                </div>
            </Link>

            <div className="py-1 flex ">
               <div id="signup" className="flex pt-3 gap-4">
               <Link to="/signup">
                    <Button text="Signup" variant="secondary"></Button>
                </Link>
                
                <Link id="login" to="/login">
                    <Button text="Login" variant="primary"></Button>
                </Link>
               </div>
            </div>
        </div>
    );
}

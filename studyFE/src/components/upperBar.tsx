import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import gsap from "gsap";

export function Bar() {
    gsap.to("navbar",{
        duration: 2,
        delay: 1
    })

    return (
        <div id="navbar" className="flex justify-between items-center text-base px-12 my-3 bg-transparent p-2 backdrop-blur-sm bg-green-200 rounded-lg">
            <Link to="/" className="flex items-center">
                <div className="text-black text-4xl font-bold tracking-wide uppercase">
                    Study
                    <span className="text-green-500">Buddy</span>
                </div>
            </Link>

            <div className="py-1 flex gap-4">
               <div className="flex pt-3">
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

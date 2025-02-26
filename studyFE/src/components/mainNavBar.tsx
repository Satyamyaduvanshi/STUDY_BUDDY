import { Link, Outlet, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useState } from "react";
import { Button } from "./ui/button";


export function NavBar() {
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useGSAP(() => {
        gsap.fromTo(
            "#nav",
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power2.out" }
        );
    }, []);

    function logout(){
        try {
            localStorage.removeItem("authorization")
            navigate("/homepage");
            
        } catch (e:any) {
            setError(e)
        }
    }

    return (<>
        <div id="nav" className="fixed top-0 left-0 w-full z-50 bg-transparent">
            <div className="flex justify-between items-center mx-auto py-3 px-6 sm:px-10 md:px-20 mt-4">
               
                <Link to="/dashboard" className="flex items-center">
                    <div className="text-white font-bold tracking-wide text-4xl sm:text-4xl md:text-6xl">
                        Study<span className="text-green-500 uppercase">Buddy</span>
                    </div>
                </Link>

                <div className="">
                    <Button text="Logout" variant="primary" onClick={logout} />
                </div>



            </div>
        </div>
        <Outlet/>
    </>
        
    );
}

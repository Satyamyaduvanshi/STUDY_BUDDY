import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

export const tlnav = gsap.timeline({ paused: true });

export function Bar() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        tlnav.fromTo(
            "#nav",
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        ).play();
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640 && menuOpen) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [menuOpen]);

    return (
        <nav
            id="nav"
            className="fixed top-4 left-4 right-4 z-50 rounded-full border border-gray-700 bg-black/40 backdrop-blur-sm mx-12"
        >
            <div className="flex justify-between items-center py-1 px-6 sm:px-10 md:px-14">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <div className="text-white font-bold tracking-wide text-3xl sm:text-4xl transition-transform duration-300 transform hover:scale-105">
                        Study<span className="text-green-500 uppercase">Buddy</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden sm:flex items-center gap-4 pt-2">
                    <Link to="/signup">
                        <Button
                            text="Signup"
                            variant="secondary"
                            classname="hover:scale-105 transition px-4 py-2"
                        />
                    </Link>
                    <Link to="/login">
                        <Button
                            text="Login"
                            variant="primary"
                            classname="hover:scale-105 transition px-4 py-2"
                        />
                    </Link>
                </div>

                {/* Hamburger */}
                <button
                    className="sm:hidden text-white"
                    onClick={toggleMenu}
                    aria-label="Toggle Menu"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="absolute top-16 right-6 bg-gray-800 text-white rounded-lg shadow-lg flex flex-col w-40 py-2 animate-slideDown">
                    <Link
                        to="/signup"
                        onClick={toggleMenu}
                        className="py-2 px-4 text-center hover:bg-gray-700 transition rounded-t-lg"
                    >
                        Signup
                    </Link>
                    <Link
                        to="/login"
                        onClick={toggleMenu}
                        className="py-2 px-4 text-center hover:bg-gray-700 transition rounded-b-lg"
                    >
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
}

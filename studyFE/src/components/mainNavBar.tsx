import { Link, Outlet, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { ProfileIcon } from "./ui/profileIcon";
import axios from "axios";

export function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("/api/user/profile", {
          headers: { authorization: localStorage.getItem("authorization") || "" },
        });
        setProfile(response.data.user);
      } catch (e) {
        console.error("Error fetching profile:", e);
      }
    }
    fetchProfile();
  }, []);

  // GSAP navbar animation
  useEffect(() => {
    gsap.fromTo(
      "#nav",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" }
    );
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("authorization");
    navigate("/homepage");
  };

  // Delete User function
  async function deleteUser() {
    try {
      const response = await axios.delete("/api/user/deleteuser", {
        headers: {
          authorization: localStorage.getItem("authorization"),
        },
      });

      if (response.data.message === "user deleted successfull") {
        alert("Account deleted successfully! Hope to see you again!");
        localStorage.removeItem("authorization");
        navigate("/homepage");
      }
    } catch (e) {
      console.error("Error while deleting user: ", e);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Animate modal when opened
  useEffect(() => {
    if (confirmModalOpen) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [confirmModalOpen]);

  return (
    <>
      <nav
        id="nav"
        className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[1200px] z-50 border border-black rounded-full 
        bg-gradient-to-r from-[rgba(0,0,0,0.6)] via-[rgba(34,69,78,0.6)] to-[rgba(0,0,0,0.6)] 
        backdrop-blur shadow-lg px-4 sm:px-6 md:px-10"
      >
        <div className="flex justify-between items-center py-2 sm:py-3 md:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className=" text-white font-bold font-mono tracking-wide 
              text-[clamp(1.2rem,3vw,2rem)] transition-transform duration-500 transform hover:scale-105">
              Study<span className="text-green-500 uppercase">Buddy</span>
            </div>
          </Link>

          {/* Links and Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-8 font-mono text-white text-[clamp(0.8rem,2.5vw,1.1rem)]">
            {/* Desktop links */}
            <div className="hidden md:flex space-x-4 lg:space-x-6">
              <a href="#createRoom" className="hover:text-green-500 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                Create Room
              </a>
              <a href="#listRooms" className="hover:text-green-500 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                List Rooms
              </a>
            </div>

            {/* Profile Icon */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="cursor-pointer hover:text-green-500 transition-transform transform hover:scale-125"
              >
                <ProfileIcon />
              </div>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-9 w-48 sm:w-56 bg-white rounded-lg p-4 text-black z-50 border shadow-lg transition-all duration-300">
                  {profile ? (
                    <>
                      <div className="mb-2">
                        <p className="font-semibold text-sm uppercase">👋 {profile.name}</p>
                        <p className="text-xs pt-2 text-gray-500 break-words">{profile.email}</p>
                      </div>
                      <hr className="my-2" />
                      <div className="block md:hidden">
                        <a href="#createRoom" className="block py-1 hover:text-green-500 transform hover:scale-105 transition-transform duration-300 ease-in-out ">
                          Create Room
                        </a>
                        <a href="#listRooms" className="block py-1 hover:text-green-500 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                          List Rooms
                        </a>
                        <hr className="my-2" />
                      </div>
                      <Button
                        text="Delete Account"
                        variant="secondary"
                        classname="w-full text-red-800 hover:bg-red-100 text-xs sm:text-sm"
                        onClick={() => setConfirmModalOpen(true)}
                      />
                      <Button
                        startIcon={<LogOut size={16} />}
                        text="Logout"
                        variant="primary"
                        classname="w-full text-black hover:bg-green-100 text-xs sm:text-sm"
                        onClick={logout}
                      />
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Loading...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-[1000] ">
          <div
            ref={modalRef}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-xl text-center w-72 sm:w-80"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-3 text-black">Are you sure?</h2>
            <p className="mb-5 text-gray-600 text-sm sm:text-base">Do you want to delete your account?</p>
            <div className="flex justify-around gap-2">
              <Button
                text="Nope"
                variant="secondary"
                classname="text-xs sm:text-sm px-3 sm:px-4"
                onClick={() => setConfirmModalOpen(false)}
              />
              <Button
                text="Yes"
                variant="primary"
                classname="text-xs sm:text-sm px-3 sm:px-4"
                onClick={deleteUser}
              />
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </>
  );
}

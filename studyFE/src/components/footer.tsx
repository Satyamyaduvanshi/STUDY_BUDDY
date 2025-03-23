import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const links = [
  {
    href: "https://github.com/Satyamyaduvanshi",
    icon: <FaGithub />,
  },
  {
    href: "https://x.com/ysatyaa",
    icon: <FaX />,
  },
  {
    href: "https://www.linkedin.com/in/satyam-yadav-868375203/",
    icon: <FaLinkedin />,
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-black via-green-800 to-black text-white opacity-95">
      <div className="container mx-auto flex flex-col items-center gap-6 py-10 px-6">

        {/* Divider Line */}
        <div className="border-t border-gray-600 w-2/3 opacity-50"></div>

        {/* Made with Love */}
        <div className="text-center text-lg font-semibold tracking-wide">
          Made with <span className="text-red-500">❤️</span> by SATYAM
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm text-gray-300 max-w-md">
          Videos used on this website do not belong to us. All rights belong to their respective owners.
        </p>

        {/* Social Icons */}
        <div className="flex gap-8 mt-4">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl transition transform hover:text-green-400 hover:scale-110"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

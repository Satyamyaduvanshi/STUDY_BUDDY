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
    <footer className="w-full bg-black text-white opacity-90">
      {/* Big Horizontal Line */}

      {/* Footer Content */}
      <div className="container mx-auto flex flex-col items-center gap-4 py-8 px-4">

        {/* Small Thin Line */}
        <div className="border-t border-white w-1/2"></div>

        {/* Made with Love Text */}
        <div className="text-center text-base font-medium">
          Made with ❤️ by SATYAM
        </div>

        {/* Disclaimer */}
        <p className="text-center text-sm font-light">
          @Videos used in the website are not belongs to us.
        </p>

        {/* Social Links */}
        <div className="flex gap-6">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl transition-colors duration-300 hover:text-green-300"
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

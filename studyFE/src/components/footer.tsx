import { FaGithub, FaLinkedin } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

const links = [
    {
        href:'https://github.com/Satyamyaduvanshi',
        icon: <FaGithub/>
    },
    {
        href:'https://x.com/ysatyaa',
        icon: <FaX/>
    },
    {
        href:'https://www.linkedin.com/in/satyam-yadav-868375203/',
        icon: <FaLinkedin/>
    }

]


const Footer = ()=>{

    return (
        <footer className=" w-screen bg-green-500 py-4 text-white opacity-80 ">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-2 md:flex-row">
        <p className="text-center text-sm font-light md:text-left">
          @Videos used in the website are not belongs to us.
        </p>

        <div className="flex justify-center gap-4  md:justify-start">
          {links.map((link,index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors duration-500 ease-in-out hover:text-green-300"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
    )
}

export default Footer
import { ReactElement } from "react";

interface ButtonProps {
  text: string;
  variant: "primary" | "secondary";
  startIcon?: ReactElement;
  onClick?: () => void; // Change "click" to "onClick"
  type?: "button" | "submit" | "reset";
}

const variantClasses = {
  primary:
    "text-white bg-green-500 hover:bg-green-300 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900",
  secondary:
    "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700",
};

export function Button({ text, variant, startIcon, onClick, type="button" }: ButtonProps) {
  return (
    <button className={variantClasses[variant]} onClick={onClick} type={type}>
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {text}
    </button>
  );
}

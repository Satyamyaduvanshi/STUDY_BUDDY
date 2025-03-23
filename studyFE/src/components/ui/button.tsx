import { ReactElement } from "react";

interface ButtonProps {
  text: string;
  variant: "primary" | "secondary";
  startIcon?: ReactElement;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  classname?: string;
  disabled?: boolean;
}

const variantClasses = {
  primary:
    "text-white bg-green-500 hover:bg-green-300 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900 transition duration-300 ease-in-out transform hover:scale-105",
  secondary:
    "py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-green-300 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105",
};

export function Button({
  text,
  variant,
  startIcon,
  onClick,
  type = "button",
  classname = "",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center gap-2 ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${classname}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      <span>{text}</span>
    </button>
  );
}

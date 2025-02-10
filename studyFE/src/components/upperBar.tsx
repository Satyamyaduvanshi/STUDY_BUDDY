import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Bar() {

    return (
        <div className="flex justify-between text-base mx-6 my-4 bg-transparent p-3 items-center backdrop-blur-sm bg-green-200 rounded-lg">
        <div className="text-black text-4xl font-bold tracking-wide uppercase">
            Study
            
        <span className="text-purple-600">Buddy</span>
        </div>

        <div className="py-1">
            <Link to="signup">
                <Button text="Signup" variant="secondary"/>
                </Link>

                <Link to="/login">
                    <Button text="Login" variant="primary" />
                </Link>
        </div>
        </div>
    );
}

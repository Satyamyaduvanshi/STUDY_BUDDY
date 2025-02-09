import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Bar() {

    return (
        <div className="flex justify-between text-base mx-6 my-7 bg-transparent p-3 items-center">
        <div className="text-black text-4xl font-bold tracking-wide uppercase">
            Study
            
        <span className="text-purple-600">Buddy</span>
        </div>

        <div>
            <Link to="signin">
                <Button text="Signin" variant="secondary"/>
                </Link>

                <Link to="/login">
                    <Button text="Login" variant="primary" />
                </Link>
        </div>
        </div>
    );
}

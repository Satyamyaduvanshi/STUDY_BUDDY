import { useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "./ui/input";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");   

        try {
            const response = await axios.post("/api/user/signin", { email, password });
            const token = response.data.authorization;

           
            
            if (token) {
                localStorage.setItem("authorization", token);
                navigate("/dashboard");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err: any) {
            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        setError("Validation failed. Please check your input.");
                        break;
                    case 403:
                        setError("User not found. Please check your email.");
                        break;
                    case 401:
                        setError("Incorrect password. Try again.");
                        break;
                    case 500:
                        setError("Internal server error. Please try again later.");
                        break;
                    default:
                        setError("An unexpected error occurred.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
        } 
    };

    return (
        <div className="bg-green-300 flex h-screen justify-center items-center">
            <div className="bg-white text-black p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button text="login" type="submit" variant="primary">
                        
                    </Button>
                </form>

                <div className="mt-4 text-center">
                    <h6 className="text-sm">Don't have an account?</h6>
                    <Link to="/signup">
                        <Button text="signup" variant="secondary"></Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

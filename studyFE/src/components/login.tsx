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
            const { data } = await axios.post("/api/user/login", {
                email,
                password
            });

            localStorage.setItem("token", data.token);
            navigate("/dashboard"); 
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="bg-black flex h-screen justify-center items-center">
            <div className="bg-white text-black p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <form onSubmit={handleLogin} className="flex flex-col gap-3">

                    <Input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value) } required ={true} />

                    <Input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required={true} />
                   
                    <Button type="submit" variant="primary" text="login" />
                </form>

                <div className="mt-4 text-center">
                    <h6 className="text-sm">Don't have an account?</h6>
                    <Link to="/signup">
                        <Button text="singup" variant="secondary"/>
                    </Link>
                </div>
            </div>
        </div>
    );
}

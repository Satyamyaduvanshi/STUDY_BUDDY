import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Bar } from "./upperBar";
import Footer from "./footer";

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
        navigate("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Validation failed. Check input.");
            break;
          case 403:
            setError("User not found.");
            break;
          case 401:
            setError("Incorrect password.");
            break;
          case 500:
            setError("Server error. Try again.");
            break;
          default:
            setError("Unexpected error.");
        }
      } else {
        setError("Network issue.");
      }
    }
  };

  return (
    <>
      <Bar />
      <div className="flex h-screen justify-center items-center bg-gradient-to-br from-black via-green-800 to-black">
        <div className="bg-gray-950 text-white p-10 rounded-2xl shadow-2xl w-[400px] border border-gray-800">
          <h2 className="text-center text-2xl font-semibold mb-6">Login to your account</h2>

          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl p-3 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl p-3 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <Button
              text="Login"
              type="submit"
              variant="primary"
              classname="rounded-xl py-3 text-white font-semibold"
            />
          </form>

          <div className="mt-6 text-center text-sm">
            <p>Don't have an account?</p>
            <Link to="/signup" className="flex justify-center items-center">
              <Button
                text="Signup"
                variant="secondary"
                classname="mt-2 rounded-xl py-2 px-4 border border-blue-500 text-blue-500 hover:bg-gray-800"
              />
            </Link>
          </div>
        </div>
      </div>
     
    </>
  );
}

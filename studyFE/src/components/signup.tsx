import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Bar } from "./upperBar";
import Footer from "./footer";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const responseSignup = await axios.post("/api/user/signup", {
        name,
        email,
        password,
      });

      if (responseSignup.data.message) {
        const responseSignin = await axios.post("/api/user/signin", { email, password });
        const token = responseSignin.data.authorization;

        if (token) {
          localStorage.setItem("authorization", token);
          navigate("/");
        } else {
          setError("Signin failed after signup.");
        }
      } else {
        setError("User creation failed.");
      }
    } catch (err: any) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
            setError("Validation failed. Check your input.");
            break;
          case 403:
            setError("User already exists.");
            break;
          case 500:
            setError("Internal server error.");
            break;
          default:
            setError("Unexpected error.");
        }
      } else {
        setError("Network error. Check connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Bar />
      <div className="flex h-screen justify-center items-center bg-gradient-to-br from-black via-green-800 to-black">
        <div className="bg-gray-950 text-white p-10 rounded-2xl shadow-2xl w-[400px] border border-gray-800">
          <h2 className="text-center text-2xl font-semibold mb-6">Create Account</h2>

          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
              className="rounded-xl p-3 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="rounded-xl p-3 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="rounded-xl p-3 bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />

            <Button
              text={loading ? "Signing Up..." : "Sign Up"}
              type="submit"
              variant="primary"
              classname="rounded-xl py-3 text-white font-semibold"
            />
          </form>

          <div className=" mt-6 text-center text-sm">
            <p>Already have an account?</p>
            <Link to="/login" className="flex justify-center items-center ">
              <Button
                text="Login"
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

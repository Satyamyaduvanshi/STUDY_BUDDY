import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

export default function SignuPage() {
    const [name, setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")
    
    const navigate = useNavigate()

    const handleSignup = async(e: React.FormEvent)=>{
        e.preventDefault();
        setError("");

        try {
            await axios.post("/api/user/signup",{
                name,
                email,
                password
            })
            try {
                const {data} = await axios.post("/api/user/login",{
                    email,
                    password
                })


                localStorage.setItem("authorization",data.token)
                navigate("/home")
                  
            } catch (err: any) {
                setError(err.response?.data?.message || "login failed during signup ")
                
            }

        } catch (err:any) {
            setError(err.response?.data?.message || "signup failed")
            
        }
    }

    return <div className="bg-black flex h-screen justify-center items-center">
        <div className=" bg-white text-black p-8 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">Create Account</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <form onSubmit={handleSignup} className="flex flex-col gap-3">
                <Input type="name" value={name} onChange={(e)=> setName(e.target.value)} required={true} placeholder="Your Name" />

                <Input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} required={true}/>

                <Input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required={true}/>

                <Button type="submit" variant="primary" text="signup"/>

            </form>

            <div className="mt-4 text-center flex justify-center items-center">
                <h6 className="text-sm ml-4">
                    already has an account?
                </h6>
                <Link to="/login">
                <Button text="login" variant="secondary"/>
                </Link>

            </div>


        </div>

    </div>
}
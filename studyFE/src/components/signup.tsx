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
            const responseSignup = await axios.post("/api/user/signup",{
                name,
                email,
                password
            })

            const message: string = responseSignup.data.message

            if(message){

                try {
                    const responseSignin = await axios.post("/api/user/signin",{
                        email,
                        password
                    })
                    const token = responseSignin.data.authorization


                    if(token){
                        
                    localStorage.setItem("authorization",token);
                    navigate("/home")      
                      
                    }
                    else{
                        setError("signin error in signup")
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

            }else{
                setError("user not created")
            }
            
            

        } catch (err:any) {
            
            if(err.response){
                switch (err.response.status){
                    case 400: 
                        setError(" validation failed, please try again")
                        break;
                    case 403:
                        setError("user already exist, use another email")
                        break;
                    case 500:
                        setError("Internal server error. please try again!")
                        break;
                    default:
                        setError("an unexpected error occurred")
                }
            }else{
                setError("Network error. Please check your connection.")
            }
            
        }
    }

    return <div className="bg-green-300 flex h-screen justify-center items-center">
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
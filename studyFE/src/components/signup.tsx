import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SignuPage() {
    const [name, setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")
    
    const navigate = useNavigate()

    const handleSignup = async(e: React.FormEvent)=>{
        e.preventDefault();
        setEmail("")

        try {
            const {data}= await axios.post("http://localhost:3000/api/user/signup",{
                name,
                email,
                password
            })
            try {
                
            } catch (e) {
                
            }

        } catch (e) {
            setError(e.response?.data?.message || "signup failed")
            
        }
    }

    return 
    
}
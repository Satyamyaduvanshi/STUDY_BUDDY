import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { signinType, signupType, updateType } from "../types";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import { CustomRequest } from "../interfaces/request";
import dotenv from "dotenv"

dotenv.config();

const jwt_secret = process.env.JWT_SECRET as string;
if(!jwt_secret){
    throw new Error(" jwt not found")
}

const client = new PrismaClient();


//* signup 

export const signup = async(req:Request,res:Response)=>{
    const parsedData = signupType.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({
            message: "validation falied"
        })
        return;
    }
    const {name,email,password} = req.body;
    try {
        const exitsUser = await client.user.findUnique({
            where:{
                email: email
            }
        })
        if(exitsUser){
            res.status(403).json({
                message: "user already exist"
            })
            return;
        }
        const hashPassword = await bcrypt.hash(password,10);

        await client.user.create({
            data:{
                name,
                email,
                password: hashPassword
            }
        })

        res.status(200).json({
            message: "user created successfully"
        })
        return;
                
    }catch(e){
        console.error("signup error: ",e);
        res.status(500).json({
            message: "db error"
        })
        return;
        
    }
}

//* signin

export const signin = async(req:Request,res:Response)=>{

    const parsedData = signinType.safeParse(req.body);
    if(!parsedData.success){
        res.status(400).json({
            message: "validation falied"
        })
        return;
    }
    const {email,password} = req.body;

    try {
        const response = await client.user.findUnique({
            where: {
                email: email
            },
            select:{
                password: true,
                id: true
            }
        })
        if(!response){
            res.status(403).json({
                message: "user not found"
            })
            return;
        }
        
        const match = await bcrypt.compare(password,response.password);
        if(!match){
            res.status(401).json({
                message: "incorrect password"
            })
            return;
        }

        const token = await jwt.sign({
            id: response.id
        },jwt_secret);

        res.status(200).json({
            authorization: `Bearer ${token}`,
        })



        
    } catch (e) {
        console.error("signin error: ",e);
        res.status(500).json({
            message: "error in db"
        })
        return;
        
        
    }

}

//* delete user
export const deleteUser = async(req:CustomRequest,res:Response)=>{
    try {
       const response =await client.user.delete({
            where: {
                id: req.id
            }
        })
        if(!response){
            res.status(404).json({
                message: "user not found"
            })
            return;
        }
        res.status(200).json({
            message: "user deleted successfull"
        })

        
    } catch (e) {
        console.error("delete user error: ",e);
        res.status(500).json({
            message: "error in db"
        })
        return
                
    }
}

//* show user its profile

export const profile = async(req:CustomRequest,res:Response)=>{
    try {
        console.log(req.id);
        
        const response = await client.user.findFirst({
            where:{
                id: req.id
            },select:{
                name: true,
                email: true
            }
        })
        if(!response){
            res.status(404).json({
                message: "user not found"
            })
            return;
        }
        console.log(response);
        
        res.status(200).json({
            user: response
        })
        
    } catch (e) {
        console.error("profile error: ",e);
        res.status(500).json({
            message: "error connectin to db"
        })
        return; 
    }
}

export const updateUser = async(req:CustomRequest,res:Response)=>{
    const parsedData = updateType.safeParse(req.body);
    const {name} = req.body;
    try {
        const response = await client.user.update({
            where:{
                id: req.id
            },data:{
                name: name
            }
        })

        res.status(200).json({
            message: `name successfully changes to ${name}`
        })

    } catch (e) {
        console.error("update user error: ",e);
        res.status(500).json({
            message: "error in DB"
        })
        return;
    }
}

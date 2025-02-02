import express  from "express";
import { signinType, signupType } from "./types";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import auth from "./authMiddleware";
import { CustomRequest } from "./interfaces/request";

dotenv.config();


const app = express();
const client = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET;

if(!jwt_secret){
  throw new Error("missing jwt_secret")
}

app.use(express.json());

app.post("/signup",async(req,res)=>{
  const parsedData = signupType.safeParse(req.body);
  if(!parsedData.success){  
    res.status(400).json({
      message: "validation failed put correct input"
    })
    return;
  }

  try {
    const hashPassword = await bcrypt.hash(req.body.password,10);

    await client.user.create({
      data:{
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
      } 
    });

    res.status(201).json({
      message: "signup successful"
    })
    return

  } catch (e) {
    console.error("sis jwt payloadignup ERROR:", e);
    res.status(500).json({
      message : "error while signup"
    })
  }

})


app.post("/signin",async(req,res)=>{
  const parsedData = signinType.safeParse(req.body);
  if(!parsedData.success){
    res.status(400).json({
      message: "validation failed"
    })
  }

  try {

  const user = await client.user.findFirst({
    where:{
      email: req.body.email
    },
    select:{
      password: true,
      id: true
    }
  });

  if(!user){
      res.status(404).json({
        message: "user not found"
      });
    }

  const match =bcrypt.compare(req.body.password, user?.password as string)
  if(!match){
      res.status(401).json({
        message: "wrong password"
      })
    }
  const token = jwt.sign({
      id: user?.id
    },jwt_secret);

  res.status(200).json({token})
  return;

} catch(e){
    console.error("Signin error: ", e);
    res.status(500).json({
      message: "something goes wrong in signin"
    })
}

})


app.get("/profile",auth,async(req:CustomRequest,res)=>{

  try {
    const user = await client.user.findFirst({
      where:{
        id: req.id
      },
      select:{
        name: true,
        email: true,
      }
    })

    if(!user){
      res.status(404).json({
        message: "user not found"
      })
      return;
    }

    res.status(200).json(user)


  } catch (e) {
    console.error("profile error: ",e);
    res.status(500).json({
      message: "error connecting to DB"
    })
    return;
  }
})





app.listen(3000);

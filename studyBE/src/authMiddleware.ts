import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "./interfaces/request";
import dotenv from "dotenv";

dotenv.config();

const jwt_secret = process.env.JWT_SECRET || "";

function auth(req: CustomRequest, res: Response, next: NextFunction) {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ 
        message: "Unauthorized: No token provided" 
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, jwt_secret) as JwtPayload;

    if (!decode || typeof decode !== "object" || !decode.id) {
      res.status(403).json({ 
        message: "Unauthorized: Invalid token" 
      });
      return;
    }

    req.id = decode.id; 
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    return;
  }
}

export default auth;


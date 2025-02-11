import { Request, Response, Router } from "express";
import userRoutes from "./userRoutes"

const router = Router();

//* home route
const homeRoutes = (req:Request,res:Response)=>{
    try {
       res.status(200).json({
           message: " welcome to the STUDY BUDDY api homepage!!"
        })
        
    } catch (e) {
        res.status(500).json({
            message: "internal server error"
        })
        return;
        
    }
}

//* user routes
router.use("/api/user",userRoutes)
router.get("/api/",homeRoutes)
//* rooms routes

export default router;
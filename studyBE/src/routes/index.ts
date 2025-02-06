import { Router } from "express";
import userRoutes from "./userRoutes"

const router = Router();

//* home route
router.use("/",(req,res)=>{
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
})

//* user routes
router.use("/api/user",userRoutes)
//* rooms routes

export default router;
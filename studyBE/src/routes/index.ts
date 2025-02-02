import { Router } from "express";
import userRouter from "./userRoutes"

const router = Router();


//* user router
router.use("/api/user",userRouter)

export default router;
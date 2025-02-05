import { Router } from "express";
import userRoutes from "./userRoutes"

const router = Router();


//* user routes
router.use("/api/user",userRoutes)
//* rooms routes

export default router;
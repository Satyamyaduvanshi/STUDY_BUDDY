import { Router } from "express";
import userRoutes from "./userRoutes"
import roomRoutes from "./roomRoutes";

const router = Router();


//* user routes
router.use("/api/user",userRoutes)
//* rooms routes
router.use("/api/room/home",roomRoutes)

export default router;
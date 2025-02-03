import { Router } from "express";
import { 
    signup,
    signin,
    profile,
    deleteUser,
    updateUser,

    } from "../controller/UserController";

import auth from "../middleware/authMiddleware";

const userRoutes = Router();

userRoutes.post("/signup",signup);
userRoutes.post("/signin",signin);
userRoutes.get("/profile",auth,profile);
userRoutes.delete("/deleteuser",auth,deleteUser);
userRoutes.put("/updateuser",auth,updateUser);

export default userRoutes;
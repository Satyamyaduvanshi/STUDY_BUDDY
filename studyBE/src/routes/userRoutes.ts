import { Router } from "express";
import { signup,signin,profile,deleteUser } from "../controller/UserController";
import auth from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.post("/signup",signup);
userRouter.post("/signin",signin);
userRouter.get("/profile",auth,profile);
userRouter.delete("/deleteUser",auth,deleteUser);

export default userRouter;
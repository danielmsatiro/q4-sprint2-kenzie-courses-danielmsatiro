import { Router } from "express";

const userRouter = Router();

userRouter.post("/login");
userRouter.post("/register");

export default userRouter;
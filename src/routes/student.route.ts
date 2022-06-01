import { Router } from "express";

const studentRouter = Router();

studentRouter.post("/login");
studentRouter.post("/register");

export default studentRouter;
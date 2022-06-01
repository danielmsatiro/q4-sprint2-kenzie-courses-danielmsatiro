import userRouter from "./user.route";
import { Express } from "express";
import courseRouter from "./course.route";

const registerRouters = (app: Express): void => {
  app.use("/api", userRouter);
  app.use("/api", courseRouter);
};

export default registerRouters;

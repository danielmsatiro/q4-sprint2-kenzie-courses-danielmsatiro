import { Express } from "express";
import courseRouter from "./course.route";
import userRouter from "./user.route";

const registerRouters = (app: Express): void => {

    app.use(userRouter);
    app.use(courseRouter);
  };
  
export default registerRouters;



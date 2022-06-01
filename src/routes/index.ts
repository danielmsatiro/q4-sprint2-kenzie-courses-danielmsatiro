import studentRouter from "./student.route";
import { Express } from "express";
import courseRouter from "./course.route";

const registerRouters = (app: Express): void => {
  app.use("/api", studentRouter);
  app.use("/api", courseRouter);
};

export default registerRouters;

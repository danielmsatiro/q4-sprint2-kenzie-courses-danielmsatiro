import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import registerRouters from "./routes";
import ErrorHandler from "./errors/app.errors";

const app = express();

app.use(express.json());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    if (err instanceof ErrorHandler) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }
  
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  });
  
registerRouters(app);

export default app;

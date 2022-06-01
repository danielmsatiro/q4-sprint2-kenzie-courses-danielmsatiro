import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { ErrorHandler } from "../errors/errors";

const validateSchema =
  (shape: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await shape.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      req.validated = validated;
      console.log(req.validated);

      return next();
    } catch (error) {
      return res.status(400).json({ message: error.errors });
    }
  };

export default validateSchema;

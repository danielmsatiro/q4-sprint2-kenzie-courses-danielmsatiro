import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../errors/errors";
import { userRepository } from "../repositories";

const getUserByIdOr404 = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const user = await userRepository.retrieve({ id: id });
    if (!user) {
      throw new ErrorHandler(404, "User not found");
    }
    req.user = user;
  } catch {
    throw new ErrorHandler(404, "User not found");
  }

  return next();
};

export default getUserByIdOr404;

import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../errors/errors";
import { userRepository } from "../repositories";

const verifyPermission = async (req: Request, res: Response, next: NextFunction) => {
  const { decoded } = req;

  const user = await userRepository.retrieve({id: decoded.id})

  if (!user.isAdm) {
    throw new ErrorHandler (401, "You are not allowed to access this information")    
  }

  return next();
};

export default verifyPermission;

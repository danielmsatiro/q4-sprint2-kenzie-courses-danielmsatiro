import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../errors/errors";
import { userRepository } from "../repositories";

const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { decoded } = req;

  const user = await userRepository.retrieve({id: decoded.id})

  const paramsUser = req.user;

  if (user.isAdm) {
    return next();
  }

  if (user.id != paramsUser.id) {
    throw new ErrorHandler (403, "You can't access information of another user");
  }

  return next();
};

export default verifyAdmin;

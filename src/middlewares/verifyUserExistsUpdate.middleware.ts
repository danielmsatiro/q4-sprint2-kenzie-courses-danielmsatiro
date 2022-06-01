import { NextFunction, Request, Response } from "express";
import { User } from "../entities";
import { userRepository } from "../repositories";
import { ErrorHandler } from "../errors/errors";

const verifiUserExistsUpdate = async (req: Request, res: Response, next: NextFunction) => {
  
  if ((req.validated as Partial<User>).email) {
    const foundUser: User = await userRepository.retrieve({
      email: (req.validated as User).email,
    });
  
    if (foundUser) {
       throw new ErrorHandler(409, "User already exists")        
      }
  }
  
  return next();
};

export default verifiUserExistsUpdate;
import { NextFunction, Request, Response } from "express";

const verifyPermission = async (req: Request, res: Response, next: NextFunction) => {
  const { decoded } = req;

  if (!decoded.isAdm) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return next();
};

export default verifyPermission;

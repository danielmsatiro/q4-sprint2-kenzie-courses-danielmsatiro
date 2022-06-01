import { Request, Response } from "express";
import userService from "../services/user.service";

class UserController {
  loginUser = async (req: Request, res: Response) => {
    const { status, message } = await userService.login(req);
    console.log(status, message);
    return res.status(status).json(message);
  };

  createUser = async (req: Request, res: Response) => {
    const user = await userService.create(req);
    return res.status(201).json(user);
  };

  getById = async (req: Request, res: Response) => {
    const user = await userService.getById(req);
    return res.status(200).json(user);
  };

  getAll = async (_: Request, res: Response) => {
    const users = await userService.getAll();
    return res.status(200).json(users);
  };

  update = async (req: Request, res: Response) => {
    const user = await userService.update(req);
    return res.status(200).json(user);
  };
}

export default new UserController();

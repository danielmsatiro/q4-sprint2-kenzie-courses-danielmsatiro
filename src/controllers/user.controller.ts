import { Request, Response } from "express";
import userService  from "../services/user.service";


class UserController {
    loginUser = async (req: Request, res: Response) => {
        const token = await userService.login(req.body)
        return res.status(200).json({token})
    }

    createUser = async (req: Request, res: Response) => {
        const user = await userService.create(req.body)
        return res.status(201).json({user});
    }

    getById = async (req: Request, res: Response) =>{
        const users = await userService.getById(req.params.id)
        return res.status(201).json({users});
    }

    update = async (req: Request, res: Response) => {
        await userService.update(req.params.id, req.body)
        res.status(200).send()
    }
}

export default new UserController();

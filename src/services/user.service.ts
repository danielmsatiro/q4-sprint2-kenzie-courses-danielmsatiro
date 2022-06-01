import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import ErrorHandler from "../errors/app.errors";
import { User } from "../entities/User.entity";

dotenv.config();

interface ILogin {
  email: string;
  password: string;
}

interface ICreateUser {
  firstName: string
  lastName: string
  email: string
  password: string
}

interface IUpdateUser {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

class UserService{

  login = async (body: ILogin): Promise<string> =>{
    const {email, password} = body
    const user: User = await userRepository.findOne({email: email})
      
    if(!user){
      throw new ErrorHandler("Invalid credentials", 400)
    }
    if(!(await user.comparePwd(password))){
      throw new ErrorHandler("Invalid credentials", 400)
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.SECRET_KEY as string,
      {
          expiresIn: process.env.EXPIRES_IN,
      }
    );
    return token
  }

  create = async ({email,firstName,lastName,password}:ICreateUser): Promise<User> => {
    const userAlreadyExists = await userRepository.findOne({email: email});
    if (userAlreadyExists) {
      throw new ErrorHandler("User already exists", 409);
    }

    password = await bcrypt.hash(password, 10);
    const user = await userRepository.save({email,firstName,lastName,password})
    return user
  }

  getById = async (id: string) => {
    const user = await userRepository.findOne({id: id});
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }
    
    return user

  }

  update = async (id: string, data: IUpdateUser): Promise<User> => {
    const user = await userRepository.findOne({id: id});
    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }
    
    return await userRepository.update(id, data)
  }
}

export default new UserService();
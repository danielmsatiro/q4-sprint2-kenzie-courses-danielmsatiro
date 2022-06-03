import { User } from "../entities/User.entity";
import { courseRepository, userRepository } from "../repositories";
import { Request } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { ErrorHandler } from "../errors/errors";
import {
  serializedAdminUsersSchema,
  serializedCreateUserSchema,
} from "../schemas";
import { AssertsShape } from "yup/lib/object";
import { ISubscribe } from "../@types/express";

dotenv.config();

interface ILogin {
  status: number;
  message: object;
}

class UserService {
  login = async ({ validated }: Request): Promise<ILogin> => {
    console.log(validated, "login");

    const user: User = await userRepository.retrieve({
      email: (validated as User).email,
    });
    console.log(user, "user");
    if (!user) {
      return {
        status: 401,
        message: { message: "Invalid credentials" },
      };
    }
    if (!(await user.comparePwd((validated as User).password))) {
      return {
        status: 401,
        message: { message: "Invalid credentials" },
      };
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.EXPIRES_IN,
    });

    return {
      status: 200,
      message: { token },
    };
  };

  create = async ({ validated }: Request): Promise<AssertsShape<any>> => {
    const user = await userRepository.save(validated as User);
    const createdUser = await userRepository.retrieve({ id: user.id });
    return await serializedCreateUserSchema.validate(createdUser, {
      stripUnknown: true,
    });
  };

  getById = async ({ user }: Request): Promise<AssertsShape<any>> => {
    const findedUser = await userRepository.retrieve({ id: user.id });
    return await serializedCreateUserSchema.validate(findedUser, {
      stripUnknown: true,
    });
  };

  getAll = async (): Promise<AssertsShape<any>> => {
    const users = await userRepository.listAll();
    return await serializedAdminUsersSchema.validate(users, {
      stripUnknown: true,
    });
  };

  update = async ({ validated, user }: Request): Promise<AssertsShape<any>> => {
    await userRepository.update(user.id, { ...(validated as User) });
    const updatedUser = await userRepository.retrieve({ id: user.id });
    return await serializedCreateUserSchema.validate(updatedUser, {
      stripUnknown: true,
    });
  };

  userSubscribeCourse = async ({
    validated,
    params,
  }): Promise<AssertsShape<any>> => {
    const course = await courseRepository.retrieve({
      id: (validated as ISubscribe).courseId,
    });

    if (!course) {
      throw new ErrorHandler(404, "Course not found");
    }

    const studant = await userRepository.retrieve({ id: params.id });

    studant.courses.push(course);

    await userRepository.save(studant);

    const updatedUser = await userRepository.retrieve({ id: studant.id });

    return await serializedCreateUserSchema.validate(updatedUser, {
      stripUnknown: true,
    });
  };
}

export default new UserService();

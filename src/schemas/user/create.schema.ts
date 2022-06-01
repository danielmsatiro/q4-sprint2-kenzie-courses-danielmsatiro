import * as yup from "yup";
import { hashSync } from "bcrypt";

const createUserSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().lowercase().required(),
  password: yup
    .string()
    .transform((pwd: string) => hashSync(pwd, 8))
    .required(),
  isAdm: yup.boolean().default(false).optional(),
  createdAt: yup.date().default(new Date()).optional(),
  updatedAt: yup.date().default(new Date()).optional(),
});

const userUpdateSchema = yup.object().shape({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  email: yup.string().email().lowercase().optional(),
  password: yup
    .string()
    .transform((pwd: string) => hashSync(pwd, 8))
    .optional(),
  updatedAt: yup.date().default(new Date()).optional(),
});

const serializedCreateUserSchema = yup.object().shape({
  id: yup.string().uuid().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  isAdm: yup.boolean().required(),
  createdAt: yup.date().required(),
  updatedAt: yup.date().required(),
  courses: yup.array().of(yup
    .object()
    .shape({
    id: yup.string().uuid().optional(),
    courseName: yup.string().optional(),
    duration: yup.string().optional(),
  })),
});

export { createUserSchema, serializedCreateUserSchema, userUpdateSchema  }
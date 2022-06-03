import { faker } from "@faker-js/faker";

import { Course, User } from "../entities";
import jwt from "jsonwebtoken";

const generateUser = (): Partial<User> => {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  const email = faker.internet.email(firstName).toLowerCase();
  const password = faker.datatype.string(10);

  return { firstName, lastName, email, password };
};

const generateCourse = (): Partial<Course> => {
  const courseName = faker.definitions.title.toLowerCase();
  const duration = faker.datatype.string(4).toLowerCase();

  return { courseName, duration };
};

const generateToken = (id: string): string => {
  const token = jwt.sign({ id: id }, process.env.SECRET_KEY as string, {
    expiresIn: process.env.EXPIRES_IN,
  });

  return token;
};

export { generateUser, generateToken, generateCourse };

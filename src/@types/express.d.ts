import { Course, User } from "../entities";

declare global {
  namespace Express {
    interface Request {
      validated: User | Course;
      decoded: User
    }
  }
}
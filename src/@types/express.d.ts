import { Course, User } from "../entities";

interface ISubscribe {
  courseId: string;
}

declare global {
  namespace Express {
    interface Request {
      validated: User | Course | ISubscribe;
      decoded: Partial<User>;
      user: User;
    }
  }
}

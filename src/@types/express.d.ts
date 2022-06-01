import { User } from "../entities/User.entity";

declare global {
  namespace Express {
    interface Request {
      validated: User;
      decoded: User
    }
  }
}
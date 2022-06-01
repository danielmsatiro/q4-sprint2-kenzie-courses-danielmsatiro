import { Router } from "express";
import { courseController } from "../controllers";
import { validateSchema, validateToken, verifyPermission } from "../middlewares";

const courseRouter = Router();

courseRouter.get("/courses", validateToken, courseController.readAll);
courseRouter.post(
  "/courses",
  validateToken,
  verifyPermission,
  validateSchema(createCourseSchema),
  courseController.createCourse
);

export default courseRouter;

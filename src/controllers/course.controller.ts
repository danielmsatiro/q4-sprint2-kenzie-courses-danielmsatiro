import { Request, Response } from "express";
import { courseService } from "../services";

class CourseController {
  createCourse = async (req: Request, res: Response) => {
    const course = await courseService.createCourse(req);

    return res.status(201).json(course);
  };

  readAll = async (_: Request, res: Response) => {
    const courses = await courseService.readAllCourses();

    return res.status(200).json(courses);
  };
}

export default new CourseController();

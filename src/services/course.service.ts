import { Request } from "express";
import { AssertsShape } from "yup/lib/object";
import { Course } from "../entities";

class CourseService {
  createCourse = async ({ validated }: Request): Promise<AssertsShape<any>> => {
    const course: Course = await courseRepository.save(validated);

    return await serializedCourseSchema.validate(course, { stripUnknown: true });
  };

  readAllCourses = async (): Promise<AssertsShape<any>> => {
    const courses: Course[] = await courseRepository.all();

    return await serializedCoursesSchema.validate(courses, { stripUnknown: true });
  };
}

export default new CourseService();

import * as yup from "yup";

const subscribeCourseSchema = yup.object().shape({
  courseId: yup.string().uuid().required(),
});

export { subscribeCourseSchema };

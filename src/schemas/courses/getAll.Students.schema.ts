import * as yup from "yup";

const serializedStudentsCoursesSchema = yup
  .array()
  .of(
    yup.object().shape({
      id: yup.string().uuid().required(),
      courseName: yup.string().required(),
      duration: yup.string().required(),
    })
  )
  .required();

export default serializedStudentsCoursesSchema;
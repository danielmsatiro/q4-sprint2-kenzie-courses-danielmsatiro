import * as yup from "yup";

const serializedAdminCoursesSchema = yup
  .array()
  .of(
    yup.object().shape({
      id: yup.string().uuid().required(),
      courseName: yup.string().required(),
      duration: yup.string().required(),
      students: yup.array().of(yup
        .object()
        .shape({
        id: yup.string().uuid().optional(),
        firstName: yup.string().optional(),
        lastName: yup.string().optional(),
        email: yup.string().email().optional(),
      })).optional(),      
    })
  );

export default serializedAdminCoursesSchema;
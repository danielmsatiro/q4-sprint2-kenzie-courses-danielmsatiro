import * as yup from "yup";

const serializedAdminUsersSchema = yup
  .array()
  .of(yup
    .object().shape({
    id: yup.string().uuid().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    isAdm: yup.boolean().required(),
    createdAt: yup.date().required(),
    updatedAt: yup.date().required(),
  })
  ).required();

export default serializedAdminUsersSchema;
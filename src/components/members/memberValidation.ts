import * as Yup from "yup";

export const memberValidationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Temporary password is required"),
});

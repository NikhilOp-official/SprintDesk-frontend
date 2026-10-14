import * as Yup from "yup";
export const issueFormValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .max(120, "Title must be at most 120 characters")
    .required("Title is required"),

  description: Yup.string().max(
    2000,
    "Description must be at most 2000 characters",
  ),

  status: Yup.string()
    .oneOf(["To Do", "In Progress", "In Review", "Done"])
    .required("Status is required"),

  priority: Yup.string()
    .oneOf(["Low", "Medium", "High"])
    .required("Priority is required"),

  dueDate: Yup.string().nullable(),
});

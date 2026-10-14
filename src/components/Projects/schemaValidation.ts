import * as Yup from "yup";

export type ProjectStatus = "active" | "archived";

export interface ProjectFormValues {
  name: string;
  description: string;
}

export interface EditProjectFormValues extends ProjectFormValues {
  status: ProjectStatus;
}

export const projectFormValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .required("Project name is required"),

  description: Yup.string().max(
    500,
    "Description cannot exceed 500 characters",
  ),
});

export const editProjectValidationSchema = projectFormValidationSchema.shape({
  status: Yup.string()
    .oneOf(["active", "archived"])
    .required("Status is required"),
});

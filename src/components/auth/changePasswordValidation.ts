import * as Yup from "yup";

export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),

  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

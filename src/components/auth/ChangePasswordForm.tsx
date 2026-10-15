import { Form, Formik } from "formik";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import InputField from "@/components/common/InputField";
import { useChangePasswordMutation } from "@/store/api/auth/mutation";
import { changePasswordValidationSchema } from "./changePasswordValidation";

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const initialValues: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async (
    values: ChangePasswordValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success(response.message);
      resetForm();
      onSuccess();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to change password";

      toast.error(message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={changePasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className="space-y-4">
          <InputField
            name="currentPassword"
            label="Current password"
            type="password"
            autoComplete="current-password"
          />

          <InputField
            name="newPassword"
            label="New password"
            type="password"
            autoComplete="new-password"
          />

          <InputField
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !dirty || !isValid}
          >
            {isLoading ? "Updating password..." : "Change password"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

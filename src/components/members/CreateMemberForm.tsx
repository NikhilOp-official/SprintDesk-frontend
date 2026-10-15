import { Formik, Form } from "formik";
import { toast } from "sonner";
import { memberValidationSchema } from "./memberValidation";

import { Button } from "@/components/ui/button";
import { useCreateMemberMutation } from "@/store/api/auth/mutation";
import InputField from "../common/InputField";

interface CreateMemberFormProps {
  setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface MemberFormValues {
  name: string;
  email: string;
  password: string;
}

const initialValues: MemberFormValues = {
  name: "",
  email: "",
  password: "",
};

export default function CreateMemberForm({
  setCreateOpen,
}: CreateMemberFormProps) {
  const [createMember, { isLoading }] = useCreateMemberMutation();

  const handleSubmit = async (
    values: MemberFormValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    try {
      const response = await createMember(values).unwrap();
      toast.success(response.message);
      resetForm();
      setCreateOpen(false);
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
          : "Unable to create member";

      toast.error(message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={memberValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className="space-y-4">
          <InputField
            name="name"
            label="Full name"
            placeholder="Enter member name"
          />

          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email address"
          />

          <InputField
            name="password"
            label="Password"
            type="password"
            placeholder="Enter temporary password"
          />

          <Button
            type="submit"
            disabled={isLoading || !dirty || !isValid}
            className="w-full"
          >
            {isLoading ? "Creating member..." : "Create member"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

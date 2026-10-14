import { Formik, Form } from "formik";
import { toast } from "sonner";
import { useUpdateProjectMutation } from "@/store/api/projects/mutation";
import { Button } from "@/components/ui/button";
import SelectField from "../common/SelectField";
import {
  editProjectValidationSchema,
  type EditProjectFormValues,
  type ProjectStatus,
} from "./schemaValidation";
import ProjectForm from "./ProjectForm";

interface EditProjectFormProps {
  projectId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  onSuccess: () => void;
}

export default function EditProjectForm({
  projectId,
  name,
  description,
  status,
  onSuccess,
}: EditProjectFormProps) {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  return (
    <Formik<EditProjectFormValues>
      initialValues={{ name, description: description || "", status }}
      validationSchema={editProjectValidationSchema}
      enableReinitialize
      onSubmit={async (values) => {
        try {
          await updateProject({
            projectId,
            name: values.name.trim(),
            description: values.description.trim(),
            status: values.status,
          }).unwrap();

          toast.success("Project updated successfully");
          onSuccess();
        } catch {
          toast.error("Failed to update project");
        }
      }}
    >
      {({
        isSubmitting,

        handleBlur,
      }) => (
        <Form className="space-y-4">
          <ProjectForm />
          <SelectField
            label="Project Status"
            name="status"
            id="status"
            onBlur={handleBlur}
            options={[
              { label: "Active", value: "active" },
              { label: "Archived", value: "archived" },
            ]}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
